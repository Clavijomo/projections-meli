import { useMemo } from 'react';
import type { ChartData } from '@/types/data';

export const useChartStats = (aggregatedData: (ChartData & { count: number; avg_spend: number; variance: number })[]) => {
  const stats = useMemo(() => {
    if (!aggregatedData.length) return null;

    const totalProjected = aggregatedData.reduce((sum, item) => sum + item.proyected_spend, 0);
    const avgProjected = totalProjected / aggregatedData.length;
    const maxValue = Math.max(...aggregatedData.map(item => item.max_spend));
    const minValue = Math.min(...aggregatedData.map(item => item.min_spend));

    return {
      total: totalProjected,
      average: avgProjected,
      max: maxValue,
      min: minValue,
      dataPoints: aggregatedData.length,
    };
  }, [aggregatedData]);

  return { stats };
};
