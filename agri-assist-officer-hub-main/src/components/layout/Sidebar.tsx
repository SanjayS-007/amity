import { Home, Users, MessageSquare, Bell, Bug, TrendingUp, BarChart3, MessageCircle, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Users, label: "Farmers", path: "/farmers" },
  { icon: MessageSquare, label: "Consultations", path: "/consultations" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: Bug, label: "Pest & Disease", path: "/pest-disease" },
  { icon: TrendingUp, label: "Market & Schemes", path: "/market" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: MessageCircle, label: "Communication", path: "/communication" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">AgriAssist</h1>
            <p className="text-xs text-sidebar-foreground/70">Officer Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth text-sm font-medium",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">AO</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Agri Officer</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">Zone A - District 1</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
