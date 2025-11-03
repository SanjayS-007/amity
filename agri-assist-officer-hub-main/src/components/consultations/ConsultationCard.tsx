import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, MessageSquare } from "lucide-react";

interface ConsultationCardProps {
  farmerName: string;
  query: string;
  category: string;
  status: "new" | "in-progress" | "resolved";
  timeAgo: string;
  priority: "low" | "medium" | "high";
}

export function ConsultationCard({ 
  farmerName, 
  query, 
  category, 
  status, 
  timeAgo, 
  priority 
}: ConsultationCardProps) {
  const statusColors = {
    new: "bg-info/10 text-info border-info/20",
    "in-progress": "bg-warning/10 text-warning border-warning/20",
    resolved: "bg-success/10 text-success border-success/20"
  };

  const priorityColors = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/10 text-warning border-warning/20",
    high: "bg-destructive/10 text-destructive border-destructive/20"
  };

  return (
    <Card className="p-5 hover:shadow-md transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{farmerName}</span>
        </div>
        <div className="flex gap-2">
          <Badge className={statusColors[status]}>
            {status.replace("-", " ")}
          </Badge>
          <Badge className={priorityColors[priority]}>
            {priority}
          </Badge>
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
}
