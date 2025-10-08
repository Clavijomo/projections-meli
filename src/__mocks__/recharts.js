// Mock para recharts
const mockComponent = ({ children, ...props }) => {
  return children || null;
};

module.exports = {
  ResponsiveContainer: mockComponent,
  LineChart: mockComponent,
  Line: mockComponent,
  XAxis: mockComponent,
  YAxis: mockComponent,
  CartesianGrid: mockComponent,
  Tooltip: mockComponent,
  Legend: mockComponent,
  BarChart: mockComponent,
  Bar: mockComponent,
  AreaChart: mockComponent,
  Area: mockComponent,
  ScatterChart: mockComponent,
  Scatter: mockComponent,
  ComposedChart: mockComponent,
  ReferenceLine: mockComponent,
  ReferenceArea: mockComponent,
  Cell: mockComponent,
  PieChart: mockComponent,
  Pie: mockComponent,
};
