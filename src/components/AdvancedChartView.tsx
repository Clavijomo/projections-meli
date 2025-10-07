import type { ChartData, ChartType, CsvData, ProjectionData } from '@/types/data';
import { parse } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChartControls } from './ChartControls';
import { ChartRenderer } from './ChartRenderer';

type AdvancedChartViewProps = {
  startDate?: Date;
  endDate?: Date;
  projectionData: CsvData[];
}

export const AdvancedChartView = ({ startDate, endDate, projectionData }: AdvancedChartViewProps) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedLines, setSelectedLines] = useState({
    proyected_spend: true,
    max_spend: true,
    min_spend: true,
  });
  const [zoomDomain, setZoomDomain] = useState<{ left?: number, right?: number }>({});
  const [highlightedArea, setHighlightedArea] = useState<{ x1?: number, x2?: number } | null>(null);
  const [showAnimations, setShowAnimations] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const [debouncedDates, setDebouncedDates] = useState({ startDate, endDate });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDates({ startDate, endDate });
    }, 300);

    return () => clearTimeout(timer);
  }, [startDate, endDate]);

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

    if (debouncedDates.startDate) {
      result = result.filter((item) => item.date >= debouncedDates.startDate!);
    }

    if (debouncedDates.endDate) {
      result = result.filter((item) => item.date <= debouncedDates.endDate!);
    }

    return result;
  }, [limitedData, debouncedDates.startDate, debouncedDates.endDate]);

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

  const handleLineToggle = useCallback((line: keyof typeof selectedLines) => {
    setSelectedLines(prev => ({ ...prev, [line]: !prev[line] }));
  }, []);

  const handleMouseDown = useCallback((e: any) => {
    if (e && e.activeLabel) {
      setHighlightedArea({ x1: e.activeLabel });
    }
  }, []);

  const handleMouseMove = useCallback((e: any) => {
    if (highlightedArea?.x1 && e && e.activeLabel) {
      setHighlightedArea(prev => ({ ...prev, x2: e.activeLabel }));
    }
  }, [highlightedArea]);

  const handleMouseUp = useCallback(() => {
    if (highlightedArea?.x1 && highlightedArea?.x2) {
      const left = Math.min(highlightedArea.x1, highlightedArea.x2);
      const right = Math.max(highlightedArea.x1, highlightedArea.x2);
      setZoomDomain({ left, right });
    }
    setHighlightedArea(null);
  }, [highlightedArea]);

  const handleAnimationToggle = useCallback(() => setShowAnimations(!showAnimations), [showAnimations]);
  const handleGridToggle = useCallback(() => setShowGrid(!showGrid), [showGrid]);

  if (!projectionData || projectionData.length === 0) {
    return (
      <div className="w-full mt-10 text-center py-20">
        <p className="text-gray-400">Cargando datos de proyección...</p>
      </div>
    );
  }

  if (aggregatedData.length === 0) {
    return (
      <div className="w-full mt-10 text-center py-20">
        <p className="text-gray-400">No hay datos para mostrar en el rango seleccionado.</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-10">
      <ChartControls
        chartType={chartType}
        selectedLines={selectedLines}
        showAnimations={showAnimations}
        showGrid={showGrid}
        stats={stats}
        aggregatedData={aggregatedData}
        onChartTypeChange={setChartType}
        onLineToggle={handleLineToggle}
        onAnimationToggle={handleAnimationToggle}
        onGridToggle={handleGridToggle}
      />

      <div className="bg-gray-900 rounded-b-2xl shadow-lg">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1200px] h-[400px] p-4">
            <ChartRenderer
              chartType={chartType}
              aggregatedData={aggregatedData}
              selectedLines={selectedLines}
              showGrid={showGrid}
              showAnimations={showAnimations}
              zoomDomain={zoomDomain}
              highlightedArea={highlightedArea}
              stats={stats}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
};