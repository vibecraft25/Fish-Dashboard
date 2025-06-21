'use client';

import { useState, useEffect, useMemo } from 'react';
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { LatLngExpression } from 'leaflet';
import { SpeciesMarker } from './SpeciesMarker';
import { LeafletWrapper } from './LeafletWrapper';
import { SafeMap } from './SafeMap';

interface MapContainerProps {
  filters: {
    family: string;
    genus: string;
    country: string;
    yearFrom: number | null;
    yearTo: number | null;
    hasCoordinates: boolean;
  };
}

interface SpeciesData {
  id: string;
  scientificName: string;
  decimalLatitude: number;
  decimalLongitude: number;
  locality: string | null;
  countryCode: string | null;
  year: number | null;
  family: string | null;
  genus: string | null;
}


export function MapContainer({ filters }: MapContainerProps) {
  const [species, setSpecies] = useState<SpeciesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const center: LatLngExpression = useMemo(() => [20, 0], []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchSpeciesData();
    }
  }, [filters, isClient]);

  const fetchSpeciesData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.family) params.append('family', filters.family);
      if (filters.genus) params.append('genus', filters.genus);
      if (filters.country) params.append('country', filters.country);
      if (filters.yearFrom) params.append('yearFrom', filters.yearFrom.toString());
      if (filters.yearTo) params.append('yearTo', filters.yearTo.toString());
      params.append('hasCoordinates', 'true');

      const response = await fetch(`/api/species/map-data?${params}`);
      const data = await response.json();
      setSpecies(data);
    } catch (error) {
      console.error('Failed to fetch species data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-600">지도 로딩 중...</div>
      </div>
    );
  }

  return (
    <LeafletWrapper>
      <div className="w-full h-full relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 z-20 flex items-center justify-center">
            <div className="text-lg text-gray-600">데이터 로딩 중...</div>
          </div>
        )}
        
        {isClient && (
          <SafeMap center={center} zoom={2}>
            <MarkerClusterGroup>
              {species.map((item) => (
                <SpeciesMarker key={item.id} species={item} />
              ))}
            </MarkerClusterGroup>
          </SafeMap>
        )}
        
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow-lg z-10">
          <p className="text-sm text-gray-600">
            표시된 종: {species.length.toLocaleString()}개
          </p>
        </div>
      </div>
    </LeafletWrapper>
  );
}