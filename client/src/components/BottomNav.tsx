// ============================================================
// BOTTOM NAV — Navegação inferior mobile-first (4 abas)
// ============================================================
import { useLocation } from "wouter";
import { Home, CalendarDays, TrendingDown, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  active: "home" | "plano" | "peso" | "nutricao";
}

export default function BottomNav({ active }: BottomNavProps) {
  const [, navigate] = useLocation();

  const items = [
    { id: "home" as const,     label: "Hoje",    icon: Home,         path: "/" },
    { id: "plano" as const,    label: "Plano",   icon: CalendarDays, path: "/plano" },
    { id: "nutricao" as const, label: "Nutrição", icon: Utensils,    path: "/nutricao" },
    { id: "peso" as const,     label: "Peso",    icon: TrendingDown, path: "/peso" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 z-40">
      <div className="flex justify-around max-w-sm mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
              <span className="text-[10px] font-semibold uppercase tracking-wide">{item.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-blue-400 -mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
