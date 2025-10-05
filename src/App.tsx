import { useCallback, useEffect, useMemo, useState } from "react";
import { useCsvData } from "./hooks/useCsvData";
import { useProjectionDateRange } from "./hooks/useDateRange";

import type { HistoricalData } from "@/types/data";
import { AdvancedChartView } from "./components/AdvancedChartView";
import { DateFilter } from "./components/DateFilter";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AdvancedMuiTable } from "./components/AdvancedMuiTable";

function App() {
  const { data, loading } = useCsvData('/data/historico.csv');
  const { data: projectionData, loading: projectionLoading } = useCsvData('/data/proyecciones.csv');
  const [startDate, setstartDate] = useState<Date | undefined>(undefined);
  const [endDate, setendDate] = useState<Date | undefined>(undefined);

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

  if (loading || projectionLoading) return <p>Cargando...</p>
  if (!data.length) return <p>No hay datos...</p>

  return (
    <div className="h-screen h-full overflow-y-auto bg-zinc-800 text-white py-10">
      <div className="w-3/4 mx-auto">
        <h1>Datos históricos</h1>
        <AdvancedMuiTable data={tableData} title="Análisis de Datos Históricos MELI" />

        <div className="grid grid-cols-2 items-center gap-5">
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
