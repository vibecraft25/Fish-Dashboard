'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface SafeMapProps {
  children: React.ReactNode;
  center: LatLngExpression;
  zoom: number;
  className?: string;
}

// Hook to handle map cleanup
function MapCleanup() {
  const map = useMap();
  const mapRef = useRef(map);
  
  useEffect(() => {
    mapRef.current = map;
    
    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        const container = mapRef.current.getContainer();
        if (container && '_leaflet_id' in container) {
          // Reset the leaflet ID to allow re-initialization
          (container as any)._leaflet_id = null;
        }
      }
    };
  }, [map]);
  
  return null;
}

export function SafeMap({ children, center, zoom, className = "w-full h-full" }: SafeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapKey = useRef(`map-${Date.now()}`);
  
  useEffect(() => {
    // Cleanup any existing leaflet instances on the container
    if (containerRef.current) {
      const container = containerRef.current.querySelector('.leaflet-container');
      if (container && '_leaflet_id' in container) {
        (container as any)._leaflet_id = null;
      }
    }
  }, []);
  
  return (
    <div ref={containerRef} className={className}>
      <MapContainer
        key={mapKey.current}
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={true}
      >
        <MapCleanup />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
}