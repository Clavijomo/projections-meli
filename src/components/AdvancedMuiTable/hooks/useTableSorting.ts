import { useCallback, useMemo, useState } from 'react';
import type { ExtendedHistoricalData } from './useTableData';

export const useTableSorting = (data: ExtendedHistoricalData[]) => {
  const [sortField, setSortField] = useState<keyof ExtendedHistoricalData>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === bValue) return 0;

      const comparison = aValue && bValue && aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortField, sortDirection]);

  const handleSort = useCallback((field: keyof ExtendedHistoricalData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const createSortHandler = useCallback(
    (field: keyof ExtendedHistoricalData) => () => handleSort(field),
    [handleSort]
  );

  return {
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    sortedData,
    handleSort,
    createSortHandler
  };
};
