import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ChartData } from '@/types/data';

type ChartType = 'line' | 'area' | 'bar' | 'composed' | 'pie';

interface ChartRendererProps {
  chartType: ChartType;
  aggregatedData: (ChartData & { 
    count: number; 
    avg_spend: number;
    variance: number;
  })[];
  selectedLines: {
    proyected_spend: boolean;
    max_spend: boolean;
    min_spend: boolean;
  };
  showGrid: boolean;
  showAnimations: boolean;
  zoomDomain: {left?: number, right?: number};
  highlightedArea: {x1?: number, x2?: number} | null;
  stats: {
    total: number;
    average: number;
    max: number;
    min: number;
    dataPoints: number;
  } | null;
  onMouseDown: (e: any) => void;
  onMouseMove: (e: any) => void;
  onMouseUp: () => void;
}

const COLORS = ['#82ca9d', '#8884d8', '#ff7300', '#00ff88', '#ff0088', '#8800ff'];

export const ChartRenderer = ({
  chartType,
  aggregatedData,
  selectedLines,
  showGrid,
  showAnimations,
  zoomDomain,
  highlightedArea,
  stats,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: ChartRendererProps) => {

  // Clean data to ensure no NaN values reach the charts
  const cleanedData = aggregatedData.map(item => ({
    ...item,
    date: item.date.getTime(), // Convert to timestamp for charts
    proyected_spend: Number(item.proyected_spend) || 0,
    max_spend: Number(item.max_spend) || 0,
    min_spend: Number(item.min_spend) || 0,
    avg_spend: Number(item.avg_spend) || 0,
    variance: Number(item.variance) || 0,
    count: Number(item.count) || 0,
  })).filter(item => 
    !isNaN(item.date) && 
    !isNaN(item.proyected_spend) && 
    !isNaN(item.max_spend) && 
    !isNaN(item.min_spend)
  );
  
  const commonProps = {
    data: cleanedData,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };

  const commonXAxisProps = {
    dataKey: "date",
    type: "number" as const,
    scale: "time" as const,
    domain: zoomDomain.left && zoomDomain.right ? [zoomDomain.left, zoomDomain.right] : ['dataMin', 'dataMax'] as const,
    tickFormatter: (timestamp: number) => {
      if (isNaN(timestamp)) return '';
      return format(new Date(timestamp), 'MMM yyyy', { locale: es });
    },
    stroke: '#9ca3af',
  };

  const commonYAxisProps = {
    stroke: '#9ca3af',
  };

  const commonTooltipProps = {
    labelFormatter: (timestamp: number) => {
      if (isNaN(timestamp)) return 'Fecha inválida';
      return format(new Date(timestamp), 'MMMM yyyy', { locale: es });
    },
    formatter: (value: number, name: string) => {
      if (isNaN(value)) return ['0 USD', name];
      return [
        `${value.toLocaleString('es-CO')} USD`,
        name === 'proyected_spend' ? 'Proyectado' : 
        name === 'max_spend' ? 'Máximo' : 
        name === 'min_spend' ? 'Mínimo' : 'Varianza'
      ];
    },
    contentStyle: {
      backgroundColor: '#1f2937',
      border: '1px solid #4b5563',
      borderRadius: '8px',
      color: '#fff'
    },
  };

  switch (chartType) {
    case 'area':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart {...commonProps}>
          {showGrid && <CartesianGrid stroke="#374151" strokeDasharray="3 3" />}
          <XAxis {...commonXAxisProps} />
          <YAxis {...commonYAxisProps} />
          <Tooltip {...commonTooltipProps} />
          <Legend />
          {selectedLines.proyected_spend && (
            <Area 
              type="monotone" 
              dataKey="proyected_spend" 
              stackId="1"
              stroke="#82ca9d" 
              fill="#82ca9d" 
              fillOpacity={0.6}
              animationDuration={showAnimations ? 1000 : 0}
            />
          )}
          {selectedLines.max_spend && (
            <Area 
              type="monotone" 
              dataKey="max_spend" 
              stackId="2"
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6}
              animationDuration={showAnimations ? 1000 : 0}
            />
          )}
          {selectedLines.min_spend && (
            <Area 
              type="monotone" 
              dataKey="min_spend" 
              stackId="3"
              stroke="#ff7300" 
              fill="#ff7300" 
              fillOpacity={0.6}
              animationDuration={showAnimations ? 1000 : 0}
            />
          )}
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart {...commonProps}>
          {showGrid && <CartesianGrid stroke="#374151" strokeDasharray="3 3" />}
          <XAxis {...commonXAxisProps} />
          <YAxis {...commonYAxisProps} />
          <Tooltip {...commonTooltipProps} />
          <Legend />
          {selectedLines.proyected_spend && (
            <Bar dataKey="proyected_spend" fill="#82ca9d" animationDuration={showAnimations ? 1000 : 0} />
          )}
          {selectedLines.max_spend && (
            <Bar dataKey="max_spend" fill="#8884d8" animationDuration={showAnimations ? 1000 : 0} />
          )}
          {selectedLines.min_spend && (
            <Bar dataKey="min_spend" fill="#ff7300" animationDuration={showAnimations ? 1000 : 0} />
          )}
          </BarChart>
        </ResponsiveContainer>
      );

    case 'composed':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart {...commonProps}>
          {showGrid && <CartesianGrid stroke="#374151" strokeDasharray="3 3" />}
          <XAxis {...commonXAxisProps} />
          <YAxis {...commonYAxisProps} />
          <Tooltip {...commonTooltipProps} />
          <Legend />
          {selectedLines.proyected_spend && (
            <Line 
              type="monotone" 
              dataKey="proyected_spend" 
              stroke="#82ca9d" 
              strokeWidth={3}
              dot={{ r: 6 }}
              animationDuration={showAnimations ? 1000 : 0}
            />
          )}
          {selectedLines.max_spend && (
            <Bar dataKey="max_spend" fill="#8884d8" opacity={0.7} animationDuration={showAnimations ? 1000 : 0} />
          )}
          {selectedLines.min_spend && (
            <Area 
              type="monotone" 
              dataKey="variance" 
              fill="#ff7300" 
              fillOpacity={0.3}
              animationDuration={showAnimations ? 1000 : 0}
            />
          )}
          {stats && (
            <ReferenceLine 
              y={stats.average} 
              stroke="#fbbf24" 
              strokeDasharray="5 5" 
              label="Promedio"
            />
          )}
          </ComposedChart>
        </ResponsiveContainer>
      );

    case 'pie':
      const pieData = [
        { name: 'Proyectado', value: stats?.total || 0, fill: '#82ca9d' },
        { name: 'Varianza Total', value: aggregatedData.reduce((sum, item) => sum + item.variance, 0), fill: '#8884d8' },
      ];
      
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            animationDuration={showAnimations ? 1000 : 0}
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value.toLocaleString('es-CO')} USD`} />
          </PieChart>
        </ResponsiveContainer>
      );

    default: // line
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...commonProps}>
          {showGrid && <CartesianGrid stroke="#374151" strokeDasharray="3 3" />}
          <XAxis {...commonXAxisProps} />
          <YAxis {...commonYAxisProps} />
          <Tooltip {...commonTooltipProps} />
          <Legend />
          {selectedLines.proyected_spend && (
            <Line 
              type="monotone" 
              dataKey="proyected_spend" 
              stroke="#82ca9d" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={showAnimations ? 1000 : 0}
            />
          )}
          {selectedLines.max_spend && (
            <Line 
              type="monotone" 
              dataKey="max_spend" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={showAnimations ? 1000 : 0}
            />
          )}
          {selectedLines.min_spend && (
            <Line 
              type="monotone" 
              dataKey="min_spend" 
              stroke="#ff7300" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={showAnimations ? 1000 : 0}
            />
          )}
          {stats && (
            <ReferenceLine 
              y={stats.average} 
              stroke="#fbbf24" 
              strokeDasharray="5 5" 
              label="Promedio"
            />
          )}
          {highlightedArea?.x1 && highlightedArea?.x2 && (
            <ReferenceArea
              x1={highlightedArea.x1}
              x2={highlightedArea.x2}
              strokeOpacity={0.3}
              fillOpacity={0.1}
              fill="#8884d8"
            />
          )}
          </LineChart>
        </ResponsiveContainer>
      );
  }
};
