import { useEffect, useRef } from 'react';
import { calculateBearingToWaypoint } from '@/utils/navigation';
import type { Waypoint } from '@/hooks/useWaypoints';

interface CompassProps {
  heading: number;
  isPointingNorth: boolean;
  waypoint: Waypoint | null;
}

export default function Compass({ heading, isPointingNorth, waypoint }: CompassProps) {
  const degreeMarkersRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);

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

  // Update needle rotation
  useEffect(() => {
    const needle = needleRef.current;
    if (!needle) return;
    
    let rotationAngle = heading;
    
    // If pointing to waypoint and we have a waypoint, calculate the bearing
    if (!isPointingNorth && waypoint && waypoint.position) {
      rotationAngle = calculateBearingToWaypoint(waypoint, heading);
    }
    
    needle.style.transform = `translate(-50%, 0) rotate(${rotationAngle}deg)`;
  }, [heading, isPointingNorth, waypoint]);

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
        className="absolute top-[50%] left-[50%] w-[4px] h-[45%] rounded-t-full z-10"
        style={{
          background: 'linear-gradient(to top, #FF3B30, #FF3B30 90%, transparent)',
          transformOrigin: 'bottom center',
          transition: 'transform 0.3s ease-out'
        }}
      ></div>
      
      {/* Center Point */}
      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-[#007AFF] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
}
