import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { CropHealthChart } from "@/components/dashboard/CropHealthChart";
import { Users, Sprout, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

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
