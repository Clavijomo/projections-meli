import { useCallback, useEffect, useMemo, useState } from "react";
import { useCsvData } from "./hooks/useCsvData";
import { useProjectionDateRange } from "./hooks/useDateRange";

import type { HistoricalData } from "@/types/data";
import { AdvancedChartView } from "./components/AdvancedChartView";
import { DateFilter } from "./components/DateFilter";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AdvancedMuiTable } from "./components/AdvancedMuiTable";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyADA-4u6bvCJkf5kfqbnE0F7ofpzPcamU0" });

function App() {
  const { data, loading } = useCsvData('/data/historico.csv');
  const { data: projectionData, loading: projectionLoading } = useCsvData('/data/proyecciones.csv');
  const [startDate, setstartDate] = useState<Date | undefined>(undefined);
  const [endDate, setendDate] = useState<Date | undefined>(undefined);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleStartDateChange = useCallback((date: Date | undefined) => {
    setstartDate(date);
  }, []);

  const handleEndDateChange = useCallback((date: Date | undefined) => {
    setendDate(date);
  }, []);

  const projectionDateRange = useProjectionDateRange(projectionData);

  useEffect(() => {
    console.log('Date filter changed:', { startDate, endDate })
  }, [startDate, endDate])

  const tableData = useMemo(() =>
    data.slice(0, 10) as HistoricalData[],
    [data]
  );

  async function getIA() {
    if (!data.length) return;

    setAiLoading(true);
    try {
      // Calcular estadísticas básicas
      const totalGasto = data.reduce((sum, item) => sum + (item as HistoricalData).spend, 0);
      const promedioGasto = totalGasto / data.length;
      const totalRegistros = data.length;

      // Obtener verticales únicas
      const verticales = [...new Set(data.map(item => item.vertical))];

      // Prompt simple y contextual
      const prompt = `Analiza estos datos de gastos de infraestructura de Mercado Libre:

      DATOS:
      - Total de registros: ${totalRegistros}
      - Gasto total: $${totalGasto.toLocaleString('es-CO')}
      - Gasto promedio: $${promedioGasto.toLocaleString('es-CO')}
      - Verticales: ${verticales.join(', ')}

      Proporciona un resumen ejecutivo breve (máximo 3 párrafos) con:
      1. Análisis de los gastos
      2. Principales insights
      3. Una recomendación clave`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
      });

      const texto = response.text || '';
      setAiAnalysis(texto);

    } catch (error) {
      console.error('Error en análisis de IA:', error);
      setAiAnalysis('Error al generar análisis. Por favor, intenta nuevamente.');
    } finally {
      setAiLoading(false);
    }
  }

  if (loading || projectionLoading) return <p>Cargando...</p>
  if (!data.length) return <p>No hay datos históricos...</p>
  if (!projectionData.length) return <p>No hay datos de proyección...</p>

  return (
    <div className="h-screen h-full overflow-y-auto bg-zinc-800 text-white py-10">
      <div className="w-3/4 mx-auto">
        <h1>Datos históricos</h1>
        <AdvancedMuiTable data={tableData} title="Análisis de Datos Históricos MELI" />

        <div className="mt-6 bg-gray-900 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🤖</span>
              <h3 className="text-xl font-bold text-white">Análisis Inteligente con IA</h3>
            </div>
            <button
              onClick={getIA}
              disabled={aiLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${aiLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : aiAnalysis
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
            >
              {aiLoading ? '⏳ Analizando...' : aiAnalysis ? '🔄 Regenerar' : '✨ Generar Análisis'}
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
            <div className="text-center py-6 text-gray-400">
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