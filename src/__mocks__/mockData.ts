import type { HistoricalData, ProjectionData } from '@/types/data';

export const mockHistoricalData: HistoricalData[] = [
  {
    vertical: 'Retail',
    area: 'Platform',
    initiative: 'Pocket Growth',
    service: 'Kubernetes (GKE)',
    date: '01/07/2024',
    spend: 1938.69,
  },
  {
    vertical: 'Fintech',
    area: 'Lending',
    initiative: 'Logistics Optimization',
    service: 'AWS S3',
    date: '02/07/2024',
    spend: 281.31,
  },
  {
    vertical: 'Retail',
    area: 'Delivery',
    initiative: 'Checkout Revamp',
    service: 'AWS Redshift',
    date: '03/07/2024',
    spend: 1470.72,
  },
];

export const mockProjectionData: ProjectionData[] = [
  {
    vertical: 'Retail',
    area: 'Platform',
    initiative: 'Pocket Growth',
    service: 'Kubernetes (GKE)',
    date: '01/01/2025',
    proyected_spend: 1989.52,
    max_spend: 2201.8,
    min_spend: 1582.26,
  },
  {
    vertical: 'Fintech',
    area: 'Lending',
    initiative: 'Logistics Optimization',
    service: 'AWS S3',
    date: '02/01/2025',
    proyected_spend: 291.24,
    max_spend: 322.26,
    min_spend: 237.76,
  },
];

export const mockCsvResponse = `vertical,area,initiative,service,date,spend
Retail,Platform,Pocket Growth,Kubernetes (GKE),01/07/2024,1938.69
Fintech,Lending,Logistics Optimization,AWS S3,02/07/2024,281.31`;

export const mockProjectionCsvResponse = `vertical,area,initiative,service,date,proyected_spend,max_spend,min_spend
Retail,Platform,Pocket Growth,Kubernetes (GKE),01/01/2025,1989.52,2201.8,1582.26
Fintech,Lending,Logistics Optimization,AWS S3,02/01/2025,291.24,322.26,237.76`;

export const mockAIResponse = `
## Análisis de Gastos de Infraestructura MELI

**Resumen Ejecutivo:**
Los datos muestran un gasto total de $3,690.72 distribuido en 3 registros, con un promedio de $1,230.24 por transacción.

**Principales Insights:**
- El vertical Retail representa el 92% del gasto total
- Kubernetes (GKE) es el servicio con mayor inversión
- Tendencia creciente en gastos de plataforma

**Recomendación Clave:**
Optimizar costos en servicios de Kubernetes mediante análisis de utilización y rightsizing de recursos.
`;
