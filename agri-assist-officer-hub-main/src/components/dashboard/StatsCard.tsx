import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "accent" | "default";
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  variant = "default"
}: StatsCardProps) {
  const variantStyles = {
    primary: "border-primary/20 bg-primary/5",
    secondary: "border-secondary/20 bg-secondary/5",
    accent: "border-accent/20 bg-accent/5",
    default: "border-border bg-card"
  };

  const iconStyles = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    default: "bg-muted text-foreground"
  };

  return (
    <Card className={cn("p-6 transition-smooth hover:shadow-md", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {change && (
            <p className={cn(
              "text-sm font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
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
}
