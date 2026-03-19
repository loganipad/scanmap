import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Map as MapIcon, BarChart2, Flame, Users, Settings, HelpCircle, Plus, Bell, User, Megaphone, Navigation } from "lucide-react";
import { cn, Button } from "../components/ui";

export function DashboardLayout() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
    { name: "Map", href: "/dashboard/map", icon: MapIcon },
    { name: "Route Optimizer", href: "/dashboard/route", icon: Navigation },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { name: "Heatmap", href: "/dashboard/heatmap", icon: Flame },
    { name: "Employee View", href: "/dashboard/employee", icon: Users },
    { name: "Team", href: "/dashboard/team", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg text-text">
      <div className="flex flex-1">
        <aside className="w-60 border-r border-border bg-surface flex flex-col">
          <div className="h-14 flex items-center px-4 border-b border-border">
            <span className="h-2 w-2 rounded-full bg-accent mr-2" />
            <span className="font-bold text-text">SCANMAP</span>
          </div>
          <nav className="flex-1 space-y-1 p-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface hover:text-text"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-muted")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="text-xs font-mono text-muted mb-2">14/20 QR used</div>
            <div className="h-1 w-full bg-border rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[70%]" />
            </div>
          </div>
        </aside>
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0">
            <div className="flex-1 max-w-md">
              <input 
                type="search" 
                placeholder="Search campaigns, locations..." 
                className="w-full bg-bg border border-border rounded-sm px-3 py-1.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-muted hover:text-text">
                <Bell className="h-5 w-5" />
              </button>
              <button className="text-muted hover:text-text">
                <User className="h-5 w-5" />
              </button>
              <Link to="/dashboard/campaigns/new">
                <Button className="h-8 gap-2">
                  <Plus className="h-4 w-4" />
                  New Campaign
                </Button>
              </Link>
            </div>
          </header>
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
