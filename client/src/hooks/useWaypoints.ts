import { useState, useEffect } from 'react';
import { Position } from './useGeolocation';
import { calculateDistance, calculateBearing, getDirectionGuidance } from '@/utils/navigation';

export interface Waypoint {
  name: string;
  position: Position | null;
}

export interface SavedWaypoint {
  name: string;
  position: Position;
}

export function useWaypoints(
  currentPosition: Position | null, 
  heading: number,
  isPointingNorth: boolean
) {
  const [waypoint, setWaypoint] = useState<Waypoint | null>(null);
  const [distance, setDistance] = useState<string>("-- m");
  const [directionGuidance, setDirectionGuidance] = useState<string>("--");

  // Predefined waypoints
  const savedWaypoints: SavedWaypoint[] = [
    { name: "Home", position: { latitude: 37.7749, longitude: -122.4194 } },
    { name: "Work", position: { latitude: 37.7833, longitude: -122.4167 } },
    { name: "Car", position: { latitude: 37.7935, longitude: -122.3943 } }
  ];

  // Set a custom waypoint
  const setCustomWaypoint = (lat: number, lng: number) => {
    setWaypoint({
      name: "Custom",
      position: { latitude: lat, longitude: lng }
    });
  };

  // Select a saved waypoint
  const selectSavedWaypoint = (name: string) => {
    const selected = savedWaypoints.find(wp => wp.name === name);
    if (selected) {
      setWaypoint({
        name: selected.name,
        position: selected.position
      });
    }
  };

  // Update distance and direction when position or waypoint changes
  useEffect(() => {
    if (!currentPosition || !waypoint || !waypoint.position) {
      setDistance("-- m");
      setDirectionGuidance("--");
      return;
    }

    // Calculate distance
    const distanceInMeters = calculateDistance(
      currentPosition.latitude,
      currentPosition.longitude,
      waypoint.position.latitude,
      waypoint.position.longitude
    );

    // Format distance
    if (distanceInMeters > 1000) {
      setDistance(`${(distanceInMeters / 1000).toFixed(1)} km`);
    } else {
      setDistance(`${Math.round(distanceInMeters)} m`);
    }

    // Only update direction guidance if we're not pointing north
    if (!isPointingNorth) {
      // Calculate bearing
      const bearing = calculateBearing(
        currentPosition.latitude,
        currentPosition.longitude,
        waypoint.position.latitude,
        waypoint.position.longitude
      );

      // Get direction guidance based on bearing vs heading
      const guidance = getDirectionGuidance(bearing, heading);
      setDirectionGuidance(guidance);
    } else {
      setDirectionGuidance("--");
    }
  }, [currentPosition, waypoint, heading, isPointingNorth]);

  return {
    waypoint,
    distance,
    directionGuidance,
    setCustomWaypoint,
    selectSavedWaypoint,
    savedWaypoints
  };
}
