import { FormEvent, useState } from 'react';
import type { SavedWaypoint } from '@/hooks/useWaypoints';

interface WaypointFormProps {
  onSetWaypoint: (lat: number, lng: number) => void;
  onSelectSavedWaypoint: (name: string) => void;
  savedWaypoints: SavedWaypoint[];
  isPointingNorth: boolean;
  onTogglePointingMode: () => void;
  onSaveCurrentLocation?: (name: string) => boolean;
}

export default function WaypointForm({
  onSetWaypoint,
  onSelectSavedWaypoint,
  savedWaypoints,
  isPointingNorth,
  onTogglePointingMode,
  onSaveCurrentLocation
}: WaypointFormProps) {
  const [waypointName, setWaypointName] = useState<string>('');

  const handleSaveCurrentLocation = (e: FormEvent) => {
    e.preventDefault();
    
    if (!waypointName.trim()) {
      alert("Please enter a name for this waypoint.");
      return;
    }
    
    // Check if waypoint with this name already exists
    if (savedWaypoints.some(wp => wp.name === waypointName.trim())) {
      alert("A waypoint with this name already exists. Please choose a different name.");
      return;
    }
    
    if (onSaveCurrentLocation) {
      const success = onSaveCurrentLocation(waypointName.trim());
      if (success) {
        setWaypointName(''); // Clear input on success
      } else {
        alert("Could not save waypoint. Make sure your location is available.");
      }
    }
  };

  return (
    <section className="p-4 fadeIn">
      {/* Waypoint Form */}
      <form onSubmit={handleSaveCurrentLocation} className="mb-4">
        <div className="mb-3">
          <label htmlFor="waypointName" className="block text-sm text-[#ABABAB] mb-1">Waypoint Name</label>
          <input 
            type="text" 
            id="waypointName" 
            placeholder="Home, Office, etc." 
            className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#ABABAB]/30 rounded-lg text-white"
            value={waypointName}
            onChange={(e) => setWaypointName(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-[#007AFF] text-white font-bold py-2 px-4 rounded-lg button-press mb-2"
        >
          Save Current Location
        </button>
      </form>
      
      {/* Saved Waypoints */}
      <div className="mb-4">
        <h3 className="text-sm text-[#ABABAB] mb-2">Saved Waypoints</h3>
        {savedWaypoints.length === 0 ? (
          <p className="text-[#ABABAB] text-sm italic">No waypoints saved yet. Save your current location above.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {savedWaypoints.map((waypoint) => (
              <button 
                key={waypoint.name}
                className="bg-[#1E1E1E] text-white py-2 px-2 rounded-lg border border-[#ABABAB]/20 text-sm button-press"
                onClick={() => onSelectSavedWaypoint(waypoint.name)}
              >
                {waypoint.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Toggle North Button */}
      <button 
        className="w-full bg-[#1E1E1E] text-white font-bold py-2 px-4 rounded-lg border border-[#ABABAB]/20 button-press"
        onClick={onTogglePointingMode}
      >
        {isPointingNorth ? "Switch to Waypoint" : "Switch to True North"}
      </button>
    </section>
  );
}
