import { useMemo, useState } from "react";
import { useCsvData } from "./hooks/useCsvData"
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table'

import type { ColumnDef } from "@tanstack/react-table";
import { ChartView } from "./components/ChartView";
import { DateFilter } from "./components/DateFilter";

function App() {
  const { data, loading } = useCsvData('/data/historico.csv');
  const [startDate, setstartDate] = useState<Date | undefined>(undefined);
  const [endDate, setendDate] = useState<Date | undefined>(undefined);

  const columns = useMemo<ColumnDef<any>[]>(
    () =>
      data.length
        ? Object.keys(data[0]).map((key) => ({
          accessorKey: key,
          header: key.toUpperCase()
        }))
        : [],
    [data]
  );

  const table = useReactTable({
    data: data.slice(0, 20),
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  if (loading) return <p>Cargando...</p>
  if (!data.length) return <p>No hay datos...</p>

  return (
    <div className="h-screen bg-zinc-800 text-white">
      <div className="w-3/4 mx-auto">
        <h1>Datos históricos</h1>
        <table className="border w-full">
          <thead className="border border-zinc-400 font-semibold text-left">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 border border-zinc-500 lowercase font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())
                    }
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (              
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="border border-zinc-500 p-2 text-sm" key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell ?? cell.getValue,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <DateFilter 
          date={startDate}
          setDate={setstartDate}
          label="Fecha inicial"
        />

        <DateFilter 
          date={endDate}
          setDate={setendDate}
          label="Fecha final"
        />
        <ChartView startDate={startDate} endDate={endDate} />
      </div>
    </div>
  )
}

export default App
