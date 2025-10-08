import type { CsvData } from '@/types/data';
import { ChartControls } from '../ChartControls';
import { ChartRenderer } from '../ChartRenderer';

import { useDebouncedDates } from './hooks/useDebouncedDates';
import { useChartData } from './hooks/useChartData';
import { useChartStats } from './hooks/useChartStats';
import { useChartControls } from './hooks/useChartControls';
import { useChartInteractions } from './hooks/useChartInteractions';

type AdvancedChartViewProps = {
  startDate?: Date;
  endDate?: Date;
  projectionData: CsvData[];
}

export const AdvancedChartView = ({ startDate, endDate, projectionData }: AdvancedChartViewProps) => {
  const debouncedDates = useDebouncedDates(startDate, endDate);
  const { aggregatedData } = useChartData(projectionData, debouncedDates.startDate, debouncedDates.endDate);
  const { stats } = useChartStats(aggregatedData);
  const {
    chartType,
    setChartType,
    selectedLines,
    showAnimations,
    showGrid,
    handleLineToggle,
    handleAnimationToggle,
    handleGridToggle
  } = useChartControls();
  const {
    zoomDomain,
    highlightedArea,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useChartInteractions();

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
