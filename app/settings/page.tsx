"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings } from "@/lib/types";
import { Check } from "lucide-react";

export default function SettingsPage() {
  const { settings, update } = useSettings();
  const [form, setForm] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function handleChange(field: keyof Settings, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    update({
      ...form,
      hourlyRate: Number(form.hourlyRate),
      dailyGoal: Number(form.dailyGoal),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-md">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personalize your productivity tracker.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Profile
          </h2>

          <div className="space-y-1.5">
            <Label htmlFor="user-name">Your name</Label>
            <Input
              id="user-name"
              placeholder="e.g. Alex"
              value={form.userName}
              onChange={(e) => handleChange("userName", e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Money value
          </h2>
          <p className="text-xs text-muted-foreground -mt-2">
            Used to calculate how much your saved time is worth each week and month.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency symbol</Label>
              <Input
                id="currency"
                placeholder="$"
                maxLength={3}
                value={form.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hourly-rate">Hourly rate</Label>
              <Input
                id="hourly-rate"
                type="number"
                min="0"
                step="1"
                placeholder="50"
                value={form.hourlyRate || ""}
                onChange={(e) => handleChange("hourlyRate", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Daily goal
          </h2>
          <p className="text-xs text-muted-foreground -mt-2">
            Target hours of AI-saved time per day. Shows a progress bar on the dashboard.
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="daily-goal">Hours to save per day</Label>
            <Input
              id="daily-goal"
              type="number"
              min="0"
              step="0.5"
              placeholder="2"
              value={form.dailyGoal || ""}
              onChange={(e) => handleChange("dailyGoal", e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" className="w-full gap-2">
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            "Save settings"
          )}
        </Button>
      </form>
    </div>
  );
}
