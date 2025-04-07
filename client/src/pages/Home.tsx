import { useEffect } from "react";
import Compass from "@/components/Compass";
import WaypointForm from "@/components/WaypointForm";
import PermissionOverlay from "@/components/PermissionOverlay";
import { useCompass } from "@/hooks/useCompass";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWaypoints } from "@/hooks/useWaypoints";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const { 
    heading, 
    isPointingNorth, 
    permissionsState: compassPermissions, 
    requestPermissions: requestCompassPermissions,
    togglePointingMode 
  } = useCompass();
  
  const { 
    currentPosition, 
    permissionsState: locationPermissions, 
    requestPermissions: requestLocationPermissions 
  } = useGeolocation();
  
  const { 
    waypoint, 
    distance, 
    directionGuidance, 
    setCustomWaypoint, 
    selectSavedWaypoint, 
    savedWaypoints,
    saveCurrentLocationAsWaypoint
  } = useWaypoints(currentPosition, heading, isPointingNorth);

  // Check if any permissions are not granted
  const permissionsNeeded = 
    compassPermissions !== 'granted' || 
    locationPermissions !== 'granted';

  // Request all permissions at once
  const requestAllPermissions = async () => {
    try {
      await Promise.all([
        requestCompassPermissions(),
        requestLocationPermissions()
      ]);
    } catch (error) {
      toast({
        title: "Permission Error",
        description: "Unable to access required device sensors. Some features may not work correctly.",
        variant: "destructive"
      });
    }
  };

  // Auto-request permissions on load
  useEffect(() => {
    if (permissionsNeeded) {
      requestAllPermissions();
    }
  }, []);

  return (
    <div className="bg-[#000000] text-white flex flex-col min-h-screen max-w-[400px] mx-auto">
      {/* Header */}
      <header className="p-4 fadeIn">
        <h1 className="text-center text-xl font-bold">Waypoint Compass</h1>
      </header>

      {/* Main Compass View */}
      <main className="flex-1 flex flex-col items-center justify-center py-4 fadeIn">
        <Compass 
          heading={heading} 
          isPointingNorth={isPointingNorth} 
          waypoint={waypoint}
        />
        
        {/* Distance and Direction Display */}
        <div className="mt-4 flex flex-col items-center fadeIn">
          {/* Distance to Waypoint */}
          <div className="mb-2 flex items-center">
            <span className="text-[#ABABAB]">Distance:</span>
            <span className="ml-2 text-xl font-bold">{distance}</span>
          </div>
          
          {/* Direction Guidance */}
          <div className="flex items-center">
            <span className="text-[#ABABAB]">Direction:</span>
            <span className="ml-2 text-xl font-bold text-[#34C759]">{directionGuidance}</span>
          </div>
        </div>
      </main>

      {/* Waypoint Controls */}
      <WaypointForm 
        onSetWaypoint={setCustomWaypoint}
        onSelectSavedWaypoint={selectSavedWaypoint}
        savedWaypoints={savedWaypoints}
        isPointingNorth={isPointingNorth}
        onTogglePointingMode={togglePointingMode}
        onSaveCurrentLocation={saveCurrentLocationAsWaypoint}
      />

      {/* Permission Overlay */}
      {permissionsNeeded && (
        <PermissionOverlay 
          isOpen={permissionsNeeded} 
          onRequestPermissions={requestAllPermissions}
        />
      )}

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-[#ABABAB] fadeIn">
        <p>Powered by AI Technology</p>
      </footer>
    </div>
  );
}
