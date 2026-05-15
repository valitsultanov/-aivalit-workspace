"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings } from "@/lib/types";
import { Check, Sparkles, Trash2 } from "lucide-react";
import { loadDemoData, resetAllData } from "@/lib/demo";

export default function SettingsPage() {
  const { settings, update } = useSettings();
  const [form, setForm] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  function handleChange(field: keyof Settings, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    update({ ...form, hourlyRate: Number(form.hourlyRate), dailyGoal: Number(form.dailyGoal) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDemo() {
    loadDemoData();
    setTimeout(() => window.location.href = "/", 100);
  }

  function handleReset() {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetAllData();
    setTimeout(() => window.location.href = "/", 100);
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-md">
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-sm text-muted-foreground mt-1">Персонализируй приложение под себя.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Профиль
          </h2>
          <div className="space-y-1.5">
            <Label htmlFor="user-name">Твоё имя</Label>
            <Input
              id="user-name"
              placeholder="Например: Алексей"
              value={form.userName}
              onChange={e => handleChange("userName", e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Денежный эквивалент
          </h2>
          <p className="text-xs text-muted-foreground -mt-2">
            Используется для подсчёта стоимости сэкономленного времени.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="currency">Валюта</Label>
              <Input
                id="currency" placeholder="$" maxLength={3}
                value={form.currency}
                onChange={e => handleChange("currency", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hourly-rate">Ставка в час</Label>
              <Input
                id="hourly-rate" type="number" min="0" step="1" placeholder="50"
                value={form.hourlyRate || ""}
                onChange={e => handleChange("hourlyRate", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Дневная цель
          </h2>
          <p className="text-xs text-muted-foreground -mt-2">
            Сколько часов в день ты хочешь экономить с AI. Отображается прогресс-бар на дашборде.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="daily-goal">Часов в день</Label>
            <Input
              id="daily-goal" type="number" min="0" step="0.5" placeholder="2"
              value={form.dailyGoal || ""}
              onChange={e => handleChange("dailyGoal", e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" className="w-full gap-2">
          {saved ? (<><Check className="h-4 w-4" />Сохранено</>) : "Сохранить настройки"}
        </Button>
      </form>

      {/* Demo + Reset */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Данные
        </h2>

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleDemo}
          >
            <Sparkles className="h-4 w-4 text-orange-500" />
            Загрузить демо-данные
          </Button>
          <p className="text-xs text-muted-foreground">
            14 дней задач, выбранная идея, опубликованный пост с реакциями. Текущие данные будут перезаписаны.
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <Button
            type="button"
            variant={confirmReset ? "destructive" : "ghost"}
            className="w-full gap-2"
            onClick={handleReset}
          >
            <Trash2 className="h-4 w-4" />
            {confirmReset ? "Точно? Это удалит всё" : "Сбросить все данные"}
          </Button>
          {confirmReset && (
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="text-xs text-muted-foreground hover:text-foreground w-full text-center"
            >
              Отмена
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
