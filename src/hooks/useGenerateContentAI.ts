import { fetchGetIA } from "@/services/generateContentGemini";
import type { HistoricalData } from "@/types/data";
import { useState } from "react";

export function useGetIAContent() {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  const getAnalysis = async (data: HistoricalData[]) => {
    if (!data.length) return;

    setAiLoading(true);
    try {
      const textGenerate = await fetchGetIA(data);
      setAiAnalysis(textGenerate);

    } catch (error) {
      console.error('Error en análisis de IA:', error);
      setAiAnalysis('Error al generar análisis. Por favor, intenta nuevamente.');
    } finally {
      setAiLoading(false);
    }
  };

  return { aiAnalysis, aiLoading, getAnalysis };
}

