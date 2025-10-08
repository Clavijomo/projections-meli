import { Chip } from '@mui/material';

interface PriorityChipProps {
  priority: string;
}

export const PriorityChip = ({ priority }: PriorityChipProps) => {
  const colors = {
    high: 'error' as const,
    medium: 'warning' as const,
    low: 'info' as const
  };
  
  return <Chip label={priority} color={colors[priority as keyof typeof colors]} size="small" variant="outlined" />;
};
