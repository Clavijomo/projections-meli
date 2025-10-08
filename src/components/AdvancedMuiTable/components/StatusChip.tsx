import { Chip } from '@mui/material';

interface StatusChipProps {
  status: string;
}

export const StatusChip = ({ status }: StatusChipProps) => {
  const colors = {
    active: 'success' as const,
    inactive: 'error' as const,
    pending: 'warning' as const
  };

  return <Chip label={status} color={colors[status as keyof typeof colors]} size="small" />;
};
