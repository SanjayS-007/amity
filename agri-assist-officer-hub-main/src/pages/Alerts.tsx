import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, Users, Send } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createAlert } from "@/lib/alerts";

const alerts = [
  { 
    title: "Heavy Rainfall Warning", 
    message: "IMD predicts heavy rainfall in the next 48 hours. Take necessary precautions.",
    severity: "critical",
    recipients: 245,
    sentAt: "2 hours ago"
  },
  { 
    title: "Pest Outbreak Alert", 
    message: "Brown spot disease detected in rice crops. Check your fields immediately.",
    severity: "warning",
    recipients: 89,
    sentAt: "1 day ago"
  },
  { 
    title: "Market Update", 
    message: "Rice MSP increased by ₹50/quintal. Good time for harvest planning.",
    severity: "info",
    recipients: 420,
    sentAt: "2 days ago"
  },
];

type AlertFormValues = {
  title?: string;
  place?: string;
  intensity?: string;
  color?: "red" | "orange" | "yellow" | "green";
  message?: string;
};

export default function Alerts() {
  const [showForm, setShowForm] = React.useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, reset } = useForm<AlertFormValues>();

  async function onSubmit(values: AlertFormValues) {
    try {
      await createAlert({
        title: values.title || "Untitled Alert",
        message: values.message || "",
        place: values.place || "",
        intensity: values.intensity || "Medium",
        color: values.color || "red",
      });
      toast({ title: "Alert created", description: "Alert saved to Firestore." });
      reset();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed", description: "Could not create alert. Check console." });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="ml-64 mt-16 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Alerts & Notifications</h1>
            <p className="text-muted-foreground">Create and manage alerts for farmers in your zone</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-primary hover:bg-primary-hover" onClick={() => setShowForm((s) => !s)}>
              <Plus className="w-4 h-4 mr-2" />
              {showForm ? "Close" : "Create Alert"}
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="p-6 mb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input placeholder="Short title" {...register("title")} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Place</label>
                <Input placeholder="Village / district" {...register("place")} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Intensity</label>
                <Input placeholder="Low / Medium / High" {...register("intensity")} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type (color)</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base" {...register("color")}>
                  <option value="red">Red</option>
                  <option value="orange">Orange</option>
                  <option value="yellow">Yellow</option>
                  <option value="green">Green</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <Textarea placeholder="Detailed message for farmers" {...register("message")} />
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit">Send Alert</Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-8 h-8 text-destructive" />
              <Badge className="bg-destructive/10 text-destructive">Active</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">3</p>
            <p className="text-sm text-muted-foreground">Critical Alerts</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-primary" />
              <Badge className="bg-primary/10 text-primary">Total</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">754</p>
            <p className="text-sm text-muted-foreground">Farmers Notified</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Send className="w-8 h-8 text-secondary" />
              <Badge className="bg-secondary/10 text-secondary">Today</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">12</p>
            <p className="text-sm text-muted-foreground">Alerts Sent</p>
          </Card>
        </div>

        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-smooth">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{alert.title}</h3>
                    <Badge className={
                      alert.severity === "critical" 
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : alert.severity === "warning"
                        ? "bg-warning/10 text-warning border-warning/20"
                        : "bg-info/10 text-info border-info/20"
                    }>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{alert.message}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {alert.recipients} recipients
                    </span>
                    <span>{alert.sentAt}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
