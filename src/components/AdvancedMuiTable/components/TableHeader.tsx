import { TableCell, TableHead, TableRow } from '@mui/material';
import type { ExtendedHistoricalData } from '../hooks/useTableData';

interface TableHeaderProps {
  sortField: keyof ExtendedHistoricalData;
  sortDirection: 'asc' | 'desc';
  createSortHandler: (field: keyof ExtendedHistoricalData) => () => void;
}

export const TableHeader = ({ sortField, sortDirection, createSortHandler }: TableHeaderProps) => {
  const getSortIndicator = (field: keyof ExtendedHistoricalData) => {
    return sortField === field ? (sortDirection === 'asc' ? '↑' : '↓') : '';
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell onClick={createSortHandler('vertical')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
          Vertical {getSortIndicator('vertical')}
        </TableCell>
        <TableCell onClick={createSortHandler('area')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
          Área {getSortIndicator('area')}
        </TableCell>
        <TableCell onClick={createSortHandler('date')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
          Fecha {getSortIndicator('date')}
        </TableCell>
        <TableCell onClick={createSortHandler('spend')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
          Gasto {getSortIndicator('spend')}
        </TableCell>
        <TableCell>Estado</TableCell>
        <TableCell>Prioridad</TableCell>
        <TableCell>Rating</TableCell>
        <TableCell>Progreso</TableCell>
        <TableCell>Acciones</TableCell>
      </TableRow>
    </TableHead>
  );
};
