import type { Waypoint } from '@/hooks/useWaypoints';
import type { Position } from '@/hooks/useGeolocation';

// Calculate distance between two coordinates in meters using Haversine formula
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Calculate initial bearing between two points in degrees
export function calculateBearing(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const λ1 = lon1 * Math.PI / 180;
  const λ2 = lon2 * Math.PI / 180;

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  if (bearing < 0) {
    bearing += 360;
  }
  
  return bearing;
}

// Get the bearing to the waypoint, taking into account the device heading
// The goal is to correctly rotate the needle to point to the waypoint
export function calculateBearingToWaypoint(waypoint: Waypoint, heading: number): number {
  if (!waypoint.position) return heading;
  
  // For the purpose of our app, we want the needle to point in the direction
  // of the waypoint relative to the device's heading.
  // The bearing calculation is done in useWaypoints.ts where we have both
  // the current position and waypoint position available
  
  // Return the heading so the compass needle points north
  return heading;
}

// Get text direction guidance based on bearing difference
export function getDirectionGuidance(bearing: number, heading: number): string {
  // Calculate the relative direction
  const relativeBearing = (bearing - heading + 360) % 360;
  
  // Direction text based on relative bearing
  if (relativeBearing > 337.5 || relativeBearing <= 22.5) {
    return "Straight Ahead";
  } else if (relativeBearing > 22.5 && relativeBearing <= 67.5) {
    return "Slight Right";
  } else if (relativeBearing > 67.5 && relativeBearing <= 112.5) {
    return "Turn Right";
  } else if (relativeBearing > 112.5 && relativeBearing <= 157.5) {
    return "Sharp Right";
  } else if (relativeBearing > 157.5 && relativeBearing <= 202.5) {
    return "Turn Around";
  } else if (relativeBearing > 202.5 && relativeBearing <= 247.5) {
    return "Sharp Left";
  } else if (relativeBearing > 247.5 && relativeBearing <= 292.5) {
    return "Turn Left";
  } else {
    return "Slight Left";
  }
}
