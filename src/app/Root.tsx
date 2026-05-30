import { Outlet, NavLink, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Settings, 
  Bell, 
  ChevronRight, 
  Layers, 
  ShieldCheck, 
  FileText, 
  HelpCircle,
  FileMinus,
  Calculator,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_PLANS } from "./constants";

export default function Root() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  if (isLanding) return <Outlet />;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            E
          </div>
          <span className="font-semibold tracking-tight text-foreground">OneBuzz Builder</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Navigation
            </h3>
            <SidebarLink to="/builder" icon={<LayoutDashboard size={18} />} label="Overview" />
            <SidebarLink to="/basic-details" icon={<FileText size={18} />} label="Basic Details" />
            <SidebarLink to="/questions" icon={<HelpCircle size={18} />} label="Questions" />
            <SidebarLink to="/exclusions" icon={<FileMinus size={18} />} label="Exclusions" />
          </div>

          <div className="space-y-1">
            <div className="px-3 flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Plans
              </h3>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Plus size={14} />
              </button>
            </div>
            {MOCK_PLANS.map((plan) => (
              <SidebarLink 
                key={plan.id} 
                to={`/builder?plan=${plan.id}`} 
                label={plan.name} 
                statusIndicator={plan.status === "review" ? "amber" : "green"}
              />
            ))}
          </div>
        </nav>

        <div className="p-4 border-t space-y-2">
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md w-full transition-colors">
            <Layers size={18} />
            Manage Rules
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md w-full transition-colors">
            <Calculator size={18} />
            Manage Rating
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 border-b bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Eicore</span>
            <ChevronRight size={14} />
            <span>Products</span>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">D.I.Y Health Insurance</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all">
              <Bell size={18} />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all">
              <Settings size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
              AU
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-muted/30">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label, statusIndicator }: { to: string; icon?: React.ReactNode; label: string; statusIndicator?: "green" | "amber" | "red" }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all group",
          isActive 
            ? "bg-primary text-primary-foreground shadow-md" 
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )
      }
    >
      {icon}
      <span className="flex-1">{label}</span>
      {statusIndicator && (
        <div className={cn(
          "w-2 h-2 rounded-full",
          statusIndicator === "green" && "bg-emerald-500",
          statusIndicator === "amber" && "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse",
          statusIndicator === "red" && "bg-red-500"
        )} />
      )}
    </NavLink>
  );
}
