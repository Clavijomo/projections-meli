export interface HistoricalData {
  vertical: string;
  area: string;
  initiative: string;
  service: string;
  date: string;
  spend: number;
}

export interface ProjectionData {
  vertical: string;
  area: string;
  initiative: string;
  service: string;
  date: string;
  proyected_spend: number;
  max_spend: number;
  min_spend: number;
}

export interface ChartData {
  date: Date;
  proyected_spend: number;
  max_spend: number;
  min_spend: number;
}

export type CsvData = HistoricalData | ProjectionData;

export type ChartType = 'line' | 'area' | 'bar' | 'composed' | 'pie';

