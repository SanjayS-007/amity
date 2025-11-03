import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { crop: "Rice", healthy: 85, warning: 12, critical: 3 },
  { crop: "Wheat", healthy: 78, warning: 18, critical: 4 },
  { crop: "Cotton", healthy: 92, warning: 6, critical: 2 },
  { crop: "Sugarcane", healthy: 88, warning: 9, critical: 3 },
  { crop: "Pulses", healthy: 81, warning: 15, critical: 4 },
];

export function CropHealthChart() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Crop Health Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="crop" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="healthy" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="warning" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="critical" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
