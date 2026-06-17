import { Link, useRouterState } from "@tanstack/react-router";
import { Trees, Target, Users, BookOpen, ClipboardCheck, Sun, Moon } from "lucide-react";
import type { ReactNode } from "react";
import { useTheme } from "@/lib/theme";

const NAV = [
  { to: "/", label: "My Forest", icon: Trees },
  { to: "/check-in", label: "Check-In", icon: ClipboardCheck },
  { to: "/missions", label: "Challenges", icon: Target },
  { to: "/community", label: "Community", icon: Users },
  { to: "/story", label: "Story", icon: BookOpen },
] as const;

export function AppShell({ children, level }: { children: ReactNode; level?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const isNight = theme === "night";

  return (
    <div className="min-h-screen bg-cream text-stone-900 transition-colors duration-500 dark:text-sage-soft">
      <nav className="sticky top-0 z-40 border-b border-stone-100 bg-cream/85 backdrop-blur-md dark:border-white/5 dark:bg-cream/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <div className="grid size-10 place-items-center rounded-xl bg-forest shadow-lg shadow-forest/20">
              <div className="size-4 animate-pulse-soft rounded-full bg-sage" />
            </div>
            <span className="text-xl font-bold tracking-tight text-forest">Carbon Tree</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-sage-soft text-forest" : "text-stone-500 hover:text-forest dark:text-stone-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {level && (
              <div className="hidden rounded-full border border-sage/40 bg-sage/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-forest sm:block">
                {level}
              </div>
            )}
            <button
              onClick={toggle}
              aria-label={isNight ? "Switch to day" : "Switch to night"}
              className="grid size-9 place-items-center rounded-full border border-stone-200 bg-white/70 text-forest transition-transform hover:scale-105 dark:border-white/10 dark:bg-white/5"
            >
              {isNight ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <div className="grid size-9 place-items-center rounded-full bg-bloom-soft text-sm font-bold text-forest">
              E
            </div>
          </div>
        </div>
      </nav>

      {children}

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-sm items-center justify-around rounded-2xl border border-white/60 bg-white/85 px-2 py-2 shadow-eco backdrop-blur-md dark:border-white/10 dark:bg-white/5 md:hidden">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 ${
                active ? "text-forest" : "text-stone-400 dark:text-stone-500"
              }`}
            >
              <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
