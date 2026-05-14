"use client";

import { useRouter } from "next/navigation";
import { useJourney, useTasks } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { BuildMilestone } from "@/lib/types";
import { formatHours } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Clock, Lock, Zap } from "lucide-react";

export default function BuildPage() {
  const router = useRouter();
  const { journey, patch } = useJourney();
  const { tasks } = useTasks();

  const totalSavedMinutes = tasks.reduce(
    (s, t) => s + Math.max(0, t.timeWithoutAI - t.timeWithAI), 0
  );
  const timeBankHours = totalSavedMinutes / 60;

  if (!journey.chosenIdea) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <p className="text-muted-foreground">Сначала выбери продукт.</p>
        <Button onClick={() => router.push("/idea")}>Найти идею</Button>
      </div>
    );
  }

  const milestones = journey.milestones;
  const completedCount = milestones.filter(m => m.completed).length;
  const totalHours = milestones.reduce((s, m) => s + m.hours, 0);
  const doneHours = milestones.filter(m => m.completed).reduce((s, m) => s + m.hours, 0);
  const allDone = completedCount === milestones.length;

  function toggleMilestone(id: string) {
    const updated = milestones.map(m =>
      m.id === id
        ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined }
        : m
    );
    patch({ milestones: updated });
  }

  function goToDemand() {
    if (journey.stage === "build") patch({ stage: "demand" });
    router.push("/demand");
  }

  const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-lg">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">Строим продукт</p>
        <h1 className="text-2xl font-bold">{journey.chosenIdea.name}</h1>
        <p className="text-orange-400 text-sm mt-0.5">{journey.chosenIdea.tagline}</p>
      </div>

      {/* Time Bank */}
      <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
          <Clock className="h-5 w-5 text-orange-500" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Твой запас времени</p>
          <p className="hero-number text-2xl font-bold text-orange-500">{formatHours(totalSavedMinutes)}</p>
          <p className="text-xs text-muted-foreground">сэкономлено с AI — используй на продукт</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-semibold">{doneHours.toFixed(1)}ч</p>
          <p className="text-xs text-muted-foreground">вложено</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{completedCount} из {milestones.length} задач</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        {milestones.map((m, i) => {
          const unlocked = i === 0 || milestones[i - 1].completed;
          return (
            <MilestoneCard
              key={m.id}
              milestone={m}
              index={i}
              unlocked={unlocked}
              onToggle={() => unlocked && toggleMilestone(m.id)}
            />
          );
        })}
      </div>

      {/* Insight when 2+ done */}
      {completedCount >= 2 && !allDone && (
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3">
          <p className="text-sm text-orange-300">
            Уже {completedCount} задачи готовы. Ты быстрее, чем думал. Продолжай.
          </p>
        </div>
      )}

      {/* CTA to demand */}
      {completedCount >= 2 && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold">Время проверить спрос</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Не жди полной готовности. Пост для теста спроса уже сгенерирован — опубликуй и узнай, нужно ли это людям.
          </p>
          <Button className="w-full" onClick={goToDemand}>
            Тест спроса <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {allDone && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-5 text-center space-y-2">
          <p className="text-2xl">🎉</p>
          <p className="font-semibold">Все задачи выполнены!</p>
          <p className="text-sm text-muted-foreground">Пора проверить спрос и получить первые деньги.</p>
          <Button className="w-full mt-2" onClick={goToDemand}>
            Тест спроса <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

function MilestoneCard({
  milestone, index, unlocked, onToggle,
}: {
  milestone: BuildMilestone;
  index: number;
  unlocked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "rounded-xl border p-4 transition-colors",
        milestone.completed
          ? "border-orange-500/30 bg-orange-500/5"
          : unlocked
          ? "border-border bg-card hover:border-orange-500/40 cursor-pointer"
          : "border-border bg-card opacity-40"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
          milestone.completed
            ? "border-orange-500 bg-orange-500"
            : unlocked
            ? "border-border"
            : "border-border"
        )}>
          {milestone.completed && <Check className="h-3 w-3 text-white" />}
          {!unlocked && !milestone.completed && <Lock className="h-2.5 w-2.5 text-muted-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={cn("text-sm font-medium", milestone.completed && "line-through text-muted-foreground")}>
              {milestone.title}
            </p>
            <span className="text-xs text-muted-foreground">{milestone.hours}ч</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{milestone.description}</p>
          {milestone.completedAt && (
            <p className="text-xs text-orange-400 mt-1">
              ✓ {new Date(milestone.completedAt).toLocaleDateString("ru")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
