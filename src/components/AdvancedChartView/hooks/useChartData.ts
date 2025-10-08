import { useMemo } from 'react';
import { parse } from 'date-fns';
import type { ChartData, CsvData, ProjectionData } from '@/types/data';

export const useChartData = (projectionData: CsvData[], startDate?: Date, endDate?: Date) => {
  const limitedData = useMemo(() => {
    if (!projectionData || projectionData.length === 0) {
      return [];
    }

    const maxRecords = 500;
    if (projectionData.length <= maxRecords) {
      return projectionData;
    }

    const step = Math.ceil(projectionData.length / maxRecords);
    const sampled = [];
    for (let i = 0; i < projectionData.length; i += step) {
      sampled.push(projectionData[i]);
    }
    return sampled;
  }, [projectionData]);

  const aggregatedData = useMemo(() => {
    if (!limitedData || limitedData.length === 0) {
      return [];
    }

    const grouped: Record<string, ChartData & {
      count: number;
      avg_spend: number;
      variance: number;
    }> = {};

    limitedData.forEach((row) => {
      if (!('proyected_spend' in row)) {
        return;
      }

      const projectionRow = row as ProjectionData;

      let date: Date;
      try {
        date = parse(projectionRow.date, 'dd/MM/yyyy', new Date());
        
        if (isNaN(date.getTime())) {
          return;
        }
      } catch (error) {
        return;
      }

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          date: new Date(date.getFullYear(), date.getMonth(), 1),
          proyected_spend: 0,
          max_spend: 0,
          min_spend: 0,
          count: 0,
          avg_spend: 0,
          variance: 0,
        };
      }

      const proyectedSpend = Number(projectionRow.proyected_spend) || 0;
      const maxSpend = Number(projectionRow.max_spend) || 0;
      const minSpend = Number(projectionRow.min_spend) || 0;

      if (isNaN(proyectedSpend) || isNaN(maxSpend) || isNaN(minSpend)) {
        return;
      }

      grouped[monthKey].proyected_spend += proyectedSpend;
      grouped[monthKey].max_spend += maxSpend;
      grouped[monthKey].min_spend += minSpend;
      grouped[monthKey].count += 1;
    });

    Object.values(grouped).forEach(item => {
      item.avg_spend = item.count > 0 ? item.proyected_spend / item.count : 0;
      item.variance = Math.abs(item.max_spend - item.min_spend);

      if (isNaN(item.proyected_spend)) item.proyected_spend = 0;
      if (isNaN(item.max_spend)) item.max_spend = 0;
      if (isNaN(item.min_spend)) item.min_spend = 0;
      if (isNaN(item.avg_spend)) item.avg_spend = 0;
      if (isNaN(item.variance)) item.variance = 0;
    });

    let result = Object.values(grouped).sort((a, b) => a.date.getTime() - b.date.getTime());

    if (startDate) {
      result = result.filter((item) => item.date >= startDate);
    }

    if (endDate) {
      result = result.filter((item) => item.date <= endDate);
    }

    return result;
  }, [limitedData, startDate, endDate]);

  return { aggregatedData };
};
