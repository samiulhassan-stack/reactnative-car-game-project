// ============================================================
//  TURBO RACER ELITE  –  Complete HTML5 Canvas Game
//  Pure JavaScript, no dependencies
// ============================================================
(function () {
  'use strict';

  // ── Canvas setup ──────────────────────────────────────────
  const canvas = document.getElementById('gameCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = 500;
  canvas.height = 700;

  // ── Constants ─────────────────────────────────────────────
  const W = canvas.width;
  const H = canvas.height;
  const ROAD_LEFT   = 80;
  const ROAD_RIGHT  = 420;
  const ROAD_W      = ROAD_RIGHT - ROAD_LEFT;
  const LANE_W      = ROAD_W / 3;
  const LANE_X      = [ROAD_LEFT + LANE_W * 0.5,
                        ROAD_LEFT + LANE_W * 1.5,
                        ROAD_LEFT + LANE_W * 2.5];
  const CAR_H       = 80;
  const CAR_W       = 44;
  const ENEMY_SPAWN_INTERVAL_BASE = 90; // frames
  const COIN_SPAWN_INTERVAL_BASE  = 60;

  // ── Audio Context ─────────────────────────────────────────
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }
  function playTone(freq, type, duration, vol = 0.2, startTime) {
    try {
      const ac  = getAudioCtx();
      const osc = ac.createOscillator();
      const gain= ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = type; osc.frequency.value = freq;
      const t = startTime !== undefined ? startTime : ac.currentTime;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.start(t); osc.stop(t + duration);
    } catch(e){}
  }
  function playCrash() {
    try {
      const ac = getAudioCtx();
      const t  = ac.currentTime;
      playTone(120, 'sawtooth', 0.3, 0.4, t);
      playTone(80,  'square',   0.4, 0.3, t + 0.05);
      playTone(60,  'sawtooth', 0.5, 0.25, t + 0.1);
    } catch(e){}
  }
  function playCoin() {
    try {
      const ac = getAudioCtx();
      const t  = ac.currentTime;
      playTone(880, 'sine', 0.08, 0.2, t);
      playTone(1100,'sine', 0.08, 0.15, t + 0.06);
    } catch(e){}
  }
  function playNitro() {
    try {
      const ac = getAudioCtx();
      const t  = ac.currentTime;
      playTone(200, 'sawtooth', 0.2, 0.15, t);
      playTone(400, 'sawtooth', 0.3, 0.15, t + 0.05);
    } catch(e){}
  }
  let engineOsc = null, engineGain = null;
  function startEngine() {
    try {
      const ac = getAudioCtx();
      if (engineOsc) return;
      engineOsc  = ac.createOscillator();
      engineGain = ac.createGain();
      engineOsc.connect(engineGain); engineGain.connect(ac.destination);
      engineOsc.type = 'sawtooth'; engineOsc.frequency.value = 55;
      engineGain.gain.value = 0.03;
      engineOsc.start();
    } catch(e){}
  }
  function stopEngine() {
    try { if (engineOsc) { engineOsc.stop(); engineOsc = null; engineGain = null; } } catch(e){}
  }
  function setEngineFreq(v) {
    try { if (engineOsc) engineOsc.frequency.value = 55 + v * 60; } catch(e){}
  }

  // ── High Score ────────────────────────────────────────────
  function loadHighScore(mode) {
    return parseInt(localStorage.getItem('hs_' + mode) || '0', 10);
  }
  function saveHighScore(mode, score) {
    if (score > loadHighScore(mode))
      localStorage.setItem('hs_' + mode, score);
  }

  // ── Game State ────────────────────────────────────────────
  const STATES = { MENU: 'MENU', PLAYING: 'PLAYING', PAUSED: 'PAUSED', GAMEOVER: 'GAMEOVER' };
  let state     = STATES.MENU;
  let gameMode  = 'ARCADE'; // ARCADE | SURVIVAL | TIME ATTACK

  // ── Input ─────────────────────────────────────────────────
  const keys = {};
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Space') e.preventDefault();
    if (e.code === 'KeyP' && state === STATES.PLAYING) { state = STATES.PAUSED; stopEngine(); }
    else if (e.code === 'KeyP' && state === STATES.PAUSED) { state = STATES.PLAYING; startEngine(); }
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  // ── Utility ───────────────────────────────────────────────
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function distSq(ax, ay, bx, by) { const dx=ax-bx,dy=ay-by; return dx*dx+dy*dy; }

  // ── Particle System ───────────────────────────────────────
  const particles = [];
  function spawnExplosion(x, y, count = 18) {
    for (let i = 0; i < count; i++) {
      const ang = rand(0, Math.PI * 2);
      const spd = rand(2, 7);
      particles.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 1, decay: rand(0.03, 0.07),
        r: rand(3, 7),
        color: ['#ff4400','#ff8800','#ffcc00','#ff2200','#ffffff'][randInt(0,4)]
      });
    }
  }
  function spawnSmoke(x, y) {
    particles.push({
      x, y,
      vx: rand(-0.5, 0.5),
      vy: rand(-1, -0.2),
      life: 1, decay: rand(0.025, 0.05),
      r: rand(4, 8),
      color: 'smoke',
      isSmoke: true
    });
  }
  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.isSmoke) { p.vx *= 0.98; p.vy *= 0.98; }
      p.life -= p.decay;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }
  function drawParticles() {
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.life * 0.85;
      if (p.isSmoke) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, 'rgba(180,180,180,0.6)');
        g.addColorStop(1, 'rgba(100,100,100,0)');
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = p.color;
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ── Floating Score Text ───────────────────────────────────
  const floatTexts = [];
  function spawnFloatText(x, y, text, color = '#FFD700') {
    floatTexts.push({ x, y, text, color, life: 1, vy: -1.5 });
  }
  function updateFloatTexts() {
    for (let i = floatTexts.length - 1; i >= 0; i--) {
      const f = floatTexts[i];
      f.y += f.vy; f.life -= 0.025;
      if (f.life <= 0) floatTexts.splice(i, 1);
    }
  }
  function drawFloatTexts() {
    for (const f of floatTexts) {
      ctx.save();
      ctx.globalAlpha = f.life;
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = f.color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillText(f.text, f.x, f.y);
      ctx.restore();
    }
  }

  // ── Screen Shake ──────────────────────────────────────────
  let shakeAmt = 0;
  function triggerShake(amt = 10) { shakeAmt = amt; }
  function getShakeOffset() {
    if (shakeAmt <= 0) return { x: 0, y: 0 };
    shakeAmt = Math.max(0, shakeAmt - 0.8);
    return { x: rand(-shakeAmt, shakeAmt), y: rand(-shakeAmt, shakeAmt) };
  }


  // ── Road / Background ─────────────────────────────────────
  let roadOffset   = 0;
  let bgOffset     = 0;
  let dayTime      = 0;   // 0-1 cycles day/night
  const SIDE_OBJS  = [];  // trees / buildings
  function initSideObjects() {
    SIDE_OBJS.length = 0;
    for (let i = 0; i < 20; i++) {
      SIDE_OBJS.push(makeSideObj(rand(0, H), i % 2 === 0 ? 'left' : 'right'));
    }
  }
  function makeSideObj(y, side) {
    const type = Math.random() < 0.55 ? 'tree' : 'building';
    return { y, side, type, yOffset: rand(0, H) };
  }

  function getSkyColors() {
    // day/night gradient based on dayTime 0..1
    const d = (Math.sin(dayTime * Math.PI * 2) + 1) / 2; // 0=night,1=day
    const top = lerpColor('#0a0a2e', '#87CEEB', d);
    const bot = lerpColor('#1a1a4e', '#d4e8ff', d);
    return { top, bot, dayness: d };
  }
  function lerpColor(c1, c2, t) {
    const p = (h) => parseInt(h, 16);
    const r1=p(c1.slice(1,3)),g1=p(c1.slice(3,5)),b1=p(c1.slice(5,7));
    const r2=p(c2.slice(1,3)),g2=p(c2.slice(3,5)),b2=p(c2.slice(5,7));
    const r=Math.round(r1+(r2-r1)*t).toString(16).padStart(2,'0');
    const g=Math.round(g1+(g2-g1)*t).toString(16).padStart(2,'0');
    const b=Math.round(b1+(b2-b1)*t).toString(16).padStart(2,'0');
    return `#${r}${g}${b}`;
  }

  function drawBackground(sky) {
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, sky.top);
    grad.addColorStop(1, sky.bot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Stars at night
    if (sky.dayness < 0.5) {
      ctx.save();
      ctx.globalAlpha = (0.5 - sky.dayness) * 2;
      ctx.fillStyle = '#ffffff';
      for (let s = 0; s < 60; s++) {
        const sx = ((s * 137 + 50) % W);
        const sy = ((s * 97 + 30) % (H * 0.55));
        const sr = ((s % 3) === 0) ? 1.5 : 0.8;
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();
    }

    // Sun / Moon
    const sunX = 80 + sky.dayness * 340;
    const sunY = H * 0.35 - sky.dayness * H * 0.25;
    ctx.save();
    if (sky.dayness > 0.3) {
      // Sun
      ctx.globalAlpha = sky.dayness;
      const sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 30);
      sg.addColorStop(0, '#fff8a0'); sg.addColorStop(0.4, '#ffd700'); sg.addColorStop(1, 'rgba(255,200,0,0)');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sunX, sunY, 30, 0, Math.PI*2); ctx.fill();
    } else {
      // Moon
      ctx.globalAlpha = 1 - sky.dayness * 2;
      ctx.fillStyle = '#e8e8d0';
      ctx.beginPath(); ctx.arc(sunX, sunY, 18, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = lerpColor('#0a0a2e', '#87CEEB', sky.dayness);
      ctx.beginPath(); ctx.arc(sunX - 6, sunY - 3, 15, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();

    // Side scenery
    for (const obj of SIDE_OBJS) {
      const y = ((obj.y + bgOffset) % (H + 120)) - 60;
      if (obj.side === 'left') drawSideObjLeft(obj.type, y, sky.dayness);
      else                      drawSideObjRight(obj.type, y, sky.dayness);
    }
  }

  function drawSideObjLeft(type, y, day) {
    ctx.save();
    if (type === 'tree') {
      // trunk
      ctx.fillStyle = '#5C3A1E';
      ctx.fillRect(28, y + 20, 10, 30);
      // foliage
      ctx.fillStyle = day > 0.4 ? '#2d7a2d' : '#1a4a1a';
      ctx.beginPath(); ctx.arc(33, y + 10, 22, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(22, y + 22, 14, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(44, y + 22, 14, 0, Math.PI*2); ctx.fill();
    } else {
      // building
      const bh = 55 + ((y * 7) % 35 | 0);
      ctx.fillStyle = day > 0.4 ? '#6a7080' : '#22283a';
      ctx.fillRect(5, y - bh + 50, 55, bh);
      // windows
      ctx.fillStyle = day > 0.4 ? '#cce0ff' : (Math.random() < 0.6 ? '#ffe066' : '#22283a');
      for (let wy = y - bh + 60; wy < y + 45; wy += 14) {
        ctx.fillRect(12, wy, 8, 8);
        ctx.fillRect(28, wy, 8, 8);
        ctx.fillRect(44, wy, 8, 8);
      }
    }
    ctx.restore();
  }
  function drawSideObjRight(type, y, day) {
    ctx.save();
    const ox = ROAD_RIGHT + 10;
    if (type === 'tree') {
      ctx.fillStyle = '#5C3A1E';
      ctx.fillRect(ox + 28, y + 20, 10, 30);
      ctx.fillStyle = day > 0.4 ? '#2d7a2d' : '#1a4a1a';
      ctx.beginPath(); ctx.arc(ox + 33, y + 10, 22, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(ox + 22, y + 22, 14, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(ox + 44, y + 22, 14, 0, Math.PI*2); ctx.fill();
    } else {
      const bh = 55 + ((y * 11) % 40 | 0);
      ctx.fillStyle = day > 0.4 ? '#6a7080' : '#22283a';
      ctx.fillRect(ox + 5, y - bh + 50, 55, bh);
      ctx.fillStyle = day > 0.4 ? '#cce0ff' : (Math.random() < 0.6 ? '#ffe066' : '#22283a');
      for (let wy = y - bh + 60; wy < y + 45; wy += 14) {
        ctx.fillRect(ox + 12, wy, 8, 8);
        ctx.fillRect(ox + 28, wy, 8, 8);
        ctx.fillRect(ox + 44, wy, 8, 8);
      }
    }
    ctx.restore();
  }

  function drawRoad(speed) {
    // Road surface
    const rg = ctx.createLinearGradient(ROAD_LEFT, 0, ROAD_RIGHT, 0);
    rg.addColorStop(0, '#2a2a2a');
    rg.addColorStop(0.15, '#3a3a3a');
    rg.addColorStop(0.85, '#3a3a3a');
    rg.addColorStop(1, '#2a2a2a');
    ctx.fillStyle = rg;
    ctx.fillRect(ROAD_LEFT, 0, ROAD_W, H);

    // Road edge lines (white)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(ROAD_LEFT, 0); ctx.lineTo(ROAD_LEFT, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ROAD_RIGHT, 0); ctx.lineTo(ROAD_RIGHT, H); ctx.stroke();

    // Side barriers
    drawBarrier('left');
    drawBarrier('right');

    // Lane dashes
    ctx.setLineDash([30, 20]);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    for (let lane = 1; lane <= 2; lane++) {
      const lx = ROAD_LEFT + LANE_W * lane;
      ctx.beginPath();
      ctx.moveTo(lx, -roadOffset % 50);
      ctx.lineTo(lx, H);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Road markings (small rectangles moving down)
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    const markSpacing = 120;
    for (let m = 0; m < 8; m++) {
      const my = (m * markSpacing + roadOffset) % (H + markSpacing) - markSpacing;
      ctx.fillRect(ROAD_LEFT + 10, my, 12, 40);
      ctx.fillRect(ROAD_RIGHT - 22, my, 12, 40);
    }
  }

  function drawBarrier(side) {
    const bx = side === 'left' ? ROAD_LEFT - 22 : ROAD_RIGHT + 2;
    const bw = 20;
    // Posts
    const postSpacing = 60;
    for (let p = 0; p < 14; p++) {
      const py = (p * postSpacing + roadOffset * 0.5) % (H + postSpacing) - postSpacing;
      ctx.fillStyle = '#555';
      ctx.fillRect(bx + 6, py, 8, 40);
    }
    // Rail
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let p = 0; p < 14; p++) {
      const py = (p * postSpacing + roadOffset * 0.5) % (H + postSpacing) - postSpacing;
      if (p === 0) ctx.moveTo(bx + 10, py + 20); else ctx.lineTo(bx + 10, py + 20);
    }
    ctx.stroke();
  }


  // ── Car Drawing ───────────────────────────────────────────
  // drawCar(ctx, x, y, w, h, color, isPlayer, options)
  // x,y = center-bottom of car
  function drawCar(cx, cy, w, h, color, isPlayer, opts = {}) {
    const x = cx - w / 2;
    const y = cy - h;
    ctx.save();

    // Shadow
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, w * 0.55, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Body – lower section (wider)
    ctx.beginPath();
    ctx.moveTo(x + 4, cy);
    ctx.lineTo(x, cy - h * 0.35);
    ctx.lineTo(x + w * 0.08, cy - h * 0.55);
    ctx.lineTo(x + w * 0.18, cy - h * 0.72);
    ctx.lineTo(x + w * 0.82, cy - h * 0.72);
    ctx.lineTo(x + w * 0.92, cy - h * 0.55);
    ctx.lineTo(x + w, cy - h * 0.35);
    ctx.lineTo(x + w - 4, cy);
    ctx.closePath();
    const bodyGrad = ctx.createLinearGradient(x, cy - h, x + w, cy);
    bodyGrad.addColorStop(0, lightenColor(color, 40));
    bodyGrad.addColorStop(0.5, color);
    bodyGrad.addColorStop(1, darkenColor(color, 30));
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.strokeStyle = darkenColor(color, 50);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Roof / cabin
    ctx.beginPath();
    ctx.moveTo(x + w * 0.18, cy - h * 0.72);
    ctx.quadraticCurveTo(x + w * 0.22, cy - h * 0.98, x + w * 0.32, cy - h * 1.0);
    ctx.lineTo(x + w * 0.68, cy - h * 1.0);
    ctx.quadraticCurveTo(x + w * 0.78, cy - h * 0.98, x + w * 0.82, cy - h * 0.72);
    ctx.closePath();
    const roofGrad = ctx.createLinearGradient(x, cy - h, x + w, cy - h * 0.5);
    roofGrad.addColorStop(0, lightenColor(color, 20));
    roofGrad.addColorStop(1, darkenColor(color, 20));
    ctx.fillStyle = roofGrad;
    ctx.fill();
    ctx.strokeStyle = darkenColor(color, 60);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Windshield (front = bottom for top-down style, but we treat top as front)
    // Front windshield
    ctx.beginPath();
    ctx.moveTo(x + w * 0.22, cy - h * 0.72);
    ctx.lineTo(x + w * 0.32, cy - h * 0.97);
    ctx.lineTo(x + w * 0.68, cy - h * 0.97);
    ctx.lineTo(x + w * 0.78, cy - h * 0.72);
    ctx.closePath();
    ctx.fillStyle = 'rgba(150,220,255,0.55)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // glare
    ctx.beginPath();
    ctx.moveTo(x + w * 0.26, cy - h * 0.73);
    ctx.lineTo(x + w * 0.34, cy - h * 0.94);
    ctx.lineTo(x + w * 0.42, cy - h * 0.94);
    ctx.lineTo(x + w * 0.30, cy - h * 0.73);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fill();

    // Rear windshield
    ctx.beginPath();
    ctx.moveTo(x + w * 0.24, cy - h * 0.72);
    ctx.lineTo(x + w * 0.34, cy - h * 0.72);
    ctx.lineTo(x + w * 0.34, cy - h * 0.82);
    ctx.lineTo(x + w * 0.24, cy - h * 0.76);
    ctx.closePath();
    ctx.fillStyle = 'rgba(100,180,220,0.4)';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + w * 0.76, cy - h * 0.72);
    ctx.lineTo(x + w * 0.66, cy - h * 0.72);
    ctx.lineTo(x + w * 0.66, cy - h * 0.82);
    ctx.lineTo(x + w * 0.76, cy - h * 0.76);
    ctx.closePath();
    ctx.fillStyle = 'rgba(100,180,220,0.4)';
    ctx.fill();

    // Hood lines
    ctx.strokeStyle = darkenColor(color, 40);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.35, cy - h * 0.72);
    ctx.lineTo(x + w * 0.4, cy - h * 0.52);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w * 0.65, cy - h * 0.72);
    ctx.lineTo(x + w * 0.6, cy - h * 0.52);
    ctx.stroke();

    // Headlights (front = top of screen, player faces up)
    const hlY = isPlayer ? y + 5 : cy - 4;
    const hlGlow = isPlayer ? '#ffffaa' : (opts.brakeLights ? '#ff2200' : '#ffcc88');
    if (isPlayer) {
      // Player headlights at top
      drawHeadlight(x + w * 0.15, y + 8, 9, 5, '#ffffaa');
      drawHeadlight(x + w * 0.85 - 9, y + 8, 9, 5, '#ffffaa');
      // Tail lights at bottom
      drawHeadlight(x + w * 0.1, cy - 8, 7, 4, '#ff2200');
      drawHeadlight(x + w * 0.9 - 7, cy - 8, 7, 4, '#ff2200');
    } else {
      // Enemy – headlights at bottom (facing player)
      drawHeadlight(x + w * 0.1, cy - 10, 8, 5, opts.brakeLights ? '#ff3300' : '#ffcc44');
      drawHeadlight(x + w * 0.9 - 8, cy - 10, 8, 5, opts.brakeLights ? '#ff3300' : '#ffcc44');
      // Enemy top lights
      drawHeadlight(x + w * 0.15, y + 6, 7, 4, '#ffffcc');
      drawHeadlight(x + w * 0.85 - 7, y + 6, 7, 4, '#ffffcc');
    }

    // Spoiler (rear for player = bottom)
    if (isPlayer || opts.hasSpoiler) {
      ctx.fillStyle = darkenColor(color, 40);
      const sy = isPlayer ? cy - 5 : y + 3;
      ctx.beginPath();
      ctx.rect(x - 4, sy - 4, w + 8, 5);
      ctx.fill();
      // spoiler supports
      ctx.fillRect(x + w * 0.2, sy - 9, 5, 5);
      ctx.fillRect(x + w * 0.8 - 5, sy - 9, 5, 5);
    }

    // Wheels – 4 wheels with rims
    const wheelPositions = [
      { wx: x + 2, wy: cy - h * 0.18, r: 10, isFront: false },
      { wx: x + w - 14, wy: cy - h * 0.18, r: 10, isFront: false },
      { wx: x + 2, wy: cy - h * 0.72, r: 10, isFront: true },
      { wx: x + w - 14, wy: cy - h * 0.72, r: 10, isFront: true },
    ];
    for (const wh of wheelPositions) {
      drawWheel(wh.wx, wh.wy, 12, 8);
    }

    // Nitro flames
    if (isPlayer && opts.nitroActive) {
      drawNitroFlames(cx, cy);
    }

    ctx.restore();
  }

  function drawHeadlight(x, y, w, h, color) {
    ctx.save();
    const hg = ctx.createRadialGradient(x+w/2, y+h/2, 0, x+w/2, y+h/2, w);
    hg.addColorStop(0, color);
    hg.addColorStop(1, 'rgba(255,255,200,0)');
    ctx.fillStyle = hg;
    ctx.beginPath(); ctx.ellipse(x+w/2, y+h/2, w, h, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.ellipse(x+w/2, y+h/2, w*0.6, h*0.6, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function drawWheel(x, y, r, innerR) {
    ctx.save();
    // Tire
    ctx.beginPath(); ctx.arc(x + r, y + r, r, 0, Math.PI*2);
    ctx.fillStyle = '#1a1a1a'; ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5; ctx.stroke();
    // Rim
    ctx.beginPath(); ctx.arc(x + r, y + r, innerR, 0, Math.PI*2);
    ctx.fillStyle = '#c0c0c0'; ctx.fill();
    // Spokes
    ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5;
    for (let s = 0; s < 5; s++) {
      const ang = (s / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y + r);
      ctx.lineTo(x + r + Math.cos(ang) * innerR * 0.9, y + r + Math.sin(ang) * innerR * 0.9);
      ctx.stroke();
    }
    // Center hub
    ctx.beginPath(); ctx.arc(x + r, y + r, 3, 0, Math.PI*2);
    ctx.fillStyle = '#666'; ctx.fill();
    ctx.restore();
  }

  function drawNitroFlames(cx, cy) {
    ctx.save();
    // Left exhaust flame
    drawFlame(cx - 12, cy + 4);
    // Right exhaust flame
    drawFlame(cx + 12, cy + 4);
    ctx.restore();
  }

  function drawFlame(x, y) {
    const t = Date.now() / 100;
    const flicker = Math.sin(t) * 3;
    ctx.save();
    ctx.globalAlpha = 0.85;
    const fg = ctx.createLinearGradient(x, y, x, y + 28 + flicker);
    fg.addColorStop(0, '#00aaff');
    fg.addColorStop(0.4, '#0044ff');
    fg.addColorStop(0.7, '#8800ff');
    fg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.quadraticCurveTo(x - 2 + flicker, y + 14, x, y + 28 + flicker);
    ctx.quadraticCurveTo(x + 2 - flicker, y + 14, x + 5, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function lightenColor(hex, amt) {
    return shiftColor(hex, amt);
  }
  function darkenColor(hex, amt) {
    return shiftColor(hex, -amt);
  }
  function shiftColor(hex, amt) {
    const p = (h) => parseInt(h, 16);
    const r = clamp(p(hex.slice(1,3)) + amt, 0, 255);
    const g = clamp(p(hex.slice(3,5)) + amt, 0, 255);
    const b = clamp(p(hex.slice(5,7)) + amt, 0, 255);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }


  // ── Player ────────────────────────────────────────────────
  const PLAYER_COLORS = ['#ff4400', '#ff6600', '#ff3300'];
  const player = {
    lane: 1,          // 0,1,2
    x: LANE_X[1],
    y: H - 80,
    w: CAR_W, h: CAR_H,
    targetX: LANE_X[1],
    speed: 0,         // visual speed value 0-1
    nitro: 0,         // 0-100
    nitroActive: false,
    shield: false,
    shieldTimer: 0,
    lives: 3,
    invincible: false,
    invincibleTimer: 0,
    color: '#ff4400',
    moving: false,
    transitioning: false,
    transitionSpeed: 10,
  };

  function resetPlayer() {
    player.lane = 1;
    player.x = LANE_X[1];
    player.targetX = LANE_X[1];
    player.nitro = 100;
    player.nitroActive = false;
    player.shield = false;
    player.shieldTimer = 0;
    player.lives = 3;
    player.invincible = false;
    player.invincibleTimer = 0;
    player.speed = 0;
    player.transitioning = false;
  }

  function updatePlayer(dt) {
    // Lane input
    if (!player.transitioning) {
      if (keys['ArrowLeft'] && player.lane > 0) {
        player.lane--;
        player.targetX = LANE_X[player.lane];
        player.transitioning = true;
      }
      if (keys['ArrowRight'] && player.lane < 2) {
        player.lane++;
        player.targetX = LANE_X[player.lane];
        player.transitioning = true;
      }
    }
    // Smooth lane transition
    if (player.transitioning) {
      const diff = player.targetX - player.x;
      player.x += diff * 0.18;
      if (Math.abs(diff) < 1) {
        player.x = player.targetX;
        player.transitioning = false;
      }
    }

    // Nitro
    if (keys['Space'] && player.nitro > 0) {
      if (!player.nitroActive) { player.nitroActive = true; playNitro(); }
      player.nitro = Math.max(0, player.nitro - 0.8);
      if (player.nitro === 0) player.nitroActive = false;
    } else {
      player.nitroActive = false;
      player.nitro = Math.min(100, player.nitro + 0.15);
    }

    // Shield timer
    if (player.shield) {
      player.shieldTimer--;
      if (player.shieldTimer <= 0) player.shield = false;
    }

    // Invincibility after hit
    if (player.invincible) {
      player.invincibleTimer--;
      if (player.invincibleTimer <= 0) player.invincible = false;
    }

    // Smoke trail
    if (Math.random() < 0.3) {
      spawnSmoke(player.x, player.y + 5);
    }
  }

  function drawPlayer() {
    ctx.save();
    // Invincible blink
    if (player.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
      ctx.restore(); return;
    }
    // Shield glow
    if (player.shield) {
      ctx.save();
      ctx.globalAlpha = 0.4 + Math.sin(Date.now() / 150) * 0.15;
      const sg = ctx.createRadialGradient(player.x, player.y - player.h/2, 10, player.x, player.y - player.h/2, 45);
      sg.addColorStop(0, 'rgba(0,255,100,0.5)');
      sg.addColorStop(1, 'rgba(0,255,100,0)');
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.ellipse(player.x, player.y - player.h/2, 40, 55, 0, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }
    drawCar(player.x, player.y, player.w, player.h, player.color, true, {
      nitroActive: player.nitroActive
    });
    ctx.restore();
  }

  // ── Enemy Cars ────────────────────────────────────────────
  const ENEMY_COLORS = ['#cc0000','#0044cc','#cccc00','#eeeeee','#8800cc','#00aa44','#cc5500'];
  const enemies = [];
  let enemySpawnTimer = 0;

  function spawnEnemy(gameSpeed) {
    const lane = randInt(0, 2);
    const color = ENEMY_COLORS[randInt(0, ENEMY_COLORS.length - 1)];
    const hasSpoiler = Math.random() < 0.4;
    enemies.push({
      lane,
      x: LANE_X[lane],
      y: -CAR_H - 10,
      w: CAR_W,
      h: CAR_H,
      color,
      speed: gameSpeed * rand(0.5, 0.85),
      hasSpoiler,
      passed: false
    });
  }

  function updateEnemies(gameSpeed, dt) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.y += gameSpeed + (player.nitroActive ? 3 : 0);
      e.x = lerp(e.x, LANE_X[e.lane], 0.15); // keep in lane

      if (e.y > H + 20) { enemies.splice(i, 1); continue; }

      // Brake lights: if close to player in same lane
      const dist = e.y - (player.y - player.h);
      e.brakeLights = (e.lane === player.lane && dist > -200 && dist < 0);
    }
  }

  function drawEnemies() {
    for (const e of enemies) {
      drawCar(e.x, e.y + e.h, e.w, e.h, e.color, false, {
        brakeLights: e.brakeLights,
        hasSpoiler: e.hasSpoiler
      });
    }
  }

  // ── Coins ─────────────────────────────────────────────────
  const coins = [];
  let coinSpawnTimer = 0;
  let coinRotation  = 0;

  function spawnCoin() {
    const lane = randInt(0, 2);
    coins.push({ lane, x: LANE_X[lane], y: -30, collected: false });
  }

  function updateCoins(gameSpeed) {
    for (let i = coins.length - 1; i >= 0; i--) {
      coins[i].y += gameSpeed;
      if (coins[i].y > H + 30) coins.splice(i, 1);
    }
    coinRotation += 0.06;
  }

  function drawCoin(c) {
    ctx.save();
    const scaleX = Math.abs(Math.cos(coinRotation));
    ctx.translate(c.x, c.y);
    // Glow
    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
    glow.addColorStop(0, 'rgba(255,215,0,0.6)');
    glow.addColorStop(1, 'rgba(255,200,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI*2); ctx.fill();
    // Coin body (oval when rotating)
    ctx.save();
    ctx.scale(scaleX, 1);
    const cg = ctx.createRadialGradient(-3, -3, 1, 0, 0, 11);
    cg.addColorStop(0, '#fff8a0');
    cg.addColorStop(0.4, '#ffd700');
    cg.addColorStop(1, '#b8860b');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 1.5; ctx.stroke();
    // $ symbol
    ctx.fillStyle = '#8B6914';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 0);
    ctx.restore();
    ctx.restore();
  }


  // ── Power-Ups ─────────────────────────────────────────────
  const powerups = [];
  let powerupSpawnTimer = 0;
  const POWERUP_TYPES = ['shield', 'nitro'];

  function spawnPowerup() {
    const lane = randInt(0, 2);
    const type = POWERUP_TYPES[randInt(0, POWERUP_TYPES.length - 1)];
    powerups.push({ lane, x: LANE_X[lane], y: -30, type });
  }

  function updatePowerups(gameSpeed) {
    for (let i = powerups.length - 1; i >= 0; i--) {
      powerups[i].y += gameSpeed;
      if (powerups[i].y > H + 30) powerups.splice(i, 1);
    }
  }

  function drawPowerup(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    const pulse = 0.85 + Math.sin(Date.now() / 300) * 0.12;
    ctx.scale(pulse, pulse);

    if (p.type === 'shield') {
      // Green glowing box
      const sg = ctx.createRadialGradient(0, 0, 2, 0, 0, 20);
      sg.addColorStop(0, 'rgba(0,255,80,0.7)');
      sg.addColorStop(1, 'rgba(0,200,60,0)');
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#00cc44';
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-12, -12, 24, 24, 4);
      ctx.fill(); ctx.stroke();
      // Shield icon
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(0, -7); ctx.lineTo(7, -3); ctx.lineTo(7, 2);
      ctx.quadraticCurveTo(7, 7, 0, 9);
      ctx.quadraticCurveTo(-7, 7, -7, 2);
      ctx.lineTo(-7, -3); ctx.closePath();
      ctx.fill();
    } else if (p.type === 'nitro') {
      // Blue glowing box
      const ng = ctx.createRadialGradient(0, 0, 2, 0, 0, 20);
      ng.addColorStop(0, 'rgba(0,150,255,0.7)');
      ng.addColorStop(1, 'rgba(0,100,200,0)');
      ctx.fillStyle = ng;
      ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#0055cc';
      ctx.strokeStyle = '#44aaff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-12, -12, 24, 24, 4);
      ctx.fill(); ctx.stroke();
      // Lightning bolt
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(3, -9); ctx.lineTo(-3, 0); ctx.lineTo(1, 0);
      ctx.lineTo(-3, 9); ctx.lineTo(3, 0); ctx.lineTo(-1, 0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // ── Speed Lines (Nitro) ───────────────────────────────────
  function drawSpeedLines(active) {
    if (!active) return;
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 20; i++) {
      const lx = ROAD_LEFT + rand(10, ROAD_W - 10);
      const ly = rand(0, H);
      const len = rand(30, 90);
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly + len); ctx.stroke();
    }
    ctx.restore();
  }

  // ── HUD ───────────────────────────────────────────────────
  function drawHUD(gs) {
    const { score, level, combo, distance, timer, nitroActive } = gs;

    // Top bar bg
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, W, 55);

    // Score
    ctx.font = 'bold 15px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText('SCORE', 8, 16);
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(score, 8, 36);

    // Level
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL', W/2, 14);
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = '#00ccff';
    ctx.fillText(level, W/2, 36);

    // Lives (hearts)
    ctx.textAlign = 'right';
    for (let i = 0; i < 3; i++) {
      drawHeart(W - 8 - i * 26, 20, i < player.lives ? '#ff2244' : '#555');
    }

    // Bottom HUD bar
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, H - 52, W, 52);

    // Nitro bar
    ctx.fillStyle = '#333';
    ctx.fillRect(8, H - 44, 110, 14);
    const nitroGrad = ctx.createLinearGradient(8, 0, 118, 0);
    nitroGrad.addColorStop(0, '#0044ff');
    nitroGrad.addColorStop(1, '#00aaff');
    ctx.fillStyle = nitroActive ? nitroGrad : '#ff6600';
    ctx.fillRect(8, H - 44, (player.nitro / 100) * 110, 14);
    ctx.strokeStyle = '#ffffff55';
    ctx.lineWidth = 1;
    ctx.strokeRect(8, H - 44, 110, 14);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NITRO', 63, H - 34);

    // Speed meter
    drawSpeedMeter(W - 65, H - 40, gs.speed);

    // Combo
    if (combo > 1) {
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = comboColor(combo);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      const ct = `x${combo} COMBO`;
      ctx.strokeText(ct, W/2, H - 30);
      ctx.fillText(ct, W/2, H - 30);
    }

    // Distance
    ctx.font = '11px Arial';
    ctx.fillStyle = '#aaa';
    ctx.textAlign = 'left';
    ctx.fillText(`${Math.floor(distance)}m`, 8, H - 6);

    // Timer (Time Attack mode)
    if (gameMode === 'TIME ATTACK') {
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = timer < 15 ? '#ff4444' : '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`⏱ ${Math.ceil(timer)}s`, W / 2, 50);
    }

    ctx.restore();
  }

  function drawHeart(x, y, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + 4);
    ctx.bezierCurveTo(x, y, x - 10, y, x - 10, y + 6);
    ctx.bezierCurveTo(x - 10, y + 12, x, y + 16, x, y + 16);
    ctx.bezierCurveTo(x, y + 16, x + 10, y + 12, x + 10, y + 6);
    ctx.bezierCurveTo(x + 10, y, x, y, x, y + 4);
    ctx.fill();
    ctx.restore();
  }

  function drawSpeedMeter(x, y, speed) {
    ctx.save();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(x, y, 22, Math.PI * 0.75, Math.PI * 2.25); ctx.stroke();
    const angle = Math.PI * 0.75 + speed * Math.PI * 1.5;
    ctx.strokeStyle = speed > 0.8 ? '#ff4400' : '#00ff88';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(x, y, 22, Math.PI * 0.75, angle); ctx.stroke();
    // needle
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * 16, y + Math.sin(angle) * 16);
    ctx.stroke();
    // center
    ctx.fillStyle = '#888';
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill();
    // label
    ctx.fillStyle = '#aaa'; ctx.font = '8px Arial'; ctx.textAlign = 'center';
    ctx.fillText('SPD', x, y + 34);
    ctx.restore();
  }

  function comboColor(c) {
    if (c >= 8) return '#ff2200';
    if (c >= 5) return '#ff8800';
    if (c >= 3) return '#ffcc00';
    return '#88ff44';
  }


  // ── Collision Detection ───────────────────────────────────
  function checkCollisions(gs) {
    const px = player.x, py = player.y - player.h / 2;
    const pw = player.w * 0.7, ph = player.h * 0.75;

    // Enemy collisions
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      const ex = e.x, ey = e.y + e.h / 2;
      const ew = e.w * 0.7, eh = e.h * 0.7;
      if (Math.abs(px - ex) < (pw + ew) / 2 &&
          Math.abs(py - ey) < (ph + eh) / 2) {
        if (player.invincible) continue;
        if (player.shield) {
          player.shield = false;
          spawnExplosion(e.x, e.y, 10);
          enemies.splice(i, 1);
          spawnFloatText(e.x, e.y, 'SHIELD!', '#00ff88');
        } else {
          player.lives--;
          player.invincible = true;
          player.invincibleTimer = 120;
          spawnExplosion(e.x, e.y + e.h / 2, 22);
          playCrash();
          triggerShake(12);
          gs.combo = 1;
          enemies.splice(i, 1);
          if (player.lives <= 0) {
            endGame(gs);
          }
        }
      }
    }

    // Coin collection
    for (let i = coins.length - 1; i >= 0; i--) {
      const c = coins[i];
      if (Math.abs(px - c.x) < 28 && Math.abs(py - (c.y)) < 35) {
        coins.splice(i, 1);
        const pts = 10 * gs.combo;
        gs.score += pts;
        gs.combo = Math.min(10, gs.combo + 1);
        gs.comboTimer = 180;
        playCoin();
        spawnFloatText(c.x, c.y, `+${pts}`, '#FFD700');
      }
    }

    // Power-up collection
    for (let i = powerups.length - 1; i >= 0; i--) {
      const p = powerups[i];
      if (Math.abs(px - p.x) < 30 && Math.abs(py - p.y) < 35) {
        powerups.splice(i, 1);
        if (p.type === 'shield') {
          player.shield = true;
          player.shieldTimer = 300;
          spawnFloatText(p.x, p.y, 'SHIELD!', '#00ff88');
        } else if (p.type === 'nitro') {
          player.nitro = 100;
          spawnFloatText(p.x, p.y, 'NITRO!', '#44aaff');
          playNitro();
        }
      }
    }
  }

  // ── Game State Object ─────────────────────────────────────
  function createGameState() {
    return {
      score:       0,
      level:       1,
      distance:    0,
      combo:       1,
      comboTimer:  0,
      speed:       0,    // 0-1 normalized
      baseSpeed:   3.5,
      timer:       60,   // TIME ATTACK countdown
      frame:       0,
      running:     false,
    };
  }
  let gs = createGameState();

  function endGame(g) {
    state = STATES.GAMEOVER;
    stopEngine();
    saveHighScore(gameMode, g.score);
  }

  // ── Main Game Loop ────────────────────────────────────────
  function gameLoop(ts) {
    requestAnimationFrame(gameLoop);

    ctx.save();
    const shake = getShakeOffset();
    ctx.translate(shake.x, shake.y);

    switch (state) {
      case STATES.MENU:     drawMenu();     break;
      case STATES.PLAYING:  updateGame();
                            drawGame();     break;
      case STATES.PAUSED:   drawGame();
                            drawPauseOverlay(); break;
      case STATES.GAMEOVER: drawGameOver(); break;
    }

    ctx.restore();
  }

  // ── Game Update ───────────────────────────────────────────
  function updateGame() {
    const g = gs;
    g.frame++;
    dayTime += 0.0003;

    // Speed calculation
    const lvlBonus = (g.level - 1) * 0.4;
    const nitroBonus = player.nitroActive ? 3 : 0;
    const currentSpeed = g.baseSpeed + lvlBonus + nitroBonus;
    g.speed = clamp((currentSpeed - g.baseSpeed) / 5 + (g.baseSpeed - 3.5) / 6 + 0.35, 0, 1);
    setEngineFreq(g.speed);

    // Scroll
    roadOffset = (roadOffset + currentSpeed) % 10000;
    bgOffset   = (bgOffset   + currentSpeed * 0.3) % (H + 120);

    // Distance & score (per frame)
    g.distance += currentSpeed * 0.05;
    g.score    += 0.01 * g.level;

    // Level up every 100 points
    const newLevel = Math.floor(g.score / 100) + 1;
    if (newLevel > g.level) {
      g.level = newLevel;
      spawnFloatText(W / 2, H / 2, `LEVEL ${g.level}!`, '#00ccff');
    }

    // Combo timer decay
    if (g.comboTimer > 0) {
      g.comboTimer--;
    } else {
      if (g.combo > 1) g.combo = Math.max(1, g.combo - 1);
    }

    // Spawn enemies
    const spawnInterval = Math.max(35, ENEMY_SPAWN_INTERVAL_BASE - (g.level - 1) * 6);
    enemySpawnTimer++;
    if (enemySpawnTimer >= spawnInterval) {
      spawnEnemy(currentSpeed);
      enemySpawnTimer = 0;
    }

    // Spawn coins
    const coinInterval = Math.max(30, COIN_SPAWN_INTERVAL_BASE - (g.level - 1) * 3);
    coinSpawnTimer++;
    if (coinSpawnTimer >= coinInterval) {
      spawnCoin();
      coinSpawnTimer = 0;
    }

    // Spawn power-ups
    powerupSpawnTimer++;
    if (powerupSpawnTimer >= 280) {
      spawnPowerup();
      powerupSpawnTimer = 0;
    }

    // Updates
    updatePlayer(1);
    updateEnemies(currentSpeed, 1);
    updateCoins(currentSpeed);
    updatePowerups(currentSpeed);
    updateParticles();
    updateFloatTexts();

    // Collisions
    checkCollisions(g);

    // TIME ATTACK countdown
    if (gameMode === 'TIME ATTACK') {
      g.timer -= 1 / 60;
      if (g.timer <= 0) endGame(g);
    }

    // SURVIVAL: enemies never slow down, always increase
    if (gameMode === 'SURVIVAL') {
      g.baseSpeed = Math.min(12, 3.5 + g.frame * 0.0012);
    }
  }

  // ── Draw Game ─────────────────────────────────────────────
  function drawGame() {
    const sky = getSkyColors();
    drawBackground(sky);
    drawRoad(gs.baseSpeed);
    drawSpeedLines(player.nitroActive);
    drawParticles();
    drawEnemies();
    for (const c of coins) drawCoin(c);
    for (const p of powerups) drawPowerup(p);
    drawPlayer();
    drawFloatTexts();
    drawHUD(gs);
  }


  // ── Menu Screen ───────────────────────────────────────────
  let menuBgOffset = 0;
  let menuFrame    = 0;
  const menuButtons = [
    { label: 'ARCADE',      mode: 'ARCADE',      x: W/2, y: 340, w: 180, h: 48 },
    { label: 'SURVIVAL',    mode: 'SURVIVAL',    x: W/2, y: 400, w: 180, h: 48 },
    { label: 'TIME ATTACK', mode: 'TIME ATTACK', x: W/2, y: 460, w: 180, h: 48 },
  ];
  let hoveredBtn = -1;

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top)  * (H / rect.height);
    hoveredBtn = -1;
    if (state === STATES.MENU) {
      menuButtons.forEach((b, i) => {
        if (mx > b.x - b.w/2 && mx < b.x + b.w/2 &&
            my > b.y - b.h/2 && my < b.y + b.h/2) hoveredBtn = i;
      });
    }
    if (state === STATES.PAUSED || state === STATES.GAMEOVER) {
      pauseButtons.forEach((b, i) => {
        if (mx > b.x - b.w/2 && mx < b.x + b.w/2 &&
            my > b.y - b.h/2 && my < b.y + b.h/2) hoveredBtn = 10 + i;
      });
      // Game Over: Main Menu button at H/2+150
      if (state === STATES.GAMEOVER) {
        if (mx > W/2 - 80 && mx < W/2 + 80 && my > H/2 + 127 && my < H/2 + 173) hoveredBtn = 13;
      }
    }
    canvas.style.cursor = hoveredBtn !== -1 ? 'pointer' : 'default';
  });

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top)  * (H / rect.height);

    if (state === STATES.MENU) {
      menuButtons.forEach(b => {
        if (mx > b.x - b.w/2 && mx < b.x + b.w/2 &&
            my > b.y - b.h/2 && my < b.y + b.h/2) {
          startGame(b.mode);
        }
      });
    }
    if (state === STATES.PAUSED || state === STATES.GAMEOVER) {
      pauseButtons.forEach(b => {
        if (mx > b.x - b.w/2 && mx < b.x + b.w/2 &&
            my > b.y - b.h/2 && my < b.y + b.h/2) {
          b.action();
        }
      });
      // Game Over: Main Menu button click
      if (state === STATES.GAMEOVER) {
        if (mx > W/2 - 80 && mx < W/2 + 80 && my > H/2 + 127 && my < H/2 + 173) {
          state = STATES.MENU;
          stopEngine();
        }
      }
    }
  });

  const pauseButtons = [
    {
      label: 'RESUME', x: W/2, y: H/2 + 20, w: 160, h: 46,
      action: () => { if (state === STATES.PAUSED) { state = STATES.PLAYING; startEngine(); } }
    },
    {
      label: 'QUIT',   x: W/2, y: H/2 + 80, w: 160, h: 46,
      action: () => { state = STATES.MENU; stopEngine(); }
    },
    {
      label: 'PLAY AGAIN', x: W/2, y: H/2 + 100, w: 180, h: 46,
      action: () => { startGame(gameMode); }
    },
  ];

  function startGame(mode) {
    gameMode = mode;
    gs = createGameState();
    if (mode === 'TIME ATTACK') gs.timer = 60;
    enemies.length = 0;
    coins.length = 0;
    powerups.length = 0;
    particles.length = 0;
    floatTexts.length = 0;
    enemySpawnTimer = 0;
    coinSpawnTimer  = 0;
    powerupSpawnTimer = 0;
    resetPlayer();
    initSideObjects();
    state = STATES.PLAYING;
    startEngine();
  }

  function drawMenu() {
    menuFrame++;
    menuBgOffset = (menuBgOffset + 1.5) % (H + 120);

    // Animated road background
    const sky = getSkyColors();
    drawBackground(sky);
    drawRoad(3.5);

    // Title card
    ctx.save();
    const titleY = 120 + Math.sin(menuFrame * 0.04) * 6;
    // Title glow
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur  = 30;
    ctx.font = 'bold 46px Arial';
    ctx.textAlign = 'center';
    const tg = ctx.createLinearGradient(W/2 - 160, 0, W/2 + 160, 0);
    tg.addColorStop(0, '#ff4400');
    tg.addColorStop(0.5, '#ffcc00');
    tg.addColorStop(1, '#ff4400');
    ctx.fillStyle = tg;
    ctx.fillText('TURBO RACER', W/2, titleY);
    ctx.shadowColor = '#00aaff';
    ctx.shadowBlur  = 20;
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#00ccff';
    ctx.fillText('E L I T E', W/2, titleY + 38);
    ctx.shadowBlur = 0;
    
    // Creator Credit - Upper position with style
    ctx.font = 'italic 16px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    const creatorGrad = ctx.createLinearGradient(W/2 - 80, 0, W/2 + 80, 0);
    creatorGrad.addColorStop(0, '#ffaa00');
    creatorGrad.addColorStop(0.5, '#ffffff');
    creatorGrad.addColorStop(1, '#ffaa00');
    ctx.fillStyle = creatorGrad;
    ctx.fillText('~ Created by Sami Ul Hassan ~', W/2, titleY + 70);
    ctx.shadowBlur = 0;
    ctx.restore();

    // Mode buttons
    menuButtons.forEach((b, i) => {
      const hovered = hoveredBtn === i;
      drawMenuButton(b.x, b.y, b.w, b.h, b.label, hovered, i);
    });

    // High scores
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath(); ctx.roundRect(W/2 - 130, 495, 260, 82, 10); ctx.fill();
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('HIGH SCORES', W/2, 515);
    const modes = ['ARCADE','SURVIVAL','TIME ATTACK'];
    const modeColors = ['#ff8800','#ff4444','#44aaff'];
    modes.forEach((m, i) => {
      ctx.fillStyle = modeColors[i];
      ctx.font = '12px Arial';
      ctx.fillText(`${m}: ${loadHighScore(m)}`, W/2, 532 + i * 16);
    });
    ctx.restore();

    // Controls
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath(); ctx.roundRect(W/2 - 130, 585, 260, 80, 10); ctx.fill();
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText('← → MOVE   SPACE NITRO   P PAUSE', W/2, 606);
    ctx.fillText('Collect coins, dodge enemies,', W/2, 624);
    ctx.fillText('grab power-ups to survive!', W/2, 642);
    ctx.fillText('Click a mode above to play', W/2, 657);
    ctx.restore();

    // Animated demo cars on menu
    drawDemoCars(menuFrame);
  }

  function drawMenuButton(x, y, w, h, label, hovered, idx) {
    ctx.save();
    const bColors = ['#cc4400','#cc0000','#0044aa'];
    const bg = hovered ? lightenColor(bColors[idx] || '#444', 30) : bColors[idx] || '#444';
    const grad = ctx.createLinearGradient(x-w/2, y-h/2, x+w/2, y+h/2);
    grad.addColorStop(0, lightenColor(bg, 20));
    grad.addColorStop(1, darkenColor(bg, 20));
    ctx.fillStyle = grad;
    ctx.strokeStyle = hovered ? '#ffffff' : '#ffffff55';
    ctx.lineWidth = hovered ? 2.5 : 1.5;
    ctx.shadowColor = bColors[idx] || '#444';
    ctx.shadowBlur  = hovered ? 20 : 8;
    ctx.beginPath(); ctx.roundRect(x - w/2, y - h/2, w, h, 8); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.font = `bold ${hovered ? 18 : 16}px Arial`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  }

  function drawDemoCars(frame) {
    const t = frame * 0.02;
    // Scrolling demo cars on road
    const demoLanes = [0, 1, 2];
    demoLanes.forEach((lane, i) => {
      const cy = ((frame * 2 + i * 240) % (H + 100)) - 60;
      const color = ENEMY_COLORS[(i + frame / 100 | 0) % ENEMY_COLORS.length];
      drawCar(LANE_X[lane], cy + CAR_H, CAR_W, CAR_H, color, false, {});
    });
  }


  // ── Pause Screen ──────────────────────────────────────────
  function drawPauseOverlay() {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(0, 0, W, H);

    // Panel
    ctx.fillStyle = 'rgba(20,20,40,0.95)';
    ctx.strokeStyle = '#4444aa';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(W/2 - 120, H/2 - 100, 240, 220, 12); ctx.fill(); ctx.stroke();

    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('PAUSED', W/2, H/2 - 60);

    ctx.font = '14px Arial';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText(`Score: ${Math.floor(gs.score)}`, W/2, H/2 - 30);

    // Resume / Quit buttons
    const rb = pauseButtons[0];
    const qb = pauseButtons[1];
    const rHov = hoveredBtn === 10;
    const qHov = hoveredBtn === 11;
    drawMenuButton(rb.x, rb.y, rb.w, rb.h, rb.label, rHov, 0);
    drawMenuButton(qb.x, qb.y, qb.w, qb.h, qb.label, qHov, 1);

    ctx.restore();
  }

  // ── Game Over Screen ──────────────────────────────────────
  function drawGameOver() {
    // Blurred road behind
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.0)';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    drawGame();

    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, W, H);

    // Panel
    ctx.fillStyle = 'rgba(20,10,10,0.95)';
    ctx.strokeStyle = '#aa2200';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(W/2 - 150, H/2 - 160, 300, 340, 14); ctx.fill(); ctx.stroke();

    // Title
    ctx.font = 'bold 38px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff2244';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur  = 16;
    ctx.fillText('GAME OVER', W/2, H/2 - 112);
    ctx.shadowBlur  = 0;

    // Creator Credit - Styled
    ctx.font = 'italic 14px Arial';
    ctx.fillStyle = 'rgba(255,200,100,0.9)';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 2;
    ctx.fillText('~ Created by Sami Ul Hassan ~', W/2, H/2 - 85);
    ctx.shadowBlur = 0;

    // Stats
    const lines = [
      { label: 'SCORE',    val: Math.floor(gs.score),       color: '#FFD700' },
      { label: 'LEVEL',    val: gs.level,                    color: '#00ccff' },
      { label: 'DISTANCE', val: `${Math.floor(gs.distance)}m`, color: '#88ff44' },
      { label: 'MODE',     val: gameMode,                    color: '#ff8844' },
    ];
    lines.forEach((l, i) => {
      const ly = H/2 - 66 + i * 38;
      ctx.font = '13px Arial';
      ctx.fillStyle = '#aaaaaa';
      ctx.textAlign = 'left';
      ctx.fillText(l.label, W/2 - 120, ly);
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = l.color;
      ctx.textAlign = 'right';
      ctx.fillText(l.val, W/2 + 120, ly);
    });

    // High score
    const hs = loadHighScore(gameMode);
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    if (Math.floor(gs.score) >= hs) {
      ctx.fillText('🏆 NEW HIGH SCORE!', W/2, H/2 + 80);
    } else {
      ctx.fillStyle = '#888';
      ctx.fillText(`Best: ${hs}`, W/2, H/2 + 80);
    }

    // Play again / Quit
    const pa = pauseButtons[2];
    const paHov = hoveredBtn === 12;
    drawMenuButton(pa.x, pa.y, pa.w, pa.h, pa.label, paHov, 0);
    
    // Main Menu button for game over
    const menuHov = hoveredBtn === 13;
    drawMenuButton(W/2, H/2 + 150, 160, 46, 'MAIN MENU', menuHov, 2);

    ctx.restore();
  }

  // ── Init & Start ──────────────────────────────────────────
  initSideObjects();
  // Pre-fill road offset so background is populated
  roadOffset = 0;
  bgOffset   = 0;

  // Fix: roundRect polyfill for older browsers
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
      this.beginPath();
      this.moveTo(x + r, y);
      this.lineTo(x + w - r, y);
      this.quadraticCurveTo(x + w, y, x + w, y + r);
      this.lineTo(x + w, y + h - r);
      this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      this.lineTo(x + r, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - r);
      this.lineTo(x, y + r);
      this.quadraticCurveTo(x, y, x + r, y);
      this.closePath();
      return this;
    };
  }

  // Start the loop
  requestAnimationFrame(gameLoop);

})(); // end IIFE
