import { useState, useEffect } from 'react';

export interface Position {
  latitude: number;
  longitude: number;
}

type PermissionState = 'prompt' | 'granted' | 'denied';

export function useGeolocation() {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [permissionsState, setPermissionsState] = useState<PermissionState>('prompt');
  const [watchId, setWatchId] = useState<number | null>(null);

  // Request geolocation permissions
  const requestPermissions = async () => {
    try {
      if (!navigator.geolocation) {
        setPermissionsState('denied');
        throw new Error('Geolocation is not supported by this browser');
      }

      // Check geolocation permission state
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      setPermissionsState(permission.state as PermissionState);
      
      if (permission.state !== 'granted') {
        // This will trigger the permission prompt
        navigator.geolocation.getCurrentPosition(
          () => setPermissionsState('granted'),
          () => setPermissionsState('denied')
        );
      }
    } catch (err) {
      setPermissionsState('denied');
      throw err;
    }
  };

  // Set up geolocation watcher
  useEffect(() => {
    if (permissionsState !== 'granted') return;

    // Initial position fetch
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting current position:', error);
      },
      { enableHighAccuracy: true }
    );

    // Watch position for updates
    const id = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error watching position:', error);
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );

    setWatchId(id);

    // Clean up watcher
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [permissionsState]);

  return {
    currentPosition,
    permissionsState,
    requestPermissions
  };
}
