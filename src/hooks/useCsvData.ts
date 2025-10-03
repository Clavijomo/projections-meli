import { useEffect, useState } from "react";
import Papa from 'papaparse'

export function useCsvData (filepath: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Papa.parse(filepath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        setData(result.data)
        setLoading(false)
      }
    })
  }, [filepath]);

  return { data, loading }
}