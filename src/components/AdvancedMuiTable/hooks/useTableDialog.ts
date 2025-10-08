import { useCallback, useState } from 'react';
import type { ExtendedHistoricalData } from './useTableData';

export const useTableDialog = () => {
  const [viewDialog, setViewDialog] = useState<{ open: boolean; row: ExtendedHistoricalData | null }>({
    open: false,
    row: null
  });

  const handleView = useCallback((row: ExtendedHistoricalData) => {
    setViewDialog({ open: true, row });
  }, []);

  const handleCloseDialog = useCallback(() => {
    setViewDialog({ open: false, row: null });
  }, []);

  return {
    viewDialog,
    handleView,
    handleCloseDialog
  };
};
