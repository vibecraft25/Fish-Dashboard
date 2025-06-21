'use client';

import { useState, useEffect } from 'react';

interface FilterPanelProps {
  filters: {
    family: string;
    genus: string;
    country: string;
    yearFrom: number | null;
    yearTo: number | null;
    hasCoordinates: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

interface FilterOptions {
  families: string[];
  genera: string[];
  countries: string[];
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const [options, setOptions] = useState<FilterOptions>({
    families: [],
    genera: [],
    countries: [],
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/species/filter-options');
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">필터</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          과 (Family)
        </label>
        <select
          value={filters.family}
          onChange={(e) => handleChange('family', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"
        >
          <option value="">전체</option>
          {options.families.map((family) => (
            <option key={family} value={family}>
              {family}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          속 (Genus)
        </label>
        <select
          value={filters.genus}
          onChange={(e) => handleChange('genus', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"
        >
          <option value="">전체</option>
          {options.genera
            .filter(genus => !filters.family || genus.startsWith(filters.family))
            .map((genus) => (
              <option key={genus} value={genus}>
                {genus}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          국가
        </label>
        <select
          value={filters.country}
          onChange={(e) => handleChange('country', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"
        >
          <option value="">전체</option>
          {options.countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          연도 범위
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="시작"
            value={filters.yearFrom || ''}
            onChange={(e) => handleChange('yearFrom', e.target.value ? parseInt(e.target.value) : null)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"
          />
          <span className="self-center">~</span>
          <input
            type="number"
            placeholder="끝"
            value={filters.yearTo || ''}
            onChange={(e) => handleChange('yearTo', e.target.value ? parseInt(e.target.value) : null)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"
          />
        </div>
      </div>

      <button
        onClick={() => onFiltersChange({
          family: '',
          genus: '',
          country: '',
          yearFrom: null,
          yearTo: null,
          hasCoordinates: true,
        })}
        className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
      >
        필터 초기화
      </button>
    </div>
  );
}