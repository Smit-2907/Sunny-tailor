import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProductionTrendData {
  id: string;
  month: string;
  orders: number;
  completed: number;
  delayed: number;
}

interface ProductionTrendAreaChartProps {
  data: ProductionTrendData[];
}

// Generate a unique ID once at module load time
const CHART_ID = `production-trend-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export function ProductionTrendAreaChart({ data }: ProductionTrendAreaChartProps) {
  return (
    <div suppressHydrationWarning>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradientOrders-${CHART_ID}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id={`gradientCompleted-${CHART_ID}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id={`gradientDelayed-${CHART_ID}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="orders" 
            stroke="#4F46E5" 
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#gradientOrders-${CHART_ID})`}
            name="Orders"
          />
          <Area 
            type="monotone" 
            dataKey="completed" 
            stroke="#10B981" 
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#gradientCompleted-${CHART_ID})`}
            name="Completed"
          />
          <Area 
            type="monotone" 
            dataKey="delayed" 
            stroke="#EF4444" 
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#gradientDelayed-${CHART_ID})`}
            name="Delayed"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}