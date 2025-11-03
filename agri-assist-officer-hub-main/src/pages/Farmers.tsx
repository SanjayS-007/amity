import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { FarmerCard } from "@/components/farmers/FarmerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Plus } from "lucide-react";

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
