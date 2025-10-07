import type { HistoricalData } from "@/types/data";
import { GoogleGenAI } from "@google/genai";

const AI = new GoogleGenAI({ apiKey: "AIzaSyADA-4u6bvCJkf5kfqbnE0F7ofpzPcamU0" });

export async function fetchGetIA(data: HistoricalData[]) {
  if (!data.length) return '';

  const totalGasto = data.reduce((sum, item) => sum + (item as HistoricalData).spend, 0);
  const promedioGasto = totalGasto / data.length;
  const totalRegistros = data.length;

  const verticales = [...new Set(data.map(item => item.vertical))];

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

  const response = await AI.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: prompt,
  });

  return response.text || '';
}