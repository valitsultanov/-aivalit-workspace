"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { useTasks, useDailyNote, useSettings } from "@/hooks/useStore";
import { AddTaskModal } from "@/components/AddTaskModal";
import { TaskRow } from "@/components/TaskRow";
import { DailyNoteSelector } from "@/components/DailyNoteSelector";
import {
  taskSavedMinutes,
  dailyStats,
  formatHours,
  dailyInsight,
  minutesToHours,
} from "@/lib/calculations";
import { todayISO } from "@/lib/utils";

export default function DailyPage() {
  const today = todayISO();
  const { tasks, addTask, removeTask } = useTasks();
  const { note, saveNote } = useDailyNote(today);
  const { settings } = useSettings();

  const todayTasks = useMemo(
    () => tasks.filter((t) => t.date === today).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [tasks, today]
  );

  const stats = useMemo(() => dailyStats(todayTasks), [todayTasks]);

  const savedHours = minutesToHours(stats.totalSavedMinutes);
  const goalProgress = settings.dailyGoal > 0 ? Math.min(savedHours / settings.dailyGoal, 1) : 0;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d")}
          </p>
          <h1 className="text-2xl font-bold mt-0.5">Today</h1>
        </div>
        <AddTaskModal onAdd={addTask} />
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="col-span-2 md:col-span-1 rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Time saved
          </p>
          <p className="hero-number text-5xl font-bold text-orange-500">
            {formatHours(stats.totalSavedMinutes)}
          </p>
          {settings.dailyGoal > 0 && (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Daily goal</span>
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
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Efficiency ratio
          </p>
          <p className="hero-number text-4xl font-bold text-foreground">
            {todayTasks.length > 0 ? `${stats.efficiencyRatio.toFixed(1)}x` : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            faster with AI
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Tasks logged
          </p>
          <p className="hero-number text-4xl font-bold text-foreground">
            {todayTasks.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {todayTasks.length === 1 ? "task today" : "tasks today"}
          </p>
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
            Tasks
          </h2>
          {todayTasks.length > 0 && (
            <span className="text-xs text-muted-foreground">{todayTasks.length} logged</span>
          )}
        </div>

        {todayTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-12 text-center">
            <p className="text-muted-foreground text-sm">No tasks yet today.</p>
            <p className="text-muted-foreground text-xs mt-1">
              Click <span className="text-orange-400">Add task</span> to log your first AI-assisted task.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => (
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
