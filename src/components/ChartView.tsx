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
import { useCsvData } from '../hooks/useCsvData';
import { parse } from 'date-fns';
import { useEffect, useMemo } from 'react';

type ChartViewProps = {
  startDate?: Date;
  endDate?: Date;
}

export const ChartView = ({ startDate, endDate }: ChartViewProps) => {
  const { data, loading } = useCsvData('/data/proyecciones.csv');

  useEffect(() => {
    if (!loading && data.length > 0) {
      console.log('Columnas disponibles:', Object.keys(data[0]));
    }
  }, [loading, data]);

  const aggregatedData = useMemo(() => {
    const grouped: Record<string, any> = {};

    data.forEach((row) => {
      const d = parse(row.date, 'dd/MM/yyyy', new Date());

      if (isNaN(d.getTime())) {
        console.warn('Fecha invalida:', row.date)
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

      grouped[monthKey].proyected_spend += row.proyected_spend || 0;
      grouped[monthKey].max_spend += row.max_spend || 0;
      grouped[monthKey].min_spend += row.min_spend || 0;
    });

    let result = Object.values(grouped).sort((a, b) => a.date - b.date);

    if (startDate) {
      result = result.filter((item) => item.date >= startDate)
    }

    if (endDate) {
      result = result.filter((item) => item.date <= endDate)
    }
    return result;
  }, [data, startDate, endDate]);


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
          </LineChart>

          <Brush 
            dataKey={'date'}
            height={30}
            stroke='#8884d8'
            travellerWidth={10}
          />
        </ResponsiveContainer>
      </div>
    </div>
  );
};