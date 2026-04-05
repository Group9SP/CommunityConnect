import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/browse", label: "Browse", icon: Search },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-card border-r flex flex-col items-center py-6 gap-4 z-40 transition-all duration-200",
        collapsed ? "w-12" : "w-48"
      )}
    >
      {/* Logo / app name */}
      <button
        onClick={() => { setCollapsed(c => !c); }}
        className={cn(
          "font-black text-primary transition-all duration-200 px-2 text-center leading-tight hover:opacity-70",
          collapsed ? "text-xs" : "text-sm"
        )}
      >
        {collapsed ? "CC" : "Community Connect"}
      </button>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 w-full px-2 mt-2">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            title={label}
            className={cn(
              "flex items-center gap-3 px-2 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors",
              pathname === to && "text-primary bg-muted",
              collapsed && "justify-center"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="text-sm">{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Collapse toggle at bottom */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="mt-auto p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
