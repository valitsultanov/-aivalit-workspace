import { Task, DailyStats } from "./types";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parseISO,
  isValid,
} from "date-fns";

export function taskSavedMinutes(task: Task): number {
  return Math.max(0, task.timeWithoutAI - task.timeWithAI);
}

export function taskEfficiencyRatio(task: Task): number {
  if (task.timeWithAI === 0) return task.timeWithoutAI > 0 ? 99 : 1;
  return task.timeWithoutAI / task.timeWithAI;
}

export function minutesToHours(minutes: number): number {
  return minutes / 60;
}

export function formatHours(minutes: number): string {
  const h = minutesToHours(minutes);
  if (h < 1) return `${Math.round(minutes)}m`;
  return `${h.toFixed(1)}h`;
}

export function dailyStats(tasks: Task[]): DailyStats {
  if (tasks.length === 0) {
    return { date: "", totalSavedMinutes: 0, taskCount: 0, efficiencyRatio: 1 };
  }
  const totalSaved = tasks.reduce((s, t) => s + taskSavedMinutes(t), 0);
  const totalWithAI = tasks.reduce((s, t) => s + t.timeWithAI, 0);
  const totalWithout = tasks.reduce((s, t) => s + t.timeWithoutAI, 0);
  const ratio = totalWithAI === 0 ? 1 : totalWithout / totalWithAI;
  return {
    date: tasks[0].date,
    totalSavedMinutes: totalSaved,
    taskCount: tasks.length,
    efficiencyRatio: ratio,
  };
}

export function weekRange(date: Date): { start: string; end: string } {
  return {
    start: format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd"),
    end: format(endOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd"),
  };
}

export function monthRange(date: Date): { start: string; end: string } {
  return {
    start: format(startOfMonth(date), "yyyy-MM-dd"),
    end: format(endOfMonth(date), "yyyy-MM-dd"),
  };
}

export function weeklyBarData(
  tasks: Task[],
  weekStart: string
): { day: string; saved: number; date: string }[] {
  const start = parseISO(weekStart);
  if (!isValid(start)) return [];
  const days = eachDayOfInterval({
    start,
    end: endOfWeek(start, { weekStartsOn: 1 }),
  });
  return days.map((d) => {
    const dateStr = format(d, "yyyy-MM-dd");
    const dayTasks = tasks.filter((t) => t.date === dateStr);
    const saved = dayTasks.reduce((s, t) => s + taskSavedMinutes(t), 0);
    return { day: format(d, "EEE"), saved: Math.round(saved), date: dateStr };
  });
}

export function streakCount(tasks: Task[], today: string): number {
  const datesWithTasks = new Set(tasks.map((t) => t.date));
  let streak = 0;
  let cursor = parseISO(today);
  while (true) {
    const dateStr = format(cursor, "yyyy-MM-dd");
    if (!datesWithTasks.has(dateStr)) break;
    streak++;
    cursor = new Date(cursor.getTime() - 86400000);
  }
  return streak;
}

// AI Autonomy Level 0–3
// Based on average time saved per task this month
export function autonomyLevel(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const avgSaved =
    tasks.reduce((s, t) => s + taskSavedMinutes(t), 0) / tasks.length;

  if (avgSaved < 10) {
    return (avgSaved / 10) * 1;
  } else if (avgSaved < 60) {
    return 1 + ((avgSaved - 10) / 50) * 1;
  } else {
    return 2 + Math.min((avgSaved - 60) / 60, 1);
  }
}

export function autonomyLabel(level: number): string {
  if (level < 1) return "Using AI like Google";
  if (level < 2) return "Getting real results";
  return "Directing AI systems";
}

// Weekly autonomy snapshots for monthly progress chart
export function weeklyAutonomyData(
  tasks: Task[],
  monthStart: string
): { week: string; level: number }[] {
  const start = parseISO(monthStart);
  if (!isValid(start)) return [];
  const results: { week: string; level: number }[] = [];
  let cursor = startOfWeek(start, { weekStartsOn: 1 });
  const end = endOfMonth(start);
  while (cursor <= end) {
    const weekStartStr = format(cursor, "yyyy-MM-dd");
    const weekEndStr = format(
      endOfWeek(cursor, { weekStartsOn: 1 }),
      "yyyy-MM-dd"
    );
    const weekTasks = tasks.filter(
      (t) => t.date >= weekStartStr && t.date <= weekEndStr
    );
    results.push({
      week: format(cursor, "MMM d"),
      level: Math.round(autonomyLevel(weekTasks) * 100) / 100,
    });
    cursor = new Date(cursor.getTime() + 7 * 86400000);
  }
  return results;
}

export function moneyValue(savedMinutes: number, hourlyRate: number): number {
  return (savedMinutes / 60) * hourlyRate;
}

export function dailyInsight(savedMinutes: number, taskCount: number): string {
  const h = minutesToHours(savedMinutes);
  if (savedMinutes === 0) return "No tasks logged yet today. Add your first AI-assisted task.";
  const taskRef =
    taskCount === 1
      ? "1 task you didn't have to do manually"
      : `${taskCount} tasks you didn't have to do manually`;
  return `You saved ${formatHours(savedMinutes)} today. That's ${taskRef}.`;
}
