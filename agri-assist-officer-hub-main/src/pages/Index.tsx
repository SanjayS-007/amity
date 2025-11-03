import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import {
  Users,
  Sprout,
  AlertTriangle,
  CheckCircle,
  Cloud,
  CloudRain,
  Sun,
  Wind,
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening in your zone today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total Farmers"
            value="1,248"
            change="+12% this month"
            changeType="positive"
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Active Crops"
            value="5,842"
            change="acres under cultivation"
            changeType="neutral"
            icon={Sprout}
            variant="secondary"
          />
          <StatsCard
            title="Pending Actions"
            value="23"
            change="8 urgent"
            changeType="negative"
            icon={AlertTriangle}
            variant="accent"
          />
          <StatsCard
            title="Resolved Today"
            value="47"
            change="+18% vs yesterday"
            changeType="positive"
            icon={CheckCircle}
            variant="default"
          />
        </div>

        {/* Charts and Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <CropHealthChart />
          </div>
          <WeatherWidget />
        </div>

        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { action: "New consultation request", farmer: "Rajesh Kumar", time: "5 minutes ago", type: "info" },
              { action: "Alert broadcasted", details: "Heavy rainfall warning", time: "1 hour ago", type: "warning" },
              { action: "Field visit completed", farmer: "Sunita Devi", time: "2 hours ago", type: "success" },
              { action: "Disease outbreak reported", details: "Brown spot in rice", time: "3 hours ago", type: "critical" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'info' ? 'bg-info' :
                  activity.type === 'warning' ? 'bg-warning' :
                  activity.type === 'success' ? 'bg-success' :
                  'bg-destructive'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.farmer || activity.details}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}


  interface StatsCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: LucideIcon;
    variant?: "primary" | "secondary" | "accent" | "default";
  }

  const StatsCard = ({
    title,
    value,
    change,
    changeType = "neutral",
    icon: Icon,
    variant = "default",
  }: StatsCardProps) => {
    const variantStyles = {
      primary: "border-primary/20 bg-primary/5",
      secondary: "border-secondary/20 bg-secondary/5",
      accent: "border-accent/20 bg-accent/5",
      default: "border-border bg-card",
    } as const;

    const iconStyles = {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      accent: "bg-accent text-accent-foreground",
      default: "bg-muted text-foreground",
    } as const;

    return (
      <Card className={cn("p-6 transition-smooth hover:shadow-md", variantStyles[variant])}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <p
                className={cn(
                  "text-sm font-medium",
                  changeType === "positive" && "text-success",
                  changeType === "negative" && "text-destructive",
                  changeType === "neutral" && "text-muted-foreground"
                )}
              >
                {change}
              </p>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconStyles[variant])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </Card>
    );
  };

  const cropHealthData = [
    { crop: "Rice", healthy: 85, warning: 12, critical: 3 },
    { crop: "Wheat", healthy: 78, warning: 18, critical: 4 },
    { crop: "Cotton", healthy: 92, warning: 6, critical: 2 },
    { crop: "Sugarcane", healthy: 88, warning: 9, critical: 3 },
    { crop: "Pulses", healthy: 81, warning: 15, critical: 4 },
  ];

  const CropHealthChart = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Crop Health Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={cropHealthData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="crop" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
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

  const weatherData = [
    { day: "Mon", temp: 28, icon: Sun, condition: "Sunny" },
    { day: "Tue", temp: 26, icon: Cloud, condition: "Cloudy" },
    { day: "Wed", temp: 24, icon: CloudRain, condition: "Rain" },
    { day: "Thu", temp: 27, icon: Sun, condition: "Sunny" },
    { day: "Fri", temp: 29, icon: Sun, condition: "Sunny" },
  ];

  const WeatherWidget = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">7-Day Weather</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wind className="w-4 h-4" />
          <span>12 km/h</span>
        </div>
      </div>

      <div className="space-y-3">
        {weatherData.map((day) => (
          <div key={day.day} className="flex items-center justify-between py-2 border-b last:border-0">
            <span className="text-sm font-medium w-12">{day.day}</span>
            <div className="flex items-center gap-2 flex-1">
              <day.icon className="w-5 h-5 text-secondary" />
              <span className="text-sm text-muted-foreground">{day.condition}</span>
            </div>
            <span className="text-lg font-semibold">{day.temp}°C</span>
          </div>
        ))}
      </div>
    </Card>
  );
