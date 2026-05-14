"use client";

import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTasks, useSettings } from "@/hooks/useStore";
import {
  weekRange,
  weeklyBarData,
  streakCount,
  moneyValue,
  formatHours,
  minutesToHours,
} from "@/lib/calculations";
import { todayISO } from "@/lib/utils";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-orange-400 mt-0.5">{payload[0].value}m saved</p>
    </div>
  );
}

export default function WeeklyPage() {
  const today = todayISO();
  const { tasks } = useTasks();
  const { settings } = useSettings();

  const { start, end } = useMemo(() => weekRange(new Date()), []);

  const weekTasks = useMemo(
    () => tasks.filter((t) => t.date >= start && t.date <= end),
    [tasks, start, end]
  );

  const totalSavedMinutes = useMemo(
    () => weekTasks.reduce((s, t) => s + Math.max(0, t.timeWithoutAI - t.timeWithAI), 0),
    [weekTasks]
  );

  const barData = useMemo(() => weeklyBarData(tasks, start), [tasks, start]);

  const streak = useMemo(() => streakCount(tasks, today), [tasks, today]);

  const money = useMemo(
    () => moneyValue(totalSavedMinutes, settings.hourlyRate),
    [totalSavedMinutes, settings.hourlyRate]
  );

  const maxSavedDay = useMemo(
    () => barData.reduce((max, d) => (d.saved > max ? d.saved : max), 0),
    [barData]
  );

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <p className="text-sm text-muted-foreground">
          {format(parseISO(start), "MMM d")} – {format(parseISO(end), "MMM d, yyyy")}
        </p>
        <h1 className="text-2xl font-bold mt-0.5">This Week</h1>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="col-span-2 md:col-span-1 rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Total saved
          </p>
          <p className="hero-number text-5xl font-bold text-orange-500">
            {formatHours(totalSavedMinutes)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {weekTasks.length} tasks this week
          </p>
        </div>

        {settings.hourlyRate > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Money equivalent
            </p>
            <p className="hero-number text-4xl font-bold text-foreground">
              {settings.currency}{Math.round(money).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              at {settings.currency}{settings.hourlyRate}/hr
            </p>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Streak
          </p>
          <p className="hero-number text-4xl font-bold text-foreground">
            {streak}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {streak === 1 ? "day in a row" : "days in a row"}
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Saved time per day (minutes)
        </h2>
        {weekTasks.length === 0 ? (
          <div className="h-40 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No data for this week yet.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} barCategoryGap="30%">
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(210 12% 55%)", fontSize: 12 }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="saved" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.date === today
                        ? "#F97316"
                        : entry.saved === maxSavedDay && entry.saved > 0
                        ? "#EA6C0A"
                        : "hsl(222 15% 28%)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Daily breakdown */}
      {weekTasks.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Daily breakdown
          </h2>
          {barData
            .filter((d) => d.saved > 0)
            .map((d) => (
              <div
                key={d.date}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {format(parseISO(d.date), "EEEE")}
                    {d.date === today && (
                      <span className="ml-2 text-xs text-orange-400">today</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(d.date), "MMM d")}
                  </p>
                </div>
                <p className="text-sm font-semibold text-orange-400">
                  +{formatHours(d.saved)}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
