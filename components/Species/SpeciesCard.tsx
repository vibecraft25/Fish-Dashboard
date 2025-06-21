'use client';

interface SpeciesCardProps {
  species: {
    id: string;
    scientificName: string;
    family: string | null;
    genus: string | null;
    species: string | null;
    countryCode: string | null;
    locality: string | null;
    year: number | null;
    decimalLatitude: number | null;
    decimalLongitude: number | null;
    institutionCode: string | null;
    catalogNumber: string | null;
  };
}

export function SpeciesCard({ species }: SpeciesCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-ocean-blue mb-2">
        {species.scientificName}
      </h3>
      
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
        {species.family && (
          <div>
            <span className="font-medium">과:</span> {species.family}
          </div>
        )}
        
        {species.genus && (
          <div>
            <span className="font-medium">속:</span> {species.genus}
          </div>
        )}
        
        {species.countryCode && (
          <div>
            <span className="font-medium">국가:</span> {species.countryCode}
          </div>
        )}
        
        {species.year && (
          <div>
            <span className="font-medium">연도:</span> {species.year}
          </div>
        )}
        
        {species.decimalLatitude && species.decimalLongitude && (
          <div className="col-span-2">
            <span className="font-medium">좌표:</span> {species.decimalLatitude.toFixed(2)}, {species.decimalLongitude.toFixed(2)}
          </div>
        )}
        
        {species.locality && (
          <div className="col-span-2">
            <span className="font-medium">위치:</span> {species.locality}
          </div>
        )}
        
        {species.institutionCode && (
          <div>
            <span className="font-medium">기관:</span> {species.institutionCode}
          </div>
        )}
        
        {species.catalogNumber && (
          <div>
            <span className="font-medium">카탈로그:</span> {species.catalogNumber}
          </div>
        )}
      </div>
    </div>
  );
}