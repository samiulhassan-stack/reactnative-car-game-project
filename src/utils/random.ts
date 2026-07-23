/**
 * Random number generation utilities
 */

/**
 * Generate a random integer between min (inclusive) and max (exclusive)
 * @param min Minimum value (inclusive)
 * @param max Maximum value (exclusive)
 * @returns Random integer
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Generate a random float between min and max
 * @param min Minimum value
 * @param max Maximum value
 * @returns Random float
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a random boolean with given probability
 * @param probability Probability of true (0-1)
 * @returns Random boolean
 */
export function randomBool(probability: number = 0.5): boolean {
  return Math.random() < probability;
}

/**
 * Get a random item from an array
 * @param array Array to pick from
 * @returns Random item from array
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random position on the road
 * @param roadWidth Width of the road
 * @param roadLeftOffset Left offset of the road
 * @param yPosition Y position
 * @param objectWidth Width of object to position
 * @returns Random position on road
 */
export function randomRoadPosition(
  roadWidth: number,
  roadLeftOffset: number,
  yPosition: number,
  objectWidth: number
): { x: number; y: number } {
  const minX = roadLeftOffset;
  const maxX = roadLeftOffset + roadWidth - objectWidth;
  const x = randomInt(minX, maxX);
  return { x, y: yPosition };
}
