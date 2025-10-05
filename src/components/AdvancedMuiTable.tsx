import type { HistoricalData } from '@/types/data';
import {
    Add as AddIcon,
    Edit as EditIcon,
    GetApp as ExportIcon,
    Search as SearchIcon,
    Star as StarIcon,
    TrendingDown as TrendingDownIcon,
    TrendingUp as TrendingUpIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Rating,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

interface AdvancedMuiTableProps {
  data: HistoricalData[];
  title?: string;
}

interface ExtendedHistoricalData extends HistoricalData {
  id?: string;
  status?: 'active' | 'inactive' | 'pending';
  priority?: 'high' | 'medium' | 'low';
  rating?: number;
  progress?: number;
  favorite?: boolean;
  category?: string;
}

export const AdvancedMuiTable = ({ data, title = "Datos Históricos Avanzados" }: AdvancedMuiTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof ExtendedHistoricalData>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; row: ExtendedHistoricalData | null }>({
    open: false,
    row: null
  });
  const [viewDialog, setViewDialog] = useState<{ open: boolean; row: ExtendedHistoricalData | null }>({
    open: false,
    row: null
  });

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

  const filteredData = useMemo(() => {
    let filtered = extendedData;

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
  }, [extendedData, searchTerm, filterStatus]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue && bValue && aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSort = useCallback((field: keyof ExtendedHistoricalData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const handleRowSelect = useCallback((id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  }, [selectedRows]);

  const handleToggleFavorite = useCallback((id: string) => {
    console.log('Toggle favorite for:', id);
  }, []);

  const handleEdit = useCallback((row: ExtendedHistoricalData) => {
    setEditDialog({ open: true, row });
  }, []);

  const handleView = useCallback((row: ExtendedHistoricalData) => {
    setViewDialog({ open: true, row });
  }, []);

  const handleExport = useCallback(() => {
    const csvContent = [
      Object.keys(filteredData[0] || {}).join(','),
      ...filteredData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }, [filteredData, title]);

  const StatusChip = ({ status }: { status: string }) => {
    const colors = {
      active: 'success' as const,
      inactive: 'error' as const,
      pending: 'warning' as const
    };
    return <Chip label={status} color={colors[status as keyof typeof colors]} size="small" />;
  };

  const PriorityChip = ({ priority }: { priority: string }) => {
    const colors = {
      high: 'error' as const,
      medium: 'warning' as const,
      low: 'info' as const
    };
    return <Chip label={priority} color={colors[priority as keyof typeof colors]} size="small" variant="outlined" />;
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Exportar datos">
            <IconButton onClick={handleExport} sx={{ color: 'white' }}>
              <ExportIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar nuevo">
            <Fab size="small" color="primary">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(255,255,255,0.05)' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Buscar en todos los campos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
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
            label={`${filteredData.length} registros`} 
            color="info" 
            variant="outlined" 
          />
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Filtros Avanzados:
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
      </Paper>

      <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Switch size="small" />
              </TableCell>
              <TableCell onClick={() => handleSort('vertical')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Vertical {sortField === 'vertical' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('area')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Área {sortField === 'area' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('date')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Fecha {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('spend')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Gasto {sortField === 'spend' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Progreso</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow 
                key={row.id} 
                hover
                selected={selectedRows.has(row.id!)}
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }}
              >
                <TableCell padding="checkbox">
                  <Switch
                    size="small"
                    checked={selectedRows.has(row.id!)}
                    onChange={() => handleRowSelect(row.id!)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                      {row.vertical?.charAt(0)}
                    </Avatar>
                    {row.vertical}
                  </Box>
                </TableCell>
                <TableCell>{row.area}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    ${row.spend?.toLocaleString('es-CO')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={row.status!} />
                </TableCell>
                <TableCell>
                  <PriorityChip priority={row.priority!} />
                </TableCell>
                <TableCell>
                  <Rating value={row.rating} size="small" readOnly />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={row.progress} 
                      sx={{ width: 60, height: 6 }}
                    />
                    <Typography variant="caption">{row.progress}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Ver detalles">
                      <IconButton size="small" onClick={() => handleView(row)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleEdit(row)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Favorito">
                      <IconButton 
                        size="small" 
                        onClick={() => handleToggleFavorite(row.id!)}
                        color={row.favorite ? 'warning' : 'default'}
                      >
                        <StarIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
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

      <Dialog open={viewDialog.open} onClose={() => setViewDialog({ open: false, row: null })} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del Registro</DialogTitle>
        <DialogContent>
          {viewDialog.row && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
              {Object.entries(viewDialog.row).map(([key, value]) => (
                <Box key={key}>
                  <Typography variant="caption" color="text.secondary">
                    {key.toUpperCase()}:
                  </Typography>
                  <Typography variant="body2">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, row: null })}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, row: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Registro</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Esta es una demostración.
          </Alert>
          {editDialog.row && (
            <TextField
              fullWidth
              label="Vertical"
              defaultValue={editDialog.row.vertical}
              margin="normal"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, row: null })}>Cancelar</Button>
          <Button variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
