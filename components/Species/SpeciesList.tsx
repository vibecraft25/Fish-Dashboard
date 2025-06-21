'use client';

import { useState, useEffect } from 'react';
import { SpeciesCard } from './SpeciesCard';

interface SpeciesListProps {
  filters: {
    family: string;
    genus: string;
    country: string;
    yearFrom: number | null;
    yearTo: number | null;
    hasCoordinates: boolean;
  };
}

interface Species {
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
}

export function SpeciesList({ filters }: SpeciesListProps) {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchSpecies();
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const fetchSpecies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', itemsPerPage.toString());
      
      if (filters.family) params.append('family', filters.family);
      if (filters.genus) params.append('genus', filters.genus);
      if (filters.country) params.append('country', filters.country);
      if (filters.yearFrom) params.append('yearFrom', filters.yearFrom.toString());
      if (filters.yearTo) params.append('yearTo', filters.yearTo.toString());

      const response = await fetch(`/api/species?${params}`);
      const data = await response.json();
      
      setSpecies(data.species);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      console.error('Failed to fetch species:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">어종 목록</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {species.map((item) => (
              <SpeciesCard key={item.id} species={item} />
            ))}
          </div>
        )}
      </div>
      
      {!loading && totalPages > 1 && (
        <div className="p-4 bg-white border-t flex justify-center items-center gap-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-ocean-blue text-white rounded disabled:bg-gray-300"
          >
            이전
          </button>
          <span className="text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-ocean-blue text-white rounded disabled:bg-gray-300"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}