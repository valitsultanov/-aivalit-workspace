"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTasks, useJourney } from "@/hooks/useStore";
import { usePaywall } from "@/hooks/usePaywall";
import { Button } from "@/components/ui/button";
import { formatHours, minutesToHours, moneyValue } from "@/lib/calculations";
import { useSettings } from "@/hooks/useStore";
import { unlock } from "@/lib/paywall";
import { cn } from "@/lib/utils";
import {
  Clock, Lightbulb, Hammer, Radio, BadgeDollarSign,
  Check, Lock, ArrowRight, Zap, ChevronRight,
} from "lucide-react";
import { JourneyStage } from "@/lib/types";

const STAGE_ORDER: JourneyStage[] = ["tracking", "idea", "build", "demand", "sale", "done"];

function stageIdx(s: JourneyStage) { return STAGE_ORDER.indexOf(s); }

interface StageConfig {
  stage: JourneyStage;
  href: string;
  icon: React.ElementType;
  title: string;
  free: boolean;
  descDone: (data: StageData) => string;
  descTodo: string;
}

interface StageData {
  totalSaved: number;
  ideaName?: string;
  milestoneDone?: number;
  milestoneTotal?: number;
  reactions?: number;
  saleAmount?: number;
  currency?: string;
}

const STAGES: StageConfig[] = [
  {
    stage: "tracking",
    href: "/",
    icon: Clock,
    title: "Трекинг времени",
    free: true,
    descDone: d => `${formatHours(d.totalSaved)} сэкономлено — это твоё топливо`,
    descTodo: "Логгируй задачи с AI каждый день",
  },
  {
    stage: "idea",
    href: "/idea",
    icon: Lightbulb,
    title: "Идея продукта",
    free: false,
    descDone: d => d.ideaName ? `Выбрано: ${d.ideaName}` : "Идея найдена",
    descTodo: "5 вопросов → 3 готовые идеи под тебя",
  },
  {
    stage: "build",
    href: "/build",
    icon: Hammer,
    title: "Build Sprint",
    free: false,
    descDone: d => `${d.milestoneDone ?? 0} из ${d.milestoneTotal ?? 5} задач выполнено`,
    descTodo: "5 задач — от идеи до MVP за выходные",
  },
  {
    stage: "demand",
    href: "/demand",
    icon: Radio,
    title: "Тест спроса",
    free: false,
    descDone: d => `${d.reactions ?? 0} реакций${(d.reactions ?? 0) >= 10 ? " — спрос подтверждён!" : ""}`,
    descTodo: "Пост в соцсети → 10 реакций = подтверждённый спрос",
  },
  {
    stage: "sale",
    href: "/sale",
    icon: BadgeDollarSign,
    title: "Первая продажа",
    free: false,
    descDone: d => d.saleAmount ? `${d.currency}${d.saleAmount} получено — ты предприниматель` : "Скрипты и инструкция готовы",
    descTodo: "Скрипты + платёжная ссылка + закрытие первой сделки",
  },
];

export default function JourneyPage() {
  const { tasks } = useTasks();
  const { journey } = useJourney();
  const { settings } = useSettings();
  const { unlocked, unlock: doUnlock } = usePaywall();

  const totalSaved = useMemo(
    () => tasks.reduce((s, t) => s + Math.max(0, t.timeWithoutAI - t.timeWithAI), 0),
    [tasks]
  );

  const money = useMemo(
    () => moneyValue(totalSaved, settings.hourlyRate),
    [totalSaved, settings.hourlyRate]
  );

  const currentIdx = stageIdx(journey.stage);

  const stageData: StageData = {
    totalSaved,
    ideaName: journey.chosenIdea?.name,
    milestoneDone: journey.milestones.filter(m => m.completed).length,
    milestoneTotal: journey.milestones.length || 5,
    reactions: journey.demandPost
      ? journey.demandPost.likes + journey.demandPost.comments + journey.demandPost.dms
      : 0,
    saleAmount: journey.firstSale?.amount,
    currency: settings.currency || "$",
  };

  function getStageStatus(cfg: StageConfig): "done" | "active" | "next" | "locked" {
    const idx = stageIdx(cfg.stage);
    if (cfg.stage === "tracking" && totalSaved > 0) return "done";
    if (cfg.stage === "tracking") return "active";
    if (journey.stage === "done" && cfg.stage === "sale") return "done";
    if (idx < currentIdx) return "done";
    if (idx === currentIdx) return "active";
    if (idx === currentIdx + 1) return "next";
    return "locked";
  }

  const completedStages = STAGES.filter(s => getStageStatus(s) === "done").length;
  const overallProgress = (completedStages / STAGES.length) * 100;

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-lg">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Твой путь</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          От наёмного сотрудника до первой продажи
        </p>
      </div>

      {/* Time bank hero */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Time Bank</p>
            <p className="hero-number text-5xl font-bold text-orange-500">
              {formatHours(totalSaved)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              сэкономлено с AI за всё время
            </p>
          </div>
          {settings.hourlyRate > 0 && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Эквивалент</p>
              <p className="hero-number text-2xl font-bold text-foreground">
                {settings.currency}{Math.round(money)}
              </p>
            </div>
          )}
        </div>

        {/* Overall progress */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Прогресс пути</span>
            <span>{completedStages} из {STAGES.length} этапов</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stage cards */}
      <div className="space-y-3">
        {STAGES.map((cfg, i) => {
          const status = getStageStatus(cfg);
          const isLocked = !cfg.free && !unlocked && status !== "done";
          const Icon = cfg.icon;

          return (
            <div key={cfg.stage}>
              {/* Connector line */}
              {i > 0 && (
                <div className="flex justify-start ml-6 my-1">
                  <div className={cn("w-0.5 h-4", status === "done" ? "bg-orange-500/40" : "bg-border")} />
                </div>
              )}

              <Link
                href={isLocked ? "/journey" : cfg.href}
                onClick={isLocked ? (e) => e.preventDefault() : undefined}
                className={cn(
                  "flex items-start gap-4 rounded-xl border p-4 transition-all",
                  status === "active" && "border-orange-500/40 bg-orange-500/5 shadow-sm",
                  status === "done" && "border-border bg-card",
                  status === "next" && "border-border bg-card hover:border-orange-500/30",
                  status === "locked" && "border-border bg-card opacity-60",
                  !isLocked && status !== "locked" && "cursor-pointer hover:border-orange-500/30",
                  isLocked && "cursor-default"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2",
                  status === "done" && "border-orange-500 bg-orange-500/10",
                  status === "active" && "border-orange-500 bg-orange-500/20",
                  (status === "next" || status === "locked") && "border-border bg-muted",
                )}>
                  {status === "done"
                    ? <Check className="h-4 w-4 text-orange-500" />
                    : isLocked
                    ? <Lock className="h-4 w-4 text-muted-foreground" />
                    : <Icon className={cn("h-4 w-4", status === "active" ? "text-orange-500" : "text-muted-foreground")} />
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={cn(
                      "text-sm font-semibold",
                      status === "active" && "text-foreground",
                      status === "done" && "text-foreground",
                      (status === "next" || status === "locked") && "text-muted-foreground",
                    )}>
                      {cfg.title}
                    </p>
                    {cfg.free && (
                      <span className="text-xs rounded-full px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20">
                        Free
                      </span>
                    )}
                    {!cfg.free && !unlocked && status !== "done" && (
                      <span className="text-xs rounded-full px-2 py-0.5 bg-muted text-muted-foreground border border-border">
                        $49
                      </span>
                    )}
                    {status === "active" && (
                      <span className="text-xs rounded-full px-2 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        сейчас
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {status === "done"
                      ? cfg.descDone(stageData)
                      : cfg.descTodo
                    }
                  </p>
                </div>

                {/* Arrow */}
                {!isLocked && (status === "active" || status === "next" || status === "done") && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                )}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Paywall CTA if not unlocked */}
      {!unlocked && (
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <p className="font-semibold">Разблокировать полный путь</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Трекер — бесплатно навсегда. Idea Finder, Build Sprint, Тест спроса, Первая продажа — за $49 один раз.
          </p>
          <Button className="w-full" onClick={doUnlock}>
            Разблокировать за $49
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Если первый продукт продастся хотя бы за $50 — инструмент окупится в первый день.
          </p>
        </div>
      )}

      {/* Done state */}
      {journey.stage === "done" && journey.firstSale && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-5 text-center space-y-2">
          <p className="text-3xl">🏆</p>
          <p className="font-bold">Путь пройден!</p>
          <p className="text-sm text-muted-foreground">
            Первая продажа: <strong className="text-orange-400">{settings.currency}{journey.firstSale.amount}</strong>
          </p>
          <Link href="/sale">
            <Button variant="outline" size="sm" className="mt-2">
              Посмотреть детали <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
