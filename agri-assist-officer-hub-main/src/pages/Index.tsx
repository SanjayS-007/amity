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
  TrendingUp,
  TrendingDown,
  Smartphone,
  Clock,
  MapPin,
  Calendar,
  Droplets,
  Phone,
  MessageSquare,
  ExternalLink,
  Bell,
  DollarSign,
  Activity,
  FileText,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboardSummary, useWebSocket, useInboxTasks, useCalendarEvents } from "@/hooks/use-dashboard";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, addDays, isToday, isTomorrow } from 'date-fns';

export default function Index() {
  const navigate = useNavigate();
  const { data: summary, isLoading, refetch } = useDashboardSummary(true);
  const { tasks: inboxTasks = [] } = useInboxTasks({ type: 'all', status: 'pending' });
  const startDate = format(new Date(), 'yyyy-MM-dd');
  const endDate = format(addDays(new Date(), 7), 'yyyy-MM-dd');
  const { data: calendarEvents = [] } = useCalendarEvents(startDate, endDate);
  
  // WebSocket connection for real-time updates
  const WS_URL = import.meta.env.VITE_WS_URL;
  useWebSocket(WS_URL);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <TopBar />
        <main className="ml-64 mt-16 p-6">
          <div className="text-center py-12">
            <Activity className="w-12 h-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">Loading Officer Command Center...</p>
          </div>
        </main>
      </div>
    );
  }

  // Calculate metrics for activity pulse
  const totalFarmers = summary?.farmers ? (summary.farmers.active + summary.farmers.inactive + summary.farmers.dormant) : 0;
  const activePercentage = summary?.farmers && totalFarmers > 0 ? ((summary.farmers.active / totalFarmers) * 100).toFixed(1) : '0';
  const totalArea = summary?.crops ? summary.crops.reduce((sum, c) => sum + c.acreage, 0) : 0;
  const totalPending = summary?.pending ? (summary.pending.consultations + summary.pending.visits + summary.pending.alerts) : 0;
  const totalAlerts = summary?.alerts ? (summary.alerts.red + summary.alerts.yellow + summary.alerts.info) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="ml-64 mt-16 p-4">
        {/* Header Section */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Officer Command Center</h1>
            <p className="text-sm text-muted-foreground">Real-time agricultural decision support for your zone</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Updated: {summary?.lastUpdated ? format(new Date(summary.lastUpdated), 'HH:mm') : 'Now'}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <Activity className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* KPIs & Overview - Clean Professional Panel */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Zone Overview
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Real-time metrics and key performance indicators</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Updated: {summary?.lastUpdated ? format(new Date(summary.lastUpdated), 'HH:mm') : 'Now'}
              </Badge>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                <Activity className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Main KPI Cards - 4 Essential Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Farmers Card */}
            <EnhancedKPICard
              title="Total Farmers Under Zone"
              value={totalFarmers}
              subtitle={`${activePercentage}% active this week`}
              icon={Users}
              trend={+12.5}
              badges={[
                { label: `+${summary?.farmers.active || 0} Active`, variant: 'success' },
                { label: `${summary?.farmers.inactive || 0} Inactive`, variant: 'warning' }
              ]}
              color="emerald"
              sparklineData={[65, 68, 72, 70, 75, 78, 80]}
              onClick={() => navigate('/farmers')}
              quickActions={[
                { label: 'View List', icon: Users, action: () => navigate('/farmers') },
                { label: 'Send Message', icon: MessageSquare, action: () => navigate('/alerts') }
              ]}
            />

            {/* Active Crop Cycles Card */}
            <EnhancedKPICard
              title="Active Crop Cycles"
              value={summary?.crops?.length || 0}
              subtitle="Ongoing growth phases"
              icon={Sprout}
              badges={[
                { label: 'Sowing: 45', variant: 'default' },
                { label: 'Harvest: 55', variant: 'success' }
              ]}
              color="green"
              phaseProgress={[
                { phase: 'Sowing', percentage: 25, color: 'from-yellow-400 to-yellow-600' },
                { phase: 'Vegetative', percentage: 35, color: 'from-green-400 to-green-600' },
                { phase: 'Flowering', percentage: 20, color: 'from-pink-400 to-pink-600' },
                { phase: 'Harvest', percentage: 20, color: 'from-orange-400 to-orange-600' }
              ]}
              onClick={() => navigate('/analytics?view=phases')}
              quickActions={[
                { label: 'View Phases', icon: Sprout, action: () => navigate('/analytics?view=phases') },
                { label: 'Assign Officer', icon: UserCheck, action: () => navigate('/consultations') }
              ]}
            />

            {/* Pending Actions Card */}
            <EnhancedKPICard
              title="Pending Actions"
              value={totalPending}
              subtitle={`${summary?.pending?.consultations || 0} consultations, ${summary?.pending?.visits || 0} visits`}
              icon={CheckCircle}
              trend={-5.3}
              badges={[
                { label: `${summary?.pending?.consultations || 0} Consultations`, variant: 'default' },
                { label: `${summary?.pending?.visits || 0} Field Visits`, variant: 'info' }
              ]}
              color="blue"
              sparklineData={[30, 28, 32, 25, 27, 24, totalPending]}
              onClick={() => navigate('/consultations?filter=pending')}
              quickActions={[
                { label: 'View All', icon: FileText, action: () => navigate('/consultations') },
                { label: 'Assign', icon: UserCheck, action: () => navigate('/consultations') }
              ]}
            />

            {/* Alerts Card */}
            <EnhancedKPICard
              title="Alerts (This Week)"
              value={totalAlerts}
              subtitle={`${totalPending} pending actions`}
              icon={AlertTriangle}
              badges={[
                { label: `${summary?.alerts?.red || 0} Critical`, variant: 'destructive', pulse: true },
                { label: `${summary?.alerts?.yellow || 0} Warning`, variant: 'warning' }
              ]}
              color="red"
              alertDistribution={{
                new: summary?.pending?.alerts || 0,
                pending: totalPending,
                solved: Math.round(((summary?.alerts?.info || 0) / Math.max(totalAlerts, 1)) * 100)
              }}
              onClick={() => navigate('/alerts')}
              quickActions={[
                { label: 'View List', icon: AlertTriangle, action: () => navigate('/alerts') },
                { label: 'Broadcast', icon: Bell, action: () => navigate('/alerts') }
              ]}
            />
          </div>
        </div>

        {/* Zone Analytics Overview - Dynamic Pie Chart Selector */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Zone Analytics Overview
            </CardTitle>
            <CardDescription>Interactive insights for zone-level agricultural data</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Selector Bar */}
            <Tabs defaultValue="crops" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
                <TabsTrigger 
                  value="crops" 
                  className="flex flex-col items-center gap-2 py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200"
                >
                  <Sprout className="w-6 h-6" />
                  <div className="text-center">
                    <p className="font-semibold text-sm">Crops by Type</p>
                    <p className="text-xs text-muted-foreground">Distribution Analysis</p>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="phases" 
                  className="flex flex-col items-center gap-2 py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200"
                >
                  <Activity className="w-6 h-6" />
                  <div className="text-center">
                    <p className="font-semibold text-sm">Phases Distribution</p>
                    <p className="text-xs text-muted-foreground">Growth Stages</p>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="health" 
                  className="flex flex-col items-center gap-2 py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200"
                >
                  <CheckCircle className="w-6 h-6" />
                  <div className="text-center">
                    <p className="font-semibold text-sm">Health Status</p>
                    <p className="text-xs text-muted-foreground">Farm Conditions</p>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* Crops by Type Chart */}
              <TabsContent value="crops" className="mt-6 space-y-6">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Pie Chart */}
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Paddy', value: 1240, fill: '#10b981' },
                            { name: 'Maize', value: 890, fill: '#f59e0b' },
                            { name: 'Cotton', value: 650, fill: '#3b82f6' },
                            { name: 'Wheat', value: 520, fill: '#8b5cf6' },
                            { name: 'Pulses', value: 480, fill: '#ec4899' },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {[
                            { name: 'Paddy', value: 1240, fill: '#10b981' },
                            { name: 'Maize', value: 890, fill: '#f59e0b' },
                            { name: 'Cotton', value: 650, fill: '#3b82f6' },
                            { name: 'Wheat', value: 520, fill: '#8b5cf6' },
                            { name: 'Pulses', value: 480, fill: '#ec4899' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border rounded-lg shadow-lg p-3">
                                  <p className="font-semibold">{payload[0].name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {payload[0].value} hectares ({((payload[0].value as number / 3780) * 100).toFixed(1)}%)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value, entry: { value: number }) => (
                            <span className="text-sm font-medium">
                              {value}: {entry.value}ha ({((entry.value / 3780) * 100).toFixed(1)}%)
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Details Panel */}
                  <div className="w-full lg:w-1/2 space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-100 rounded">
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-900">Most Popular Crop</p>
                          <p className="text-sm text-emerald-700 mt-1">
                            <span className="font-bold">Paddy</span> - 1,240 hectares (33% of farmers)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Crop Breakdown</h4>
                      {[
                        { name: 'Paddy', acres: 1240, color: 'bg-emerald-500', farmers: 820 },
                        { name: 'Maize', acres: 890, color: 'bg-amber-500', farmers: 595 },
                        { name: 'Cotton', acres: 650, color: 'bg-blue-500', farmers: 435 },
                        { name: 'Wheat', acres: 520, color: 'bg-purple-500', farmers: 348 },
                        { name: 'Pulses', acres: 480, color: 'bg-pink-500', farmers: 252 },
                      ].map((crop, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-4 h-4 rounded", crop.color)} />
                            <span className="font-medium">{crop.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{crop.acres} ha</p>
                            <p className="text-xs text-muted-foreground">{crop.farmers} farmers</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        <span className="font-semibold">Insight:</span> Paddy cultivation increased by 8% compared to last season
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Phases Distribution Chart */}
              <TabsContent value="phases" className="mt-6 space-y-6">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Pie Chart */}
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Sowing', value: 625, fill: '#fbbf24' },
                            { name: 'Vegetative', value: 875, fill: '#10b981' },
                            { name: 'Flowering', value: 500, fill: '#ec4899' },
                            { name: 'Maturity', value: 525, fill: '#f97316' },
                            { name: 'Harvest', value: 425, fill: '#8b5cf6' },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {[
                            { name: 'Sowing', value: 625, fill: '#fbbf24' },
                            { name: 'Vegetative', value: 875, fill: '#10b981' },
                            { name: 'Flowering', value: 500, fill: '#ec4899' },
                            { name: 'Maturity', value: 525, fill: '#f97316' },
                            { name: 'Harvest', value: 425, fill: '#8b5cf6' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border rounded-lg shadow-lg p-3">
                                  <p className="font-semibold">{payload[0].name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {payload[0].value} farmers ({((payload[0].value as number / 2950) * 100).toFixed(1)}%)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value, entry: { value: number }) => (
                            <span className="text-sm font-medium">
                              {value}: {entry.value} farmers ({((entry.value / 2950) * 100).toFixed(1)}%)
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Details Panel */}
                  <div className="w-full lg:w-1/2 space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded">
                          <Sprout className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">Dominant Phase</p>
                          <p className="text-sm text-green-700 mt-1">
                            <span className="font-bold">Vegetative</span> - 875 farmers (30% of zone)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Phase Breakdown</h4>
                      {[
                        { name: 'Sowing', farmers: 625, color: 'bg-yellow-400', percentage: 21 },
                        { name: 'Vegetative', farmers: 875, color: 'bg-green-500', percentage: 30 },
                        { name: 'Flowering', farmers: 500, color: 'bg-pink-500', percentage: 17 },
                        { name: 'Maturity', farmers: 525, color: 'bg-orange-500', percentage: 18 },
                        { name: 'Harvest', farmers: 425, color: 'bg-purple-500', percentage: 14 },
                      ].map((phase, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-4 h-4 rounded", phase.color)} />
                            <span className="font-medium">{phase.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{phase.farmers} farmers</p>
                            <p className="text-xs text-muted-foreground">{phase.percentage}%</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-xs text-orange-700">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        <span className="font-semibold">Alert:</span> Harvest phase delayed—12% farmers flagged for support
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Health Status Chart */}
              <TabsContent value="health" className="mt-6 space-y-6">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Pie Chart */}
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Healthy', value: 1820, fill: '#10b981' },
                            { name: 'Warning', value: 420, fill: '#f59e0b' },
                            { name: 'Critical', value: 95, fill: '#ef4444' },
                            { name: 'Under Review', value: 115, fill: '#6b7280' },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {[
                            { name: 'Healthy', value: 1820, fill: '#10b981' },
                            { name: 'Warning', value: 420, fill: '#f59e0b' },
                            { name: 'Critical', value: 95, fill: '#ef4444' },
                            { name: 'Under Review', value: 115, fill: '#6b7280' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border rounded-lg shadow-lg p-3">
                                  <p className="font-semibold">{payload[0].name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {payload[0].value} farms ({((payload[0].value as number / 2450) * 100).toFixed(1)}%)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value, entry: { value: number }) => (
                            <span className="text-sm font-medium">
                              {value}: {entry.value} farms ({((entry.value / 2450) * 100).toFixed(1)}%)
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Details Panel */}
                  <div className="w-full lg:w-1/2 space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-100 rounded">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-900">Overall Health Status</p>
                          <p className="text-sm text-emerald-700 mt-1">
                            <span className="font-bold">Healthy</span> - 1,820 farms (74% of zone)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Health Breakdown</h4>
                      {[
                        { name: 'Healthy', count: 1820, color: 'bg-emerald-500', percentage: 74, action: 'No action needed' },
                        { name: 'Warning', count: 420, color: 'bg-amber-500', percentage: 17, action: 'Monitor closely' },
                        { name: 'Critical', count: 95, color: 'bg-red-500', percentage: 4, action: 'Immediate attention' },
                        { name: 'Under Review', count: 115, color: 'bg-gray-500', percentage: 5, action: 'Assessment pending' },
                      ].map((status, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-4 h-4 rounded", status.color)} />
                            <div>
                              <span className="font-medium block">{status.name}</span>
                              <span className="text-xs text-muted-foreground">{status.action}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{status.count} farms</p>
                            <p className="text-xs text-muted-foreground">{status.percentage}%</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-700">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        <span className="font-semibold">Priority Alert:</span> 95 farms in critical condition require immediate field visits
                      </p>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/farmers?status=critical')}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      View Critical Farms
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}

// ==================== COMPONENT DEFINITIONS ====================

// Enhanced KPI Card Component (First Row - Big Cards)
interface EnhancedKPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: number;
  badges?: Array<{ label: string; variant: 'success' | 'warning' | 'info' | 'destructive' | 'default'; pulse?: boolean }>;
  color: 'emerald' | 'blue' | 'green' | 'red' | 'purple';
  sparklineData?: number[];
  cropDistribution?: Array<{ name: string; acreage: number }>;
  phaseProgress?: Array<{ phase: string; percentage: number; color: string }>;
  alertDistribution?: { new: number; pending: number; solved: number };
  onClick: () => void;
  quickActions: Array<{ label: string; icon: LucideIcon; action: () => void }>;
}

const EnhancedKPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  badges = [],
  color,
  sparklineData,
  cropDistribution,
  phaseProgress,
  alertDistribution,
  onClick,
  quickActions
}: EnhancedKPICardProps) => {
  const colorSchemes = {
    emerald: {
      icon: 'text-emerald-600 bg-emerald-50',
      border: 'border-emerald-200',
      trend: 'text-emerald-600 bg-emerald-50'
    },
    blue: {
      icon: 'text-blue-600 bg-blue-50',
      border: 'border-blue-200',
      trend: 'text-blue-600 bg-blue-50'
    },
    green: {
      icon: 'text-green-600 bg-green-50',
      border: 'border-green-200',
      trend: 'text-green-600 bg-green-50'
    },
    red: {
      icon: 'text-red-600 bg-red-50',
      border: 'border-red-200',
      trend: 'text-red-600 bg-red-50'
    },
    purple: {
      icon: 'text-purple-600 bg-purple-50',
      border: 'border-purple-200',
      trend: 'text-purple-600 bg-purple-50'
    }
  };

  const scheme = colorSchemes[color];

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg",
        scheme.border,
        "border-l-4"
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-foreground">{value}</h3>
              {trend && (
                <Badge variant="outline" className={cn("text-xs", scheme.trend)}>
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className={cn("p-2.5 rounded-lg", scheme.icon)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>

        {/* Badges Row */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {badges.map((badge, idx) => (
              <Badge 
                key={idx}
                variant="secondary"
                className="text-xs"
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Sparkline Chart */}
        {sparklineData && (
          <div className="mb-3 h-10 opacity-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sparklineData.map((val, idx) => ({ value: val, index: idx }))}>
                <Bar dataKey="value" fill="currentColor" className="text-muted-foreground" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Crop Distribution Mini Map */}
        {cropDistribution && cropDistribution.length > 0 && (
          <div className="mb-3 grid grid-cols-2 gap-2">
            {cropDistribution.slice(0, 4).map((crop, idx) => (
              <div key={idx} className="text-xs bg-muted rounded px-2 py-1.5">
                <span className="font-medium">{crop.name}:</span> <span className="text-muted-foreground">{crop.acreage}ha</span>
              </div>
            ))}
          </div>
        )}

        {/* Phase Progress Circles */}
        {phaseProgress && (
          <div className="mb-3 grid grid-cols-4 gap-2">
            {phaseProgress.map((phase, idx) => (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div className="text-center">
                    <div className="relative w-10 h-10 mx-auto mb-1">
                      <svg className="w-10 h-10 transform -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          stroke="hsl(var(--muted))"
                          strokeWidth="3"
                          fill="none"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 16}`}
                          strokeDashoffset={`${2 * Math.PI * 16 * (1 - phase.percentage / 100)}`}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold">
                        {phase.percentage}%
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{phase.phase}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{phase.phase}: {phase.percentage}% of farmers</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}

        {/* Alert Distribution Ring */}
        {alertDistribution && (
          <div className="mb-3 flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="hsl(var(--muted))" strokeWidth="4" fill="none" />
                <circle 
                  cx="28" cy="28" r="24" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="4" 
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - alertDistribution.solved / 100)}`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                {alertDistribution.solved}%
              </span>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">New: <span className="font-semibold text-foreground">{alertDistribution.new}</span></span>
                <Badge variant="destructive" className="text-xs">Urgent</Badge>
              </div>
              <Progress value={(alertDistribution.solved / 100) * 100} className="h-1.5" />
              <p className="text-xs text-muted-foreground">Pending: <span className="font-semibold text-foreground">{alertDistribution.pending}</span></p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-3 border-t">
          {quickActions.map((action, idx) => {
            const ActionIcon = action.icon;
            return (
              <Button
                key={idx}
                size="sm"
                variant="ghost"
                className="flex-1 text-xs h-7"
                onClick={(e) => {
                  e.stopPropagation();
                  action.action();
                }}
              >
                <ActionIcon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Mini Stat Card Component (Second Row)
interface MiniStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  progress?: number;
  trend?: 'up' | 'down';
  color: 'purple' | 'green' | 'blue' | 'charcoal';
  sparklineData?: number[];
  donutData?: Array<{ label: string; value: number; color: string }>;
  badge?: { label: string; variant: 'gold' | 'success' | 'warning' };
  onClick: () => void;
}

const MiniStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  progress,
  trend,
  color,
  sparklineData,
  donutData,
  badge,
  onClick
}: MiniStatCardProps) => {
  const iconColors = {
    purple: 'text-purple-600 bg-purple-50',
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    charcoal: 'text-gray-600 bg-gray-100'
  };

  const badgeVariants = {
    gold: 'default',
    success: 'default',
    warning: 'secondary'
  } as const;

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-bold text-foreground">{value}</h4>
              {trend && (
                <span className={cn(
                  "text-xs font-semibold",
                  trend === 'up' ? "text-green-600" : "text-red-600"
                )}>
                  {trend === 'up' ? '↑' : '↓'}
                </span>
              )}
            </div>
          </div>
          <div className={cn("p-2 rounded-lg", iconColors[color])}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mb-2">
            <Progress 
              value={progress} 
              className="h-1.5"
            />
          </div>
        )}

        {/* Sparkline */}
        {sparklineData && (
          <div className="h-8 mb-2 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sparklineData.map((val, idx) => ({ value: val }))}>
                <Bar dataKey="value" fill="currentColor" className="text-muted-foreground" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Donut Legend */}
        {donutData && (
          <div className="space-y-1.5">
            {donutData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Badge */}
        {badge && (
          <Badge variant={badgeVariants[badge.variant]} className="mt-2 text-xs">
            {badge.label}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

// Quick Stat Badge Component
interface QuickStatBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant: "success" | "info" | "warning" | "destructive" | "secondary";
}

const QuickStatBadge = ({ icon: Icon, label, value, variant }: QuickStatBadgeProps) => {
  const variantStyles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    destructive: "bg-red-50 border-red-200 text-red-700",
    secondary: "bg-slate-50 border-slate-200 text-slate-700",
  };

  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-lg border", variantStyles[variant])}>
      <Icon className="w-5 h-5" />
      <div className="flex-1">
        <p className="text-xs font-medium opacity-80">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
};

// Crop Distribution Chart Component
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

const CropDistributionChart = ({ crops }: { crops: Array<{ name: string; acreage: number }> }) => {
  const chartData = crops.map((crop, index) => ({
    name: crop.name,
    value: crop.acreage,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Distribution by cultivated area (hectares)</p>
        <Button size="sm" variant="outline" onClick={() => window.location.href = '/analytics?view=crops'}>
          <ExternalLink className="w-3 h-3 mr-1" />
          Details
        </Button>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {crops.map((crop, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
            <span>{crop.name}: {crop.acreage} ha</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Farm Health Status Component
const FarmHealthStatus = () => {
  const healthData = [
    { status: 'Healthy', count: 1820, percentage: 78, color: 'bg-emerald-500' },
    { status: 'Warning', count: 420, percentage: 18, color: 'bg-amber-500' },
    { status: 'Critical', count: 95, percentage: 4, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Farm health distribution across zone</p>
      {healthData.map((item) => (
        <div key={item.status} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", item.color)} />
              <span className="font-medium">{item.status}</span>
            </div>
            <span className="text-muted-foreground">{item.count} farms ({item.percentage}%)</span>
          </div>
          <Progress value={item.percentage} className="h-2" />
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => window.location.href = '/farmers?status=critical'}>
        <AlertTriangle className="w-4 h-4 mr-2" />
        View Critical Farms
      </Button>
    </div>
  );
};

// Crop Phases Chart Component
const CropPhasesChart = () => {
  const phasesData = [
    { phase: 'Sowing', rice: 45, wheat: 60, maize: 30 },
    { phase: 'Vegetative', rice: 120, wheat: 80, maize: 55 },
    { phase: 'Flowering', rice: 85, wheat: 45, maize: 40 },
    { phase: 'Maturity', rice: 95, wheat: 70, maize: 50 },
    { phase: 'Harvest', rice: 55, wheat: 45, maize: 25 },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Farmer distribution across crop growth stages</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={phasesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="phase" fontSize={12} />
          <YAxis fontSize={12} />
          <ChartTooltip />
          <Legend />
          <Bar dataKey="rice" fill="#10b981" stackId="a" name="Rice" />
          <Bar dataKey="wheat" fill="#f59e0b" stackId="a" name="Wheat" />
          <Bar dataKey="maize" fill="#3b82f6" stackId="a" name="Maize" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Weather Widget Component
const WeatherWidget = () => {
  const weatherData = [
    { day: 'Today', temp: '32°C', condition: 'Sunny', rain: '0%', icon: Sun },
    { day: 'Tomorrow', temp: '28°C', condition: 'Cloudy', rain: '20%', icon: Cloud },
    { day: 'Wed', temp: '26°C', condition: 'Rain', rain: '80%', icon: CloudRain },
    { day: 'Thu', temp: '27°C', condition: 'Cloudy', rain: '30%', icon: Cloud },
    { day: 'Fri', temp: '29°C', condition: 'Sunny', rain: '10%', icon: Sun },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CloudRain className="w-4 h-4" />
          7-Day Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {weatherData.map((day, idx) => {
          const Icon = day.icon;
          return (
            <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{day.day}</p>
                  <p className="text-xs text-muted-foreground">{day.condition}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{day.temp}</p>
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  {day.rain}
                </p>
              </div>
            </div>
          );
        })}
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs font-semibold text-amber-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risk Alert
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Heavy rainfall expected Wed. Delay irrigation for vegetative rice fields.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Market Price Ticker Component
const MarketPriceTicker = () => {
  const marketData = [
    { commodity: 'Rice', price: '₹2,150', msp: '₹2,040', trend: 'up', change: '+5.4%' },
    { commodity: 'Wheat', price: '₹2,525', msp: '₹2,275', trend: 'up', change: '+11%' },
    { commodity: 'Cotton', price: '₹6,620', msp: '₹6,080', trend: 'down', change: '-2.3%' },
    { commodity: 'Sugarcane', price: '₹315', msp: '₹315', trend: 'stable', change: '0%' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Market Price Ticker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {marketData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
            <div>
              <p className="text-sm font-medium">{item.commodity}</p>
              <p className="text-xs text-muted-foreground">MSP: {item.msp}/quintal</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{item.price}</p>
              <div className="flex items-center gap-1">
                {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                {item.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-600" />}
                <p className={cn(
                  "text-xs font-medium",
                  item.trend === 'up' && "text-emerald-600",
                  item.trend === 'down' && "text-red-600",
                  item.trend === 'stable' && "text-muted-foreground"
                )}>
                  {item.change}
                </p>
              </div>
            </div>
          </div>
        ))}
        <Badge variant="outline" className="w-full justify-center text-xs py-2">
          Lowest in 3 months - Good selling opportunity
        </Badge>
      </CardContent>
    </Card>
  );
};

// Pending Action Queue Component
const PendingActionQueue = ({ tasks }: { tasks: Array<{
  id: string;
  type: string;
  subject: string;
  farmerName: string;
  farmerPhone: string;
  dueAt: string;
  slaBreached: boolean;
}> }) => {
  const navigate = useNavigate();
  
  const calculateSlaHours = (dueAt: string) => {
    const due = new Date(dueAt);
    const now = new Date();
    const hoursRemaining = Math.max(0, Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60)));
    return hoursRemaining;
  };
  
  if (tasks.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
        All caught up! No pending actions.
      </div>
    );
  }

  const getUrgencyColor = (slaHoursRemaining: number): "default" | "secondary" | "destructive" | "outline" => {
    if (slaHoursRemaining < 1) return 'destructive';
    if (slaHoursRemaining < 2) return 'secondary';
    return 'default';
  };

  return (
    <div className="divide-y">
      {tasks.map((task) => {
        const hoursRemaining = calculateSlaHours(task.dueAt);
        return (
          <div key={task.id} className="p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={getUrgencyColor(hoursRemaining)} className="text-xs">
                    {hoursRemaining}h left
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {task.type}
                  </Badge>
                </div>
                <p className="text-sm font-medium line-clamp-2">{task.subject}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Farmer: {task.farmerName}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="default" className="flex-1" onClick={() => navigate(`/consultations?id=${task.id}`)}>
                <FileText className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.location.href = `tel:${task.farmerPhone}`}>
                <Phone className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.location.href = `sms:${task.farmerPhone}`}>
                <MessageSquare className="w-3 h-3" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Calendar Events Widget Component
const CalendarEventsWidget = ({ events }: { events: Array<{
  id: string;
  title: string;
  startDate: string;
  category: string;
}> }) => {
  const today = new Date();
  
  return (
    <div className="space-y-3">
      {events.slice(0, 5).map((event, idx) => {
        const eventDate = new Date(event.startDate);
        const isUpcoming = isToday(eventDate) || isTomorrow(eventDate);
        
        return (
          <div key={idx} className={cn(
            "p-3 rounded-lg border",
            isUpcoming ? "bg-primary/5 border-primary/20" : "bg-muted/30"
          )}>
            <div className="flex items-start gap-3">
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground">{format(eventDate, 'MMM')}</p>
                <p className="text-lg font-bold">{format(eventDate, 'd')}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium line-clamp-1">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{event.category}</p>
                {isUpcoming && (
                  <Badge variant="default" className="mt-2 text-xs">
                    {isToday(eventDate) ? 'Today' : 'Tomorrow'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {events.length === 0 && (
        <div className="text-center py-6 text-sm text-muted-foreground">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          No upcoming events this week
        </div>
      )}
      <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/calendar'}>
        <Calendar className="w-3 h-3 mr-2" />
        View Full Calendar
      </Button>
    </div>
  );
};

// Alerts Log Component
const AlertsLog = () => {
  const recentAlerts = [
    { type: 'critical', message: 'Pest outbreak reported in Block 3A', time: '15 min ago', icon: AlertTriangle },
    { type: 'warning', message: 'Heavy rainfall expected in 48h', time: '1 hour ago', icon: CloudRain },
    { type: 'info', message: 'Scheme deadline: PM-KISAN enrollment', time: '2 hours ago', icon: Bell },
    { type: 'critical', message: 'Disease diagnosis pending approval', time: '3 hours ago', icon: AlertCircle },
    { type: 'info', message: 'Market price spike: Wheat +11%', time: '4 hours ago', icon: TrendingUp },
  ];

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-700';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-700';
      default: return 'bg-muted border-border';
    }
  };

  return (
    <div className="divide-y">
      {recentAlerts.map((alert, idx) => {
        const Icon = alert.icon;
        return (
          <div key={idx} className="p-3 hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className={cn("p-2 rounded-lg", getAlertStyle(alert.type))}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium line-clamp-2">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "accent" | "default";
  clickable?: boolean;
}

const StatsCard = ({
  title,
  value,
  subtitle,
  change,
  changeType = "neutral",
  icon: Icon,
  variant = "default",
  clickable = false,
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
    <Card
      className={cn(
        "p-6 transition-smooth hover:shadow-md",
        variantStyles[variant],
        clickable && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
          )}
          {change && (
            <div className="flex items-center gap-1">
              {changeType === "positive" && <TrendingUp className="w-4 h-4 text-success" />}
              {changeType === "negative" && <TrendingDown className="w-4 h-4 text-destructive" />}
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
            </div>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0", iconStyles[variant])}>
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
          <ChartTooltip
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

  // Old WeatherWidget removed - using new comprehensive version above
