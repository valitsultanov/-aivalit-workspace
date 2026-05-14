"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Calendar, Settings, Zap, Lightbulb, Hammer, Radio, BadgeDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useJourney } from "@/hooks/useStore";
import { JourneyStage } from "@/lib/types";

const STAGE_ORDER: JourneyStage[] = ["tracking", "idea", "build", "demand", "sale", "done"];

function stageIndex(s: JourneyStage) { return STAGE_ORDER.indexOf(s); }

const TOP_LINKS = [
  { href: "/", label: "Сегодня", icon: Calendar },
  { href: "/weekly", label: "Неделя", icon: BarChart2 },
];

const JOURNEY_LINKS = [
  { href: "/idea", label: "Идея", icon: Lightbulb, unlocksAt: 0 },
  { href: "/build", label: "Строим", icon: Hammer, unlocksAt: 1 },
  { href: "/demand", label: "Тест спроса", icon: Radio, unlocksAt: 2 },
  { href: "/sale", label: "Первая продажа", icon: BadgeDollarSign, unlocksAt: 3 },
];

export function Navigation() {
  const pathname = usePathname();
  const { journey } = useJourney();
  const currentStageIdx = stageIndex(journey.stage);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 flex-col border-r border-border bg-card px-4 py-6">
        <div className="flex items-center gap-2 mb-6 px-2">
          <Zap className="h-5 w-5 text-orange-500" fill="currentColor" />
          <span className="font-semibold text-sm tracking-tight">AIValit</span>
        </div>

        {/* Top links */}
        <nav className="flex flex-col gap-1 mb-4">
          {TOP_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                pathname === href
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", pathname === href && "text-orange-500")} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Journey section */}
        <div className="mb-2 px-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Путь к продаже</p>
        </div>
        <nav className="flex flex-col gap-1 mb-auto">
          {JOURNEY_LINKS.map(({ href, label, icon: Icon, unlocksAt }, i) => {
            const unlocked = currentStageIdx >= unlocksAt;
            const done = currentStageIdx > unlocksAt;
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={unlocked ? href : "#"}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active ? "bg-muted text-foreground font-medium"
                    : unlocked ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                    : "text-muted-foreground/30 cursor-not-allowed pointer-events-none"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  active ? "text-orange-500"
                    : done ? "text-orange-500/50"
                    : ""
                )} />
                <span>{label}</span>
                {done && !active && (
                  <span className="ml-auto text-xs text-orange-500/60">✓</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors mt-2",
            pathname === "/settings"
              ? "bg-muted text-foreground font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className={cn("h-4 w-4", pathname === "/settings" && "text-orange-500")} />
          Настройки
        </Link>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-card px-1 py-1">
        {[
          { href: "/", icon: Calendar, label: "Сегодня" },
          { href: "/idea", icon: Lightbulb, label: "Идея" },
          { href: "/build", icon: Hammer, label: "Строим" },
          { href: "/demand", icon: Radio, label: "Спрос" },
          { href: "/sale", icon: BadgeDollarSign, label: "Продажа" },
          { href: "/settings", icon: Settings, label: "⚙" },
        ].map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[10px] transition-colors",
              pathname === href ? "text-orange-500" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
