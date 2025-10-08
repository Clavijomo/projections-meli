import { useMemo } from 'react';
import type { HistoricalData } from '@/types/data';

export interface ExtendedHistoricalData extends HistoricalData {
  id?: string;
  status?: 'active' | 'inactive' | 'pending';
  priority?: 'high' | 'medium' | 'low';
  rating?: number;
  progress?: number;
  favorite?: boolean;
  category?: string;
}

export const useTableData = (data: HistoricalData[]) => {
  const extendedData = useMemo<ExtendedHistoricalData[]>(() => {
    return data.map((row, index) => ({
      ...row,
      id: `row-${index}`,
      status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'pending',
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      rating: Math.floor(Math.random() * 5) + 1,
      progress: Math.floor(Math.random() * 100),
      favorite: Math.random() > 0.7,
      category: ['Marketing', 'Ventas', 'Operaciones', 'IT'][Math.floor(Math.random() * 4)]
    }));
  }, [data]);

  return { extendedData };
};
