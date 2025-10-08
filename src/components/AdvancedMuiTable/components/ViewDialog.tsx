import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import type { ExtendedHistoricalData } from '../hooks/useTableData';

interface ViewDialogProps {
  open: boolean;
  row: ExtendedHistoricalData | null;
  onClose: () => void;
}

export const ViewDialog = ({ open, row, onClose }: ViewDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalles del Registro</DialogTitle>
      <DialogContent>
        {row && (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            {Object.entries(row).map(([key, value]) => (
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
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};
