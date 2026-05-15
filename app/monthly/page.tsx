"use client";

import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useTasks, useSettings } from "@/hooks/useStore";
import {
  monthRange,
  autonomyLevel,
  autonomyLabel,
  weeklyAutonomyData,
  moneyValue,
  formatHours,
} from "@/lib/calculations";

function AutonomyGauge({ level }: { level: number }) {
  const pct = (level / 3) * 100;
  const zones = [
    { label: "Using AI like Google", range: "0–1", color: "from-gray-500 to-blue-500" },
    { label: "Getting real results", range: "1–2", color: "from-blue-500 to-orange-400" },
    { label: "Directing AI systems", range: "2–3", color: "from-orange-400 to-orange-600" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <span className="hero-number text-5xl font-bold text-orange-500">
          {level.toFixed(2)}
        </span>
        <span className="text-muted-foreground text-lg mb-1">/ 3</span>
      </div>
      <p className="text-sm text-foreground font-medium">{autonomyLabel(level)}</p>

      {/* Track */}
      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-orange-400 to-orange-600 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
        {zones.map((z) => (
          <div key={z.range} className="text-center">
            <p>{z.range}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1 text-xs">
        {zones.map((z, i) => (
          <div key={z.range} className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                i === 0
                  ? "bg-blue-400"
                  : i === 1
                  ? "bg-orange-400"
                  : "bg-orange-600"
              }`}
            />
            <span
              className={
                (i === 0 && level < 1) ||
                (i === 1 && level >= 1 && level < 2) ||
                (i === 2 && level >= 2)
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }
            >
              {z.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-orange-400 mt-0.5">Level {payload[0].value.toFixed(2)}</p>
    </div>
  );
}

export default function MonthlyPage() {
  const { tasks } = useTasks();
  const { settings } = useSettings();

  const { start, end } = useMemo(() => monthRange(new Date()), []);

  const monthTasks = useMemo(
    () => tasks.filter((t) => t.date >= start && t.date <= end),
    [tasks, start, end]
  );

  const totalSavedMinutes = useMemo(
    () => monthTasks.reduce((s, t) => s + Math.max(0, t.timeWithoutAI - t.timeWithAI), 0),
    [monthTasks]
  );

  const level = useMemo(() => autonomyLevel(monthTasks), [monthTasks]);

  const chartData = useMemo(() => weeklyAutonomyData(tasks, start), [tasks, start]);

  const money = useMemo(
    () => moneyValue(totalSavedMinutes, settings.hourlyRate),
    [totalSavedMinutes, settings.hourlyRate]
  );

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <p className="text-sm text-muted-foreground">
          {format(parseISO(start), "MMMM yyyy")}
        </p>
        <h1 className="text-2xl font-bold mt-0.5">This Month</h1>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Total saved
          </p>
          <p className="hero-number text-4xl font-bold text-orange-500">
            {formatHours(totalSavedMinutes)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {monthTasks.length} tasks this month
          </p>
        </div>

        {settings.hourlyRate > 0 ? (
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
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-5 flex items-center justify-center">
            <p className="text-xs text-muted-foreground text-center">
              Set hourly rate in Settings to see money equivalent
            </p>
          </div>
        )}
      </div>

      {/* Autonomy Level */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
          AI Autonomy Level
        </p>
        {monthTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Log tasks this month to calculate your autonomy level.
          </p>
        ) : (
          <AutonomyGauge level={level} />
        )}
      </div>

      {/* Progress chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Autonomy level over time
        </h2>
        {monthTasks.length === 0 ? (
          <div className="h-40 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No data yet.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(210 12% 55%)", fontSize: 11 }}
              />
              <YAxis
                domain={[0, 3]}
                ticks={[0, 1, 2, 3]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(210 12% 55%)", fontSize: 11 }}
                width={20}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={1} stroke="hsl(222 15% 28%)" strokeDasharray="3 3" />
              <ReferenceLine y={2} stroke="hsl(222 15% 28%)" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="level"
                stroke="#F97316"
                strokeWidth={2}
                dot={{ fill: "#F97316", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* What each level means */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          What the levels mean
        </h2>
        {[
          { range: "0–1", title: "Using AI like Google", desc: "Tasks saving under 10 min each. AI is a search tool." },
          { range: "1–2", title: "Getting real results", desc: "Tasks saving 10–60 min each. AI is doing meaningful work." },
          { range: "2–3", title: "Directing AI systems", desc: "Tasks saving 60+ min regularly. AI is your leverage multiplier." },
        ].map((item) => (
          <div key={item.range} className="flex gap-3">
            <span className="text-orange-500 font-mono text-sm shrink-0 w-10">{item.range}</span>
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
