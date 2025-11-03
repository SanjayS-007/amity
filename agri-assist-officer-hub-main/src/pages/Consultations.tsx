import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, MessageSquare } from "lucide-react";

const consultations = [
  { 
    farmerName: "Rajesh Kumar", 
    query: "My rice crop leaves are turning yellow. What should I do?", 
    category: "Crop Health", 
    status: "new" as const, 
    timeAgo: "5 minutes ago",
    priority: "high" as const
  },
  { 
    farmerName: "Sunita Devi", 
    query: "When is the best time to harvest cotton in this season?", 
    category: "Crop Management", 
    status: "in-progress" as const, 
    timeAgo: "1 hour ago",
    priority: "medium" as const
  },
  { 
    farmerName: "Amit Singh", 
    query: "Pest infestation in sugarcane. Need urgent advice.", 
    category: "Pest Control", 
    status: "new" as const, 
    timeAgo: "2 hours ago",
    priority: "high" as const
  },
  { 
    farmerName: "Priya Sharma", 
    query: "How to apply for the PM-KISAN scheme?", 
    category: "Schemes", 
    status: "resolved" as const, 
    timeAgo: "1 day ago",
    priority: "low" as const
  },
];

export default function Consultations() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Consultations & Queries</h1>
          <p className="text-muted-foreground">Respond to farmer queries and provide expert guidance</p>
        </div>

        <div className="mb-6">
          <Input placeholder="Search consultations..." className="max-w-md" />
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All (12)</TabsTrigger>
            <TabsTrigger value="new">New (5)</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress (4)</TabsTrigger>
            <TabsTrigger value="resolved">Resolved (3)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {consultations.map((consultation, index) => (
              <ConsultationCard key={index} {...consultation} />
            ))}
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            {consultations.filter(c => c.status === "new").map((consultation, index) => (
              <ConsultationCard key={index} {...consultation} />
            ))}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            {consultations.filter(c => c.status === "in-progress").map((consultation, index) => (
              <ConsultationCard key={index} {...consultation} />
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {consultations.filter(c => c.status === "resolved").map((consultation, index) => (
              <ConsultationCard key={index} {...consultation} />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

interface ConsultationCardProps {
  farmerName: string;
  query: string;
  category: string;
  status: "new" | "in-progress" | "resolved";
  timeAgo: string;
  priority: "low" | "medium" | "high";
}

const ConsultationCard = ({
  farmerName,
  query,
  category,
  status,
  timeAgo,
  priority,
}: ConsultationCardProps) => {
  const statusColors = {
    new: "bg-info/10 text-info border-info/20",
    "in-progress": "bg-warning/10 text-warning border-warning/20",
    resolved: "bg-success/10 text-success border-success/20",
  } as const;

  const priorityColors = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/10 text-warning border-warning/20",
    high: "bg-destructive/10 text-destructive border-destructive/20",
  } as const;

  return (
    <Card className="p-5 hover:shadow-md transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{farmerName}</span>
        </div>
        <div className="flex gap-2">
          <Badge className={statusColors[status]}>{status.replace("-", " ")}</Badge>
          <Badge className={priorityColors[priority]}>{priority}</Badge>
        </div>
      </div>

      <div className="mb-3">
        <Badge variant="outline" className="mb-2 text-xs">
          {category}
        </Badge>
        <p className="text-sm text-foreground line-clamp-2">{query}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeAgo}</span>
        </div>
        <Button size="sm" className="bg-primary hover:bg-primary-hover">
          <MessageSquare className="w-4 h-4 mr-1.5" />
          Respond
        </Button>
      </div>
    </Card>
  );
};
