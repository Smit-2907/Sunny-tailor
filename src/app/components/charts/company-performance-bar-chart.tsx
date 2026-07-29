import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CompanyPerformanceData {
  id: string;
  company: string;
  orders: number;
  completed: number;
  pending: number;
}

interface CompanyPerformanceBarChartProps {
  data: CompanyPerformanceData[];
}

// Generate a unique ID once at module load time
const CHART_ID = `company-performance-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export function CompanyPerformanceBarChart({ data }: CompanyPerformanceBarChartProps) {
  return (
    <div suppressHydrationWarning>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="company" 
            stroke="#6B7280"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={80}
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
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
          />
          <Bar 
            dataKey="completed" 
            fill="#10B981" 
            name="Completed" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="pending" 
            fill="#EAB308" 
            name="Pending" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}