import {
  Avatar,
  Box,
  IconButton,
  LinearProgress,
  Rating,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';
import { StatusChip } from './StatusChip';
import { PriorityChip } from './PriorityChip';
import type { ExtendedHistoricalData } from '../hooks/useTableData';

interface TableRowComponentProps {
  row: ExtendedHistoricalData;
  onView: (row: ExtendedHistoricalData) => void;
}

export const TableRowComponent = ({ row, onView }: TableRowComponentProps) => {
  return (
    <TableRow
      key={row.id}
      hover
      sx={{
        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#fff' }
      }}
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#ededed' }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
            {row.vertical?.charAt(0)}
          </Avatar>
          {row.vertical}
        </Box>
      </TableCell>
      <TableCell sx={{ color: '#ededed' }}>{row.area}</TableCell>
      <TableCell sx={{ color: '#ededed' }}>{row.date}</TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: 'success.main' }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
          <LinearProgress
            variant="determinate"
            value={row.progress}
            sx={{ width: 60, height: 6, borderRadius: '200px' }}
          />
          <Typography variant="caption">{row.progress}%</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Ver detalles">
            <IconButton size="small" onClick={() => onView(row)}>
              <ViewIcon color='info' fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};
