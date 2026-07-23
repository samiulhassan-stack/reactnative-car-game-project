/**
 * Collision detection utilities
 * Handles rectangular bounding box collision detection
 */

import { Position, Size } from '../types';
import { GAME_CONFIG } from '../constants';

export interface BoundingBox extends Position, Size {}

/**
 * Check if two bounding boxes collide
 * Uses rectangular collision detection (AABB - Axis-Aligned Bounding Box)
 *
 * @param box1 First bounding box
 * @param box2 Second bounding box
 * @param threshold Collision threshold in pixels (for fine-tuning)
 * @returns true if boxes collide
 */
export function checkCollision(
  box1: BoundingBox,
  box2: BoundingBox,
  threshold: number = GAME_CONFIG.COLLISION_THRESHOLD
): boolean {
  return (
    box1.x < box2.x + box2.width - threshold &&
    box1.x + box1.width - threshold > box2.x &&
    box1.y < box2.y + box2.height - threshold &&
    box1.y + box1.height - threshold > box2.y
  );
}

/**
 * Check if a point is inside a bounding box
 * @param point Point to check
 * @param box Bounding box
 * @returns true if point is inside the box
 */
export function pointInBox(point: Position, box: BoundingBox): boolean {
  return (
    point.x >= box.x &&
    point.x <= box.x + box.width &&
    point.y >= box.y &&
    point.y <= box.y + box.height
  );
}

/**
 * Calculate distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance in pixels
 */
export function distance(p1: Position, p2: Position): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/**
 * Get the center point of a bounding box
 * @param box Bounding box
 * @returns Center point
 */
export function getBoxCenter(box: BoundingBox): Position {
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  };
}

/**
 * Check if object is out of bounds (off-screen)
 * @param entity Entity to check
 * @param screenHeight Screen height
 * @returns true if entity is off-screen
 */
export function isOutOfBounds(
  entity: BoundingBox,
  screenHeight: number = GAME_CONFIG.SCREEN_HEIGHT
): boolean {
  return (
    entity.y > screenHeight ||
    entity.y + entity.height < 0 ||
    entity.x > GAME_CONFIG.SCREEN_WIDTH ||
    entity.x + entity.width < 0
  );
}
