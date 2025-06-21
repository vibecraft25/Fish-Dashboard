'use client';

import { Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

interface SpeciesMarkerProps {
  species: {
    id: string;
    scientificName: string;
    decimalLatitude: number;
    decimalLongitude: number;
    locality: string | null;
    countryCode: string | null;
    year: number | null;
    family: string | null;
    genus: string | null;
  };
}

export function SpeciesMarker({ species }: SpeciesMarkerProps) {
  const position: LatLngExpression = [species.decimalLatitude, species.decimalLongitude];

  return (
    <Marker position={position}>
      <Popup>
        <div className="p-2">
          <h3 className="font-bold text-lg mb-2">{species.scientificName}</h3>
          <div className="space-y-1 text-sm">
            {species.family && (
              <p><span className="font-semibold">과:</span> {species.family}</p>
            )}
            {species.genus && (
              <p><span className="font-semibold">속:</span> {species.genus}</p>
            )}
            {species.locality && (
              <p><span className="font-semibold">위치:</span> {species.locality}</p>
            )}
            {species.countryCode && (
              <p><span className="font-semibold">국가:</span> {species.countryCode}</p>
            )}
            {species.year && (
              <p><span className="font-semibold">연도:</span> {species.year}</p>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}