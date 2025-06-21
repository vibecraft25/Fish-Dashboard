'use client';

import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

let leafletConfigured = false;

export function LeafletWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Leaflet 설정을 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined' && !leafletConfigured) {
      const L = require('leaflet');
      
      // Fix for default markers in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });
      
      leafletConfigured = true;
    }
    
    // Cleanup function to reset leaflet containers on unmount
    return () => {
      if (typeof window !== 'undefined') {
        // Find all leaflet containers and reset their IDs
        const containers = document.querySelectorAll('.leaflet-container');
        containers.forEach((container: any) => {
          if (container._leaflet_id) {
            container._leaflet_id = null;
          }
        });
      }
    };
  }, []);

  return <>{children}</>;
}