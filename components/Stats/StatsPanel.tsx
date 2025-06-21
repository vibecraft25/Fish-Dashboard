'use client';

import { useState, useEffect } from 'react';

interface Stats {
  totalSpecies: number;
  totalRecords: number;
  recordsWithCoordinates: number;
  uniqueFamilies: number;
  uniqueCountries: number;
}

export function StatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!stats) {
    return <div className="p-4 text-gray-500">통계를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="p-4 bg-gray-50 space-y-3">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">데이터베이스 통계</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">전체 기록</span>
          <span className="text-sm font-semibold">{stats.totalRecords.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">고유 종</span>
          <span className="text-sm font-semibold">{stats.totalSpecies.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">좌표 있는 기록</span>
          <span className="text-sm font-semibold">
            {stats.recordsWithCoordinates.toLocaleString()} 
            ({((stats.recordsWithCoordinates / stats.totalRecords) * 100).toFixed(1)}%)
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">과(Family) 수</span>
          <span className="text-sm font-semibold">{stats.uniqueFamilies.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">국가 수</span>
          <span className="text-sm font-semibold">{stats.uniqueCountries.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}