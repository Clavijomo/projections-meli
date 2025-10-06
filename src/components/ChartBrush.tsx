import { LineChart, XAxis, Line, Brush, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ChartData } from '@/types/data';

interface ChartBrushProps {
  aggregatedData: (ChartData & { 
    count: number; 
    avg_spend: number;
    variance: number;
  })[];
  showBrush: boolean;
  chartType: string;
}

export const ChartBrush = ({ aggregatedData, showBrush, chartType }: ChartBrushProps) => {
  if (!showBrush || chartType === 'pie') {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1200px] h-[80px] p-4 pt-0">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={aggregatedData}>
          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(date) => format(new Date(date), 'MMM yy', { locale: es })}
          />
          <Line 
            type="monotone" 
            dataKey="proyected_spend" 
            stroke="#82ca9d" 
            strokeWidth={1}
            dot={false}
          />
          <Brush 
            dataKey="date"
            height={30}
            stroke="#8884d8"
            travellerWidth={10}
          />
        </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
