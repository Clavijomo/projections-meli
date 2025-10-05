import { useEffect, useState } from "react";
import Papa from 'papaparse'
import type { CsvData } from "@/types/data";

export function useCsvData (filepath: string) {
  const [data, setData] = useState<CsvData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
    Papa.parse(filepath, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        const cleanData = result.data.filter(
          (row: any) => Object.values(row).some((value) => value !== null && value !== "")
        );
        setData(cleanData as CsvData[]);
        setLoading(false);
      },
    });
  }, [filepath]);

  return { data, loading }
}