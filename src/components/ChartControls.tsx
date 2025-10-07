import type { ChartType } from "@/types/data";

interface ChartControlsProps {
  chartType: ChartType;
  selectedLines: {
    proyected_spend: boolean;
    max_spend: boolean;
    min_spend: boolean;
  };
  showAnimations: boolean;
  showGrid: boolean;
  stats: {
    total: number;
    average: number;
    max: number;
    min: number;
    dataPoints: number;
  } | null;
  aggregatedData: any[];
  onChartTypeChange: (type: ChartType) => void;
  onLineToggle: (line: 'proyected_spend' | 'max_spend' | 'min_spend') => void;
  onAnimationToggle: () => void;
  onGridToggle: () => void;
}

export const ChartControls = ({
  chartType,
  selectedLines,
  showAnimations,
  showGrid,
  stats,
  onChartTypeChange,
  onLineToggle,
  onAnimationToggle,
  onGridToggle,
}: ChartControlsProps) => {

  return (
    <div className="bg-gray-700 rounded-t-2xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">Tipo:</span>
          {(['line', 'area', 'bar', 'composed', 'pie'] as ChartType[]).map((type) => (
            <button
              key={type}
              onClick={() => onChartTypeChange(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                chartType === type
                  ? 'text-white bg-zinc-500'
                  : 'border border-gray-500 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type === 'line' ? 'Línea' : 
               type === 'area' ? 'Área' :
               type === 'bar' ? 'Barras' :
               type === 'composed' ? 'Mixto' : 'Circular'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">Mostrar:</span>
          {Object.entries(selectedLines).map(([key, value]) => (
            <button
              key={key}
              onClick={() => onLineToggle(key as 'proyected_spend' | 'max_spend' | 'min_spend')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {key === 'proyected_spend' ? 'Proyectado' :
               key === 'max_spend' ? 'Máximo' : 'Mínimo'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAnimationToggle}
            className={`px-2 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              showAnimations ? 'bg-purple-200 text-purple-800' : 'text-purple-300'
            }`}
          >
            Animación
          </button>
          <button
            onClick={onGridToggle}
            className={`px-2 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              showGrid ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-700 text-indigo-300'
            }`}
          >
            Cuadrícula
          </button>
        </div>        
      </div>

      {stats && (
        <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div className="bg-gray-700 rounded p-2 text-center">
            <div className="text-green-600 text-2xl">${stats.total.toLocaleString('es-CO')}</div>
            <div className="text-gray-300">Total</div>
          </div>
          <div className="bg-gray-700 rounded p-2 text-center">
            <div className="text-blue-300 text-2xl">${stats.average.toLocaleString('es-CO')}</div>
            <div className="text-gray-300">Promedio</div>
          </div>
          <div className="bg-gray-700 rounded p-2 text-center">
            <div className="text-purple-400 text-2xl">${stats.max.toLocaleString('es-CO')}</div>
            <div className="text-gray-300">Máximo</div>
          </div>
          <div className="bg-gray-700 rounded p-2 text-center">
            <div className="text-orange-300 text-2xl">${stats.min.toLocaleString('es-CO')}</div>
            <div className="text-gray-300">Mínimo</div>
          </div>
          <div className="bg-gray-700 rounded p-2 text-center">
            <div className="text-yellow-300 text-2xl">{stats.dataPoints}</div>
            <div className="text-gray-300">Puntos</div>
          </div>
        </div>
      )}
    </div>
  );
};
