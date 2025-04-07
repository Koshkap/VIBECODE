import { useEffect, useRef, useState } from 'react';
import type { SavedWaypoint } from '@/hooks/useWaypoints';
import type { Position } from '@/hooks/useGeolocation';

interface MinimapProps {
  currentPosition: Position | null;
  savedWaypoints: SavedWaypoint[];
  activeWaypoint: string | null;
  onSelectWaypoint: (name: string) => void;
}

export default function Minimap({ 
  currentPosition, 
  savedWaypoints, 
  activeWaypoint,
  onSelectWaypoint 
}: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pulseSize, setPulseSize] = useState(4);
  const [scaleFactor, setScaleFactor] = useState(0.0001);
  
  // Pulse animation
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseSize(size => (size > 6 ? 4 : size + 0.5));
    }, 200);
    
    return () => clearInterval(pulseInterval);
  }, []);
  
  // Draw the minimap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentPosition) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#1E1E1E';
    ctx.fillRect(0, 0, width, height);
    
    // Draw border
    ctx.strokeStyle = '#ABABAB';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#ABABAB';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.2;
    
    // Vertical grid lines
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
    
    // Draw center (current position)
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw pulsing circle at center
    ctx.fillStyle = '#007AFF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw outer pulse ring
    ctx.strokeStyle = '#007AFF';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseSize + 3, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
    
    // If there are no waypoints, we're done
    if (savedWaypoints.length === 0) return;
    
    // Draw waypoints
    savedWaypoints.forEach(waypoint => {
      // Calculate position relative to current position
      const deltaLat = (waypoint.position.latitude - currentPosition.latitude) * 111000; // approx meters per degree latitude
      const deltaLng = (waypoint.position.longitude - currentPosition.longitude) * 
                      111000 * Math.cos(currentPosition.latitude * (Math.PI / 180)); // adjust for longitude
      
      // Scale and position on minimap
      const waypointX = centerX + deltaLng * scaleFactor;
      const waypointY = centerY - deltaLat * scaleFactor; // Y is inverted in canvas
      
      // Check if waypoint is within canvas bounds
      if (waypointX >= 0 && waypointX <= width && waypointY >= 0 && waypointY <= height) {
        // Draw waypoint
        ctx.fillStyle = waypoint.name === activeWaypoint ? '#34C759' : '#ABABAB';
        ctx.beginPath();
        ctx.arc(waypointX, waypointY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw label
        ctx.font = '8px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(waypoint.name, waypointX, waypointY - 8);
      }
    });
    
  }, [currentPosition, savedWaypoints, activeWaypoint, pulseSize, scaleFactor]);
  
  // Handle clicks on the minimap
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !currentPosition || savedWaypoints.length === 0) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Find closest waypoint
    let closestDistance = Infinity;
    let closestWaypointName: string | null = null;
    
    savedWaypoints.forEach(waypoint => {
      // Calculate position relative to current position
      const deltaLat = (waypoint.position.latitude - currentPosition.latitude) * 111000;
      const deltaLng = (waypoint.position.longitude - currentPosition.longitude) * 
                      111000 * Math.cos(currentPosition.latitude * (Math.PI / 180));
      
      // Scale and position on minimap
      const waypointX = centerX + deltaLng * scaleFactor;
      const waypointY = centerY - deltaLat * scaleFactor;
      
      // Calculate distance to click
      const distance = Math.sqrt(Math.pow(waypointX - x, 2) + Math.pow(waypointY - y, 2));
      
      // Update closest waypoint if this one is closer
      if (distance < closestDistance && distance < 20) { // 20px click radius
        closestDistance = distance;
        closestWaypointName = waypoint.name;
      }
    });
    
    // If we found a close waypoint, select it
    if (closestWaypointName) {
      onSelectWaypoint(closestWaypointName);
    }
  };
  
  // Handle zoom in/out
  const handleZoomIn = () => {
    setScaleFactor(prev => Math.min(prev * 1.5, 0.0005));
  };

  const handleZoomOut = () => {
    setScaleFactor(prev => Math.max(prev / 1.5, 0.00002));
  };
  
  return (
    <div className="relative bg-[#1E1E1E] border border-[#ABABAB]/30 rounded-md overflow-hidden">
      <div className="p-2 text-xs font-semibold text-[#ABABAB] bg-[#000000] flex justify-between items-center">
        <span>Nearby Waypoints</span>
        <div className="flex space-x-2">
          <button 
            onClick={handleZoomOut}
            className="w-6 h-6 bg-[#333333] text-white flex items-center justify-center rounded hover:bg-[#444444]"
          >
            -
          </button>
          <button 
            onClick={handleZoomIn}
            className="w-6 h-6 bg-[#333333] text-white flex items-center justify-center rounded hover:bg-[#444444]"
          >
            +
          </button>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        width={150} 
        height={150}
        onClick={handleClick}
        className="cursor-pointer"
      />
    </div>
  );
}