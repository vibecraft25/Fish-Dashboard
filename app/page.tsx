'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { FilterPanel } from '@/components/Filters/FilterPanel';
import { StatsPanel } from '@/components/Stats/StatsPanel';
import { SpeciesList } from '@/components/Species/SpeciesList';

// Dynamic import for map to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('@/components/Map/MapContainer').then(mod => mod.MapContainer),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />
  }
);

export default function Home() {
  const [showList, setShowList] = useState(false);
  const [filters, setFilters] = useState({
    family: '',
    genus: '',
    country: '',
    yearFrom: null as number | null,
    yearTo: null as number | null,
    hasCoordinates: true,
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg z-10 flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-ocean-blue">FishBase Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">어종 분포 인터랙티브 지도</p>
        </div>
        
        <StatsPanel />
        
        <FilterPanel filters={filters} onFiltersChange={setFilters} />
        
        <div className="p-4 border-t mt-auto">
          <button
            onClick={() => setShowList(!showList)}
            className="w-full py-2 px-4 bg-ocean-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showList ? '지도 보기' : '목록 보기'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {showList ? (
          <SpeciesList filters={filters} />
        ) : (
          <MapContainer filters={filters} />
        )}
      </div>
    </div>
  );
}