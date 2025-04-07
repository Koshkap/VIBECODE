import { useEffect, useRef, useState } from 'react';
import type { Waypoint } from '@/hooks/useWaypoints';

interface CompassProps {
  heading: number;
  isPointingNorth: boolean;
  waypoint: Waypoint | null;
  bearing?: number;
}

export default function Compass({ heading, isPointingNorth, waypoint, bearing = 0 }: CompassProps) {
  const degreeMarkersRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const waypointIndicatorRef = useRef<HTMLDivElement>(null);

  // Create degree markers 
  useEffect(() => {
    const markersContainer = degreeMarkersRef.current;
    if (!markersContainer) return;
    
    // Clear existing markers
    markersContainer.innerHTML = '';
    
    // Create markers
    for (let i = 0; i < 360; i += 15) {
      const marker = document.createElement('div');
      marker.className = i % 30 === 0 ? 'degree-marker major' : 'degree-marker';
      marker.style.transform = `rotate(${i}deg)`;
      markersContainer.appendChild(marker);
    }
  }, []);

  // Update north needle rotation
  useEffect(() => {
    const needle = needleRef.current;
    if (!needle) return;
    
    // Always rotate the needle based on the device heading
    // This makes the needle always point north when in north mode
    needle.style.transform = `rotate(${heading}deg)`;
  }, [heading]);
  
  // Update waypoint indicator
  useEffect(() => {
    const waypointIndicator = waypointIndicatorRef.current;
    if (!waypointIndicator) return;
    
    // Show/hide waypoint indicator based on mode
    waypointIndicator.style.display = (!isPointingNorth && waypoint) ? 'block' : 'none';
    
    // In waypoint mode, rotate the indicator to point to the waypoint
    if (!isPointingNorth && waypoint) {
      // For the waypoint indicator, we want to point to the waypoint
      // The bearing is the angle from north to the waypoint
      // We need to subtract the heading to account for device orientation
      // and add 180 to flip it since we want it pointing outward from center
      const rotation = bearing - heading + 180;
      waypointIndicator.style.transform = `rotate(${rotation}deg)`;
    }
  }, [isPointingNorth, waypoint, bearing, heading]);

  return (
    <div className="relative w-[70vh] max-w-[300px] h-[70vh] max-h-[300px]">
      {/* Compass Ring */}
      <div 
        className="absolute w-full h-full rounded-full border border-[#ABABAB]/30 animate-pulse" 
        style={{
          background: 'radial-gradient(circle, rgba(0,122,255,0.2) 0%, rgba(88,86,214,0.1) 100%)',
          boxShadow: '0 0 15px rgba(0,122,255,0.3)'
        }}
      ></div>
      
      {/* Compass Base */}
      <div 
        className="absolute w-[90%] h-[90%] rounded-full top-[5%] left-[5%] border border-[#ABABAB]/20"
        style={{
          background: 'radial-gradient(circle, rgba(30,30,30,1) 0%, rgba(0,0,0,1) 100%)'
        }}
      ></div>
      
      {/* Degree Markers */}
      <div 
        ref={degreeMarkersRef}
        className="absolute top-0 left-0 w-full h-full rounded-full"
      ></div>
      
      {/* Direction Markers */}
      <div className="absolute top-[10%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">N</div>
      <div className="absolute top-[50%] left-[90%] transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">E</div>
      <div className="absolute top-[90%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">S</div>
      <div className="absolute top-[50%] left-[10%] transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">W</div>
      
      {/* Compass Needle */}
      <div 
        ref={needleRef}
        className="absolute top-[5%] left-[50%] w-[4px] h-[45%] rounded-t-full z-10 -translate-x-1/2"
        style={{
          background: 'linear-gradient(to top, #FF3B30, #FF3B30 90%, transparent)',
          transformOrigin: 'bottom center',
          transition: 'transform 0.3s ease-out'
        }}
      ></div>
      
      {/* Waypoint Indicator */}
      <div 
        ref={waypointIndicatorRef}
        className="absolute top-[5%] left-[50%] w-[4px] h-[45%] z-10 -translate-x-1/2"
        style={{
          background: 'linear-gradient(to top, #34C759, #34C759 90%, transparent)',
          transformOrigin: 'bottom center',
          transition: 'transform 0.3s ease-out',
          display: 'none' // Will be shown via JS when in waypoint mode
        }}
      >
        {/* Arrow tip for waypoint indicator */}
        <div 
          className="absolute -left-[6px] top-[10px] w-0 h-0"
          style={{
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '12px solid #34C759'
          }}
        ></div>
      </div>
      
      {/* Center Point */}
      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-[#007AFF] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Waypoint Name Indicator */}
      {!isPointingNorth && waypoint && (
        <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-lg font-bold text-[#34C759]">{waypoint.name}</div>
        </div>
      )}
    </div>
  );
}
