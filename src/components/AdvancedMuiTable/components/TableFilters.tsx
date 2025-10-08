import {
  Box,
  Button,
  Chip,
  Collapse,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import type { ExtendedHistoricalData } from '../hooks/useTableData';

interface TableFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  sortField: keyof ExtendedHistoricalData;
  setSortField: (field: keyof ExtendedHistoricalData) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  filteredDataLength: number;
}

export const TableFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  showFilters,
  setShowFilters,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  filteredDataLength
}: TableFiltersProps) => {
  return (
    <div className='bg-zinc-600 p-4 mb-5 rounded-2xl text-white'>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize='small' />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Estado"
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="active">Activo</MenuItem>
            <MenuItem value="inactive">Inactivo</MenuItem>
            <MenuItem value="pending">Pendiente</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={showFilters}
              onChange={(e) => setShowFilters(e.target.checked)}
              color="primary"
            />
          }
          label="Filtros avanzados"
        />

        <Chip
          label={`${filteredDataLength} registros`}
          color="info"
          variant="outlined"
        />
      </Box>

      <Collapse in={showFilters}>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Filtros avanzados:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as keyof ExtendedHistoricalData)}
                label="Ordenar por"
              >
                <MenuItem value="date">Fecha</MenuItem>
                <MenuItem value="spend">Gasto</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="progress">Progreso</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              size="small"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              startIcon={sortDirection === 'asc' ? <TrendingUpIcon /> : <TrendingDownIcon />}
            >
              {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </div>
  );
};
