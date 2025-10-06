import { useMemo } from 'react';
import { parse } from 'date-fns';
import type { CsvData, HistoricalData, ProjectionData } from '@/types/data';

interface DateRange {
  minDate: Date | null;
  maxDate: Date | null;
}

export function useDateRange(data: CsvData[]): DateRange {
  return useMemo(() => {
    console.log('useDateRange recalculating with data length:', data?.length);
    
    if (!data || data.length === 0) {
      return { minDate: null, maxDate: null };
    }

    // OPTIMIZACIÓN: Limitar procesamiento para datasets grandes
    const maxSampleSize = 200;
    const sampleData = data.length > maxSampleSize 
      ? data.filter((_, index) => index % Math.ceil(data.length / maxSampleSize) === 0)
      : data;

    let minDate: Date | null = null;
    let maxDate: Date | null = null;
    
    // Cache para fechas parseadas
    const dateCache = new Map<string, Date | null>();

    // Optimización: encontrar min/max en una sola pasada con cache
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

    console.log('useDateRange result:', { 
      minDate, 
      maxDate, 
      sampleSize: sampleData.length,
      cacheSize: dateCache.size 
    });
    return { minDate, maxDate };
  }, [data.length, data.slice(0, 5).map(row => row.date).join(',')]);  // Optimizar dependencias
}

// Hook específico para datos históricos
export function useHistoricalDateRange(data: CsvData[]): DateRange {
  const historicalData = useMemo(() => {
    // OPTIMIZACIÓN: Filtrar solo si hay datos mixtos
    if (!data.length) return [];
    
    const firstRow = data[0];
    const isAllHistorical = 'spend' in firstRow && !('proyected_spend' in firstRow);
    
    if (isAllHistorical) {
      // Si todos son históricos, no filtrar
      return data;
    }
    
    return data.filter((row): row is HistoricalData => 
      'spend' in row && !('proyected_spend' in row)
    );
  }, [data.length, data.length > 0 ? JSON.stringify(Object.keys(data[0])) : '']);

  return useDateRange(historicalData);
}

// Hook específico para datos de proyecciones
export function useProjectionDateRange(data: CsvData[]): DateRange {
  const projectionData = useMemo(() => {
    // OPTIMIZACIÓN: Filtrar solo si hay datos mixtos
    if (!data.length) return [];
    
    const firstRow = data[0];
    const isAllProjection = 'proyected_spend' in firstRow;
    
    if (isAllProjection) {
      // Si todos son proyecciones, no filtrar
      return data;
    }
    
    return data.filter((row): row is ProjectionData => 
      'proyected_spend' in row
    );
  }, [data.length, data.length > 0 ? JSON.stringify(Object.keys(data[0])) : '']);

  return useDateRange(projectionData);
}
