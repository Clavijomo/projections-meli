import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography
} from '@mui/material';
import { useState } from 'react';
import type { HistoricalData } from '@/types/data';

import { useTableData } from './hooks/useTableData';
import { useTableFilters } from './hooks/useTableFilters';
import { useTableSorting } from './hooks/useTableSorting';
import { useTablePagination } from './hooks/useTablePagination';
import { useTableDialog } from './hooks/useTableDialog';

import { TableFilters } from './components/TableFilters';
import { TableHeader } from './components/TableHeader';
import { TableRowComponent } from './components/TableRowComponent';
import { ViewDialog } from './components/ViewDialog';

interface AdvancedMuiTableProps {
  data: HistoricalData[];
  title?: string;
}

export const AdvancedMuiTable = ({ data, title = "Datos Históricos Avanzados" }: AdvancedMuiTableProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const { extendedData } = useTableData(data);
  const { searchTerm, setSearchTerm, filterStatus, setFilterStatus, filteredData } = useTableFilters(extendedData);
  const { sortField, setSortField, sortDirection, setSortDirection, sortedData, createSortHandler } = useTableSorting(filteredData);
  const { page, rowsPerPage, paginatedData, handleChangePage, handleChangeRowsPerPage } = useTablePagination(sortedData);
  const { viewDialog, handleView, handleCloseDialog } = useTableDialog();

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" align='center' component="h2" sx={{ color: 'white', fontWeight: 'semibold', width: '100%' }}>
          {title}
        </Typography>
      </Box>

      <TableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        filteredDataLength={filteredData.length}
      />

      <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
        <Table stickyHeader>
          <TableHeader
            sortField={sortField}
            sortDirection={sortDirection}
            createSortHandler={createSortHandler}
          />
          <TableBody>
            {paginatedData.map((row) => (
              <TableRowComponent
                key={row.id}
                row={row}
                onView={handleView}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{ color: 'white', '& .MuiTablePagination-selectIcon': { color: 'white' } }}
      />

      <ViewDialog
        open={viewDialog.open}
        row={viewDialog.row}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};
