import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface OrderStatusData {
  id: string;
  name: string;
  value: number;
  color: string;
}

interface OrderStatusPieChartProps {
  data: OrderStatusData[];
}

// Generate a unique ID once at module load time
const CHART_ID = `order-status-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export function OrderStatusPieChart({ data }: OrderStatusPieChartProps) {
  return (
    <div suppressHydrationWarning>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) => 
              `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${CHART_ID}-${entry.id}-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}