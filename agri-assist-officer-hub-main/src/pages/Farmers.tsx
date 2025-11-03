import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Plus, MapPin, Phone, Sprout } from "lucide-react";

const farmers = [
  { name: "Rajesh Kumar", village: "Madhubani", phone: "+91 98765 43210", crops: ["Rice", "Wheat"], healthStatus: "healthy" as const, landSize: "5 acres" },
  { name: "Sunita Devi", village: "Purnea", phone: "+91 98765 43211", crops: ["Cotton"], healthStatus: "warning" as const, landSize: "3.5 acres" },
  { name: "Amit Singh", village: "Sitamarhi", phone: "+91 98765 43212", crops: ["Sugarcane"], healthStatus: "healthy" as const, landSize: "8 acres" },
  { name: "Priya Sharma", village: "Madhubani", phone: "+91 98765 43213", crops: ["Pulses", "Wheat"], healthStatus: "critical" as const, landSize: "4 acres" },
  { name: "Vikram Yadav", village: "Darbhanga", phone: "+91 98765 43214", crops: ["Rice"], healthStatus: "healthy" as const, landSize: "6 acres" },
  { name: "Anita Kumari", village: "Sitamarhi", phone: "+91 98765 43215", crops: ["Cotton", "Rice"], healthStatus: "warning" as const, landSize: "7 acres" },
];

export default function Farmers() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="ml-64 mt-16 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Farmers Management</h1>
            <p className="text-muted-foreground">Manage and monitor farmers in your zone</p>
          </div>
          <Button className="bg-primary hover:bg-primary-hover">
            <Plus className="w-4 h-4 mr-2" />
            Add Farmer
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Input placeholder="Search farmers..." className="max-w-xs" />
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Village" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Villages</SelectItem>
              <SelectItem value="madhubani">Madhubani</SelectItem>
              <SelectItem value="purnea">Purnea</SelectItem>
              <SelectItem value="sitamarhi">Sitamarhi</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Health Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Farmers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((farmer, index) => (
            <FarmerCard key={index} {...farmer} />
          ))}
        </div>
      </main>
    </div>
  );
}

interface FarmerCardProps {
  name: string;
  village: string;
  phone: string;
  crops: string[];
  healthStatus: "healthy" | "warning" | "critical";
  landSize: string;
}

const FarmerCard = ({
  name,
  village,
  phone,
  crops,
  healthStatus,
  landSize,
}: FarmerCardProps) => {
  const statusColors = {
    healthy: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    critical: "bg-destructive/10 text-destructive border-destructive/20",
  } as const;

  const statusLabels = {
    healthy: "Healthy",
    warning: "Needs Attention",
    critical: "Critical",
  } as const;

  return (
    <Card className="p-5 hover:shadow-md transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{village}</span>
          </div>
        </div>
        <Badge className={statusColors[healthStatus]}>{statusLabels[healthStatus]}</Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Sprout className="w-4 h-4 text-muted-foreground" />
          <span>
            {crops.join(", ")} • {landSize}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          View Profile
        </Button>
        <Button size="sm" className="flex-1 bg-primary hover:bg-primary-hover">
          Contact
        </Button>
      </div>
    </Card>
  );
};
