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
  // State hooks
  const [waypoint, setWaypoint] = useState<Waypoint | null>(null);
  const [distance, setDistance] = useState<string>("-- m");
  const [directionGuidance, setDirectionGuidance] = useState<string>("--");
  const [savedWaypoints, setSavedWaypoints] = useState<SavedWaypoint[]>([]);
  const [bearing, setBearing] = useState<number>(0);

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

    // Calculate bearing whether pointing north or to waypoint
    const calculatedBearing = calculateBearing(
      currentPosition.latitude,
      currentPosition.longitude,
      waypoint.position.latitude,
      waypoint.position.longitude
    );
    
    // Update bearing
    setBearing(calculatedBearing);

    // Only update direction guidance if we're not pointing north
    if (!isPointingNorth) {
      // Get direction guidance based on bearing vs heading
      const guidance = getDirectionGuidance(calculatedBearing, heading);
      setDirectionGuidance(guidance);
    } else {
      setDirectionGuidance("--");
    }
  }, [currentPosition, waypoint, heading, isPointingNorth]);

  // Add waypoint from current location
  const saveCurrentLocationAsWaypoint = (name: string) => {
    if (!currentPosition) {
      return false;
    }
    
    // Create new waypoint
    const newWaypoint: SavedWaypoint = {
      name,
      position: {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude
      }
    };
    
    // Add to saved waypoints
    setSavedWaypoints(prev => [...prev, newWaypoint]);
    
    // Select this waypoint immediately
    setWaypoint({
      name: newWaypoint.name,
      position: newWaypoint.position
    });
    
    return true;
  };

  return {
    waypoint,
    distance,
    directionGuidance,
    bearing,
    setCustomWaypoint,
    selectSavedWaypoint,
    savedWaypoints,
    saveCurrentLocationAsWaypoint
  };
}
