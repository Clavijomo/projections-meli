import { useCallback, useMemo, useState } from "react";
import { useCsvData } from "./hooks/useCsvData";
import { useProjectionDateRange } from "./hooks/useDateRange";

import type { HistoricalData } from "@/types/data";
import { AdvancedChartView } from "./components/AdvancedChartView";
import { AdvancedMuiTable } from "./components/AdvancedMuiTable";
import { DateFilter } from "./components/DateFilter";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useGetIAContent } from "./hooks/useGenerateContentAI";

function App() {
  const { data, loading } = useCsvData('/data/historico.csv');
  const { data: projectionData, loading: projectionLoading } = useCsvData('/data/proyecciones.csv');
  const [startDate, setstartDate] = useState<Date | undefined>(undefined);
  const [endDate, setendDate] = useState<Date | undefined>(undefined);

  const { aiAnalysis, aiLoading, getAnalysis } = useGetIAContent();

  const handleStartDateChange = useCallback((date: Date | undefined) => {
    setstartDate(date);
  }, []);

  const handleEndDateChange = useCallback((date: Date | undefined) => {
    setendDate(date);
  }, []);

  const projectionDateRange = useProjectionDateRange(projectionData);

  if (loading || projectionLoading) return <p>Cargando...</p>
  if (!data.length) return <p>No hay datos históricos...</p>
  if (!projectionData.length) return <p>No hay datos de proyección...</p>

  return (
    <div className="h-screen overflow-y-auto bg-zinc-800 text-white py-10">
      <div className="w-3/4 mx-auto">
        <AdvancedMuiTable data={data as HistoricalData[]} title="Análisis de Datos Históricos MELI" />

        <div className="mt-6 bg-gray-600 text-black rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-transparent bg-clip-text text-xl bg-gradient-to-r from-white to-purple-300 p-2">
              Análisis Inteligente con IA
            </h3>
            <button
              onClick={() => getAnalysis(data as HistoricalData[])}
              disabled={aiLoading}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${aiLoading
                ? 'border-gray-600 cursor-not-allowed'
                : aiAnalysis
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'border-zinc-500 border hover:bg-zinc-500 border-none'
                } text-zinc-100`}
            >
              {aiLoading ? 'Analizando...' : aiAnalysis ? 'Regenerar' : 'Generar análisis'}
            </button>
          </div>

          {aiLoading && (
            <div className="flex items-center space-x-3 py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-300">Procesando datos con IA generativa...</span>
            </div>
          )}

          {aiAnalysis && !aiLoading && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                {aiAnalysis}
              </div>
            </div>
          )}

          {!aiAnalysis && !aiLoading && (
            <div className="text-center py-6 text-gray-200">
              <p className="mb-2">Haz clic en "Generar Análisis" para obtener insights con IA</p>
              <p className="text-xs">Powered by Google Gemini 2.0</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 items-center gap-5 mt-6">
          <ErrorBoundary>
            <DateFilter
              date={startDate}
              setDate={handleStartDateChange}
              label="Fecha inicial"
              minDate={projectionDateRange.minDate}
              maxDate={projectionDateRange.maxDate}
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <DateFilter
              date={endDate}
              setDate={handleEndDateChange}
              label="Fecha final"
              minDate={projectionDateRange.minDate}
              maxDate={projectionDateRange.maxDate}
            />
          </ErrorBoundary>
        </div>

        <ErrorBoundary>
          <AdvancedChartView
            startDate={startDate}
            endDate={endDate}
            projectionData={projectionData}
          />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App