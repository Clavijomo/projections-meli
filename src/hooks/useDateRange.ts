import { useMemo } from 'react';
import { parse } from 'date-fns';
import type { CsvData, HistoricalData, ProjectionData } from '@/types/data';

interface DateRange {
  minDate: Date | null;
  maxDate: Date | null;
}

export function useDateRange(data: CsvData[]): DateRange {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return { minDate: null, maxDate: null };
    }

    const maxSampleSize = 200;
    const sampleData = data.length > maxSampleSize 
      ? data.filter((_, index) => index % Math.ceil(data.length / maxSampleSize) === 0)
      : data;

    let minDate: Date | null = null;
    let maxDate: Date | null = null;
    
    const dateCache = new Map<string, Date | null>();

    sampleData.forEach((row) => {
      if (!row.date) return;
      
      let parsedDate = dateCache.get(row.date);
      
      if (parsedDate === undefined) {
        try {
          parsedDate = parse(row.date, 'dd/MM/yyyy', new Date());
          parsedDate = !isNaN(parsedDate.getTime()) ? parsedDate : null;
        } catch (error) {
          parsedDate = null;
        }
        dateCache.set(row.date, parsedDate);
      }
      
      if (parsedDate) {
        if (!minDate || parsedDate < minDate) {
          minDate = parsedDate;
        }
        if (!maxDate || parsedDate > maxDate) {
          maxDate = parsedDate;
        }
      }
    });
    
    return { minDate, maxDate };
  }, [data.length, data.slice(0, 5).map(row => row.date).join(',')]);  
}

export function useHistoricalDateRange(data: CsvData[]): DateRange {
  const historicalData = useMemo(() => {
    if (!data.length) return [];
    
    const firstRow = data[0];
    const isAllHistorical = 'spend' in firstRow && !('proyected_spend' in firstRow);
    
    if (isAllHistorical) {
      return data;
    }
    
    return data.filter((row): row is HistoricalData => 
      'spend' in row && !('proyected_spend' in row)
    );
  }, [data.length, data.length > 0 ? JSON.stringify(Object.keys(data[0])) : '']);

  return useDateRange(historicalData);
}

export function useProjectionDateRange(data: CsvData[]): DateRange {
  const projectionData = useMemo(() => {
    if (!data.length) return [];
    
    const firstRow = data[0];
    const isAllProjection = 'proyected_spend' in firstRow;
    
    if (isAllProjection) { 
      return data;
    }
    
    return data.filter((row): row is ProjectionData => 
      'proyected_spend' in row
    );
  }, [data.length, data.length > 0 ? JSON.stringify(Object.keys(data[0])) : '']);

  return useDateRange(projectionData);
}
