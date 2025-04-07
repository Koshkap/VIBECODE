import { FormEvent, useState } from 'react';
import type { SavedWaypoint } from '@/hooks/useWaypoints';

interface WaypointFormProps {
  onSetWaypoint: (lat: number, lng: number) => void;
  onSelectSavedWaypoint: (name: string) => void;
  savedWaypoints: SavedWaypoint[];
  isPointingNorth: boolean;
  onTogglePointingMode: () => void;
}

export default function WaypointForm({
  onSetWaypoint,
  onSelectSavedWaypoint,
  savedWaypoints,
  isPointingNorth,
  onTogglePointingMode
}: WaypointFormProps) {
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      alert("Please enter valid latitude and longitude values.");
      return;
    }
    
    onSetWaypoint(latitude, longitude);
  };

  return (
    <section className="p-4 fadeIn">
      {/* Waypoint Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="latitude" className="block text-sm text-[#ABABAB] mb-1">Latitude</label>
            <input 
              type="number" 
              id="latitude" 
              step="0.000001" 
              placeholder="37.7749" 
              className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#ABABAB]/30 rounded-lg text-white"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm text-[#ABABAB] mb-1">Longitude</label>
            <input 
              type="number" 
              id="longitude" 
              step="0.000001" 
              placeholder="-122.4194" 
              className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#ABABAB]/30 rounded-lg text-white"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full bg-[#007AFF] text-white font-bold py-2 px-4 rounded-lg button-press"
        >
          Set Waypoint
        </button>
      </form>
      
      {/* Quick Waypoints */}
      <div className="mb-4">
        <h3 className="text-sm text-[#ABABAB] mb-2">Saved Waypoints</h3>
        <div className="grid grid-cols-3 gap-2">
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
