import { useState, useEffect } from 'react';

type PermissionState = 'prompt' | 'granted' | 'denied';

export function useCompass() {
  const [heading, setHeading] = useState<number>(0);
  const [isPointingNorth, setIsPointingNorth] = useState<boolean>(true);
  const [permissionsState, setPermissionsState] = useState<PermissionState>('prompt');

  // Toggle between waypoint and north mode
  const togglePointingMode = () => {
    setIsPointingNorth(prev => !prev);
  };

  // Request device orientation permissions
  const requestPermissions = async () => {
    // Check if DeviceOrientationEvent is available
    if (typeof DeviceOrientationEvent === 'undefined') {
      setPermissionsState('denied');
      throw new Error('Device orientation not supported on this device');
    }

    // Request permission if available (iOS 13+ requires this)
    if (
      DeviceOrientationEvent &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        setPermissionsState(permission);
        if (permission !== 'granted') {
          throw new Error('Device orientation permission denied');
        }
      } catch (err) {
        setPermissionsState('denied');
        throw err;
      }
    } else {
      // For devices that don't need explicit permission
      setPermissionsState('granted');
    }
  };

  // Setup device orientation event listener
  useEffect(() => {
    if (permissionsState !== 'granted') return;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      // Alpha is the compass direction the device is facing in degrees
      if (event.alpha !== null) {
        // Convert to 0-360 degrees
        setHeading(360 - event.alpha);
      } else if (event.webkitCompassHeading !== undefined) {
        // For iOS devices
        setHeading(event.webkitCompassHeading);
      }
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [permissionsState]);

  return {
    heading,
    isPointingNorth,
    permissionsState,
    requestPermissions,
    togglePointingMode
  };
}
