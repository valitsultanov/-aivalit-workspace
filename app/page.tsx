"use client";

import { useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useTasks, useDailyNote, useSettings, useJourney } from "@/hooks/useStore";
import { AddTaskModal } from "@/components/AddTaskModal";
import { TaskRow } from "@/components/TaskRow";
import { DailyNoteSelector } from "@/components/DailyNoteSelector";
import {
  dailyStats, formatHours, dailyInsight, minutesToHours,
} from "@/lib/calculations";
import { todayISO } from "@/lib/utils";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JourneyStage } from "@/lib/types";

const JOURNEY_STEPS: { stage: JourneyStage; href: string; label: string; cta: string }[] = [
  { stage: "tracking", href: "/idea", label: "1. Трекинг", cta: "Найти идею →" },
  { stage: "idea", href: "/idea", label: "2. Идея", cta: "Выбрать идею →" },
  { stage: "build", href: "/build", label: "3. Строим", cta: "К задачам →" },
  { stage: "demand", href: "/demand", label: "4. Тест спроса", cta: "Проверить спрос →" },
  { stage: "sale", href: "/sale", label: "5. Первая продажа", cta: "Оформить продажу →" },
  { stage: "done", href: "/sale", label: "✓ Продано!", cta: "Посмотреть →" },
];

function JourneyBanner({ stage, totalSavedMinutes }: { stage: JourneyStage; totalSavedMinutes: number }) {
  const stepIndex = JOURNEY_STEPS.findIndex(s => s.stage === stage);
  const step = JOURNEY_STEPS[stepIndex] ?? JOURNEY_STEPS[0];
  const progress = ((stepIndex + 1) / JOURNEY_STEPS.length) * 100;

  const messages: Record<JourneyStage, string> = {
    tracking: `У тебя уже ${formatHours(totalSavedMinutes)} в запасе. Пора превратить это во что-то ценное.`,
    idea: "Найди продукт, который будешь продавать — это займёт 5 минут.",
    build: "Выполни 5 задач и продукт будет готов к тесту.",
    demand: "Пост готов. Опубликуй и посмотри, хотят ли люди платить.",
    sale: "Спрос подтверждён. Осталось получить деньги.",
    done: "Ты сделал первую продажу. Повтори.",
  };

  return (
    <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              Result Engine · {step.label}
            </span>
          </div>
          <p className="text-sm text-foreground">{messages[stage]}</p>
        </div>
        <Link href={step.href}>
          <Button size="sm" variant="outline" className="shrink-0 border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
            {step.cta}
          </Button>
        </Link>
      </div>
      {/* Journey progress dots */}
      <div className="flex items-center gap-1.5">
        {JOURNEY_STEPS.slice(0, 5).map((s, i) => (
          <div
            key={s.stage}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= stepIndex ? "bg-orange-500" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function DailyPage() {
  const today = todayISO();
  const { tasks, addTask, removeTask } = useTasks();
  const { note, saveNote } = useDailyNote(today);
  const { settings } = useSettings();
  const { journey } = useJourney();

  const todayTasks = useMemo(
    () => tasks.filter(t => t.date === today).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [tasks, today]
  );

  const allSavedMinutes = useMemo(
    () => tasks.reduce((s, t) => s + Math.max(0, t.timeWithoutAI - t.timeWithAI), 0),
    [tasks]
  );

  const stats = useMemo(() => dailyStats(todayTasks), [todayTasks]);
  const goalProgress = settings.dailyGoal > 0
    ? Math.min(minutesToHours(stats.totalSavedMinutes) / settings.dailyGoal, 1)
    : 0;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMMM d")}</p>
          <h1 className="text-2xl font-bold mt-0.5">
            {settings.userName ? `Привет, ${settings.userName}` : "Сегодня"}
          </h1>
        </div>
        <AddTaskModal onAdd={addTask} />
      </div>

      {/* Journey banner */}
      <JourneyBanner stage={journey.stage} totalSavedMinutes={allSavedMinutes} />

      {/* Hero stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="col-span-2 md:col-span-1 rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Сэкономлено сегодня</p>
          <p className="hero-number text-5xl font-bold text-orange-500">
            {formatHours(stats.totalSavedMinutes)}
          </p>
          {settings.dailyGoal > 0 && (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Цель дня</span>
                <span>{Math.round(goalProgress * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-500"
                  style={{ width: `${goalProgress * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">AI-ускорение</p>
          <p className="hero-number text-4xl font-bold text-foreground">
            {todayTasks.length > 0 ? `${stats.efficiencyRatio.toFixed(1)}x` : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">быстрее с AI</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Всего в запасе</p>
          <p className="hero-number text-4xl font-bold text-orange-400">
            {formatHours(allSavedMinutes)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">за всё время</p>
        </div>
      </div>

      {/* Insight */}
      {stats.totalSavedMinutes > 0 && (
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3">
          <p className="text-sm text-orange-300">
            {dailyInsight(stats.totalSavedMinutes, todayTasks.length)}
          </p>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Задачи сегодня
          </h2>
          {todayTasks.length > 0 && (
            <span className="text-xs text-muted-foreground">{todayTasks.length} задач</span>
          )}
        </div>

        {todayTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-12 text-center">
            <p className="text-muted-foreground text-sm">Задач ещё нет.</p>
            <p className="text-muted-foreground text-xs mt-1">
              Нажми <span className="text-orange-400">Add task</span> — залоггируй первую AI-задачу.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map(task => (
              <TaskRow key={task.id} task={task} onDelete={removeTask} />
            ))}
          </div>
        )}
      </div>

      {/* Daily note */}
      {todayTasks.length > 0 && (
        <DailyNoteSelector note={note} onSave={saveNote} date={today} />
      )}
    </div>
  );
}
