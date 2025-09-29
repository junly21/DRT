/**
 * Geographic utility functions
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @returns Distance in meters
 */
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1.latitude * Math.PI) / 180; // φ, λ in radians
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Format distance for display
 * @param meters Distance in meters
 * @returns Formatted string (e.g., "150m", "1.2km")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Calculate bearing from point1 to point2
 * @param point1 Starting point
 * @param point2 Destination point
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(
  point1: Coordinates,
  point2: Coordinates
): number {
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360; // Normalize to 0-360
}

/**
 * Get compass direction from bearing
 * @param bearing Bearing in degrees
 * @returns Compass direction (N, NE, E, SE, S, SW, W, NW)
 */
export function getCompassDirection(bearing: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Sort coordinates by distance from a reference point
 * @param reference Reference point
 * @param points Array of points to sort
 * @returns Sorted array with distance information
 */
export function sortByDistance<T extends Coordinates>(
  reference: Coordinates,
  points: T[]
): (T & { distance: number })[] {
  return points
    .map((point) => ({
      ...point,
      distance: calculateDistance(reference, point),
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Check if a point is within a certain radius of another point
 * @param center Center point
 * @param point Point to check
 * @param radiusMeters Radius in meters
 * @returns True if point is within radius
 */
export function isWithinRadius(
  center: Coordinates,
  point: Coordinates,
  radiusMeters: number
): boolean {
  return calculateDistance(center, point) <= radiusMeters;
}

/**
 * Get the center point of multiple coordinates
 * @param points Array of coordinate points
 * @returns Center point
 */
export function getCenterPoint(points: Coordinates[]): Coordinates {
  if (points.length === 0) {
    throw new Error("Cannot calculate center of empty array");
  }

  const sum = points.reduce(
    (acc, point) => ({
      latitude: acc.latitude + point.latitude,
      longitude: acc.longitude + point.longitude,
    }),
    { latitude: 0, longitude: 0 }
  );

  return {
    latitude: sum.latitude / points.length,
    longitude: sum.longitude / points.length,
  };
}

/**
 * Validate if coordinates are valid
 * @param coords Coordinates to validate
 * @returns True if coordinates are valid
 */
export function isValidCoordinates(coords: Coordinates): boolean {
  return (
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180 &&
    !isNaN(coords.latitude) &&
    !isNaN(coords.longitude)
  );
}

