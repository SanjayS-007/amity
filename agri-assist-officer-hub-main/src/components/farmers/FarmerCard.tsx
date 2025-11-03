import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Sprout } from "lucide-react";

interface FarmerCardProps {
  name: string;
  village: string;
  phone: string;
  crops: string[];
  healthStatus: "healthy" | "warning" | "critical";
  landSize: string;
}

export function FarmerCard({ name, village, phone, crops, healthStatus, landSize }: FarmerCardProps) {
  const statusColors = {
    healthy: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    critical: "bg-destructive/10 text-destructive border-destructive/20"
  };

  const statusLabels = {
    healthy: "Healthy",
    warning: "Needs Attention",
    critical: "Critical"
  };

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
        <Badge className={statusColors[healthStatus]}>
          {statusLabels[healthStatus]}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Sprout className="w-4 h-4 text-muted-foreground" />
          <span>{crops.join(", ")} • {landSize}</span>
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
}
