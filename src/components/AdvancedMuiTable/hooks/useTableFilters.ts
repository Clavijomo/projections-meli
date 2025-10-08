import { useMemo, useState } from 'react';
import type { ExtendedHistoricalData } from './useTableData';

export const useTableFilters = (data: ExtendedHistoricalData[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(row => row.status === filterStatus);
    }

    return filtered;
  }, [data, searchTerm, filterStatus]);

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filteredData
  };
};
