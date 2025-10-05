import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
} from 'recharts';
import { parse } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import type { ProjectionData, ChartData, CsvData } from '@/types/data';

type ChartViewProps = {
  startDate?: Date;
  endDate?: Date;
  projectionData: CsvData[];
}

export const ChartView = ({ startDate, endDate, projectionData }: ChartViewProps) => {
  const [debouncedDates, setDebouncedDates] = useState({ startDate, endDate });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDates({ startDate, endDate });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [startDate, endDate]);

  useEffect(() => {
    if (projectionData.length > 0) {
      console.log('Columnas disponibles:', Object.keys(projectionData[0]));
    }
  }, [projectionData]);

  const limitedData = useMemo(() => {
    if (!projectionData || projectionData.length === 0) return [];
    
    const maxRecords = 500;
    if (projectionData.length <= maxRecords) {
      return projectionData;
    }
    
    const step = Math.ceil(projectionData.length / maxRecords);
    const sampled = [];
    for (let i = 0; i < projectionData.length; i += step) {
      sampled.push(projectionData[i]);
    }
    return sampled;
  }, [projectionData]);
  
  const aggregatedData = useMemo(() => {    
    if (!limitedData || limitedData.length === 0) {
      return [];
    }

    const grouped: Record<string, ChartData> = {};

    limitedData.forEach((row) => {  
      if (!('proyected_spend' in row)) return;
      
      const projectionRow = row as ProjectionData;
      
      let d: Date;
      try {
        d = parse(projectionRow.date, 'dd/MM/yyyy', new Date());
        if (isNaN(d.getTime())) {
          return;
        }
      } catch (error) {
        return;
      }

      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          date: new Date(d.getFullYear(), d.getMonth(), 1),
          proyected_spend: 0,
          max_spend: 0,
          min_spend: 0,
        };
      }

      grouped[monthKey].proyected_spend += projectionRow.proyected_spend || 0;
      grouped[monthKey].max_spend += projectionRow.max_spend || 0;
      grouped[monthKey].min_spend += projectionRow.min_spend || 0;
    });

    let result = Object.values(grouped).sort((a, b) => a.date.getTime() - b.date.getTime());

    if (debouncedDates.startDate) {
      result = result.filter((item) => item.date >= debouncedDates.startDate!);
    }

    if (debouncedDates.endDate) {
      result = result.filter((item) => item.date <= debouncedDates.endDate!);
    }

    console.log('ChartView aggregatedData result length:', result.length);
    return result;
  }, [limitedData, debouncedDates.startDate, debouncedDates.endDate]);

  return (
    <div className="w-full overflow-x-auto mt-10">
      <div className="min-w-[1200px] h-[420px] bg-gray-900 rounded-2xl shadow-md p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={aggregatedData}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />

            <XAxis
              dataKey="date"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString('es-CO', {
                  month: 'short',
                  year: 'numeric',
                })
              }
              stroke='#ededed'
              className='text-sm'
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString('es-CO', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              }
              formatter={(value: number) => 
                `${value.toLocaleString('es-CO')} USD`
              }
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #4b5563',
                color: '#fff'
              }}
            />

            <Legend 
              verticalAlign='top'
              align='center'
              wrapperStyle={{
                color: "#ddd",
                fontSize: '14px',
                paddingBottom: '10px'
              }}
            />
            <Line type="linear" dataKey="proyected_spend" stroke="#82ca9d" dot={{ r: 4 }} />
            <Line type="linear" dataKey="max_spend" stroke="#8884d8" dot={{ r: 4 }} />
            <Line type="linear" dataKey="min_spend" stroke="#ff7300" dot={{ r: 4 }} />
            
            <Brush 
              dataKey={'date'}
              height={30}
              stroke='#8884d8'
              travellerWidth={10}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};