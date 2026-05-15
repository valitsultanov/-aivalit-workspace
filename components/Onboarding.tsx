"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task } from "@/lib/types";
import { saveSettings, getSettings, markOnboarded } from "@/lib/storage";
import { loadDemoData } from "@/lib/demo";
import { generateId, todayISO } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ArrowRight, Clock, Zap, TrendingUp, DollarSign, Plus } from "lucide-react";

interface Props {
  onComplete: (firstTask?: Task) => void;
}

const CATEGORIES = [
  { value: "Deep work", label: "Глубокая работа", example: "анализ, написание, исследование" },
  { value: "Routine", label: "Рутина", example: "отчёты, переписка, таблицы" },
  { value: "Creative", label: "Творческое", example: "идеи, презентации, контент" },
  { value: "Communication", label: "Коммуникация", example: "письма, встречи, резюме" },
] as const;

type Step = 0 | 1 | 2;

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState<Step>(0);

  // Step 1 — setup
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");

  // Step 2 — first task
  const [taskName, setTaskName] = useState("");
  const [withAI, setWithAI] = useState("");
  const [withoutAI, setWithoutAI] = useState("");
  const [category, setCategory] = useState<"Deep work" | "Routine" | "Creative" | "Communication">("Routine");
  const [taskError, setTaskError] = useState("");

  function handleSetupNext() {
    const s = getSettings();
    saveSettings({
      ...s,
      userName: name.trim(),
      hourlyRate: parseFloat(rate) || 0,
    });
    setStep(2);
  }

  function handleTaskSubmit() {
    const ai = parseInt(withAI, 10);
    const noAI = parseInt(withoutAI, 10);
    if (!taskName.trim()) { setTaskError("Введи название задачи"); return; }
    if (isNaN(ai) || ai < 0) { setTaskError("Время с AI — число минут"); return; }
    if (isNaN(noAI) || noAI < 0) { setTaskError("Время без AI — число минут"); return; }

    const task: Task = {
      id: generateId(),
      name: taskName.trim(),
      timeWithAI: ai,
      timeWithoutAI: noAI,
      category,
      date: todayISO(),
      createdAt: new Date().toISOString(),
    };
    markOnboarded();
    onComplete(task);
  }

  function skipTask() {
    markOnboarded();
    onComplete();
  }

  const saved = parseInt(withoutAI || "0") - parseInt(withAI || "0");

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Step 0 — Hook */}
        {step === 0 && (
          <div className="space-y-8 text-center">
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                  <Zap className="h-7 w-7 text-orange-500" fill="currentColor" />
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Куда уходит<br />время, которое<br />
                <span className="text-orange-500">AI вернул тебе?</span>
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
                Ты уже быстрее работаешь с AI. Но сэкономленные часы исчезают в пустоту.
                <br /><br />
                AIValit превращает твоё сэкономленное время в продукт, который ты продашь.
              </p>
            </div>

            {/* Journey visual */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Clock, label: "Трекай время", sub: "Логгируй задачи с AI", color: "bg-blue-500/10 text-blue-400" },
                { icon: TrendingUp, label: "Строй продукт", sub: "Используй свободные часы", color: "bg-orange-500/10 text-orange-400" },
                { icon: DollarSign, label: "Получи оплату", sub: "Первая продажа за 2 недели", color: "bg-green-500/10 text-green-400" },
              ].map(({ icon: Icon, label, sub, color }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-3 text-center space-y-2">
                  <div className={cn("h-8 w-8 rounded-lg mx-auto flex items-center justify-center", color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{sub}</p>
                </div>
              ))}
            </div>

            <Button className="w-full" size="lg" onClick={() => setStep(1)}>
              Начать с нуля <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              onClick={() => { loadDemoData(); onComplete(); }}
            >
              ✨ Посмотреть с примером данных
            </Button>
            <button onClick={skipTask} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Пропустить →
            </button>
          </div>
        )}

        {/* Step 1 — Setup */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Шаг 1 из 2</p>
              <h2 className="text-2xl font-bold">Быстрая настройка</h2>
              <p className="text-sm text-muted-foreground">30 секунд — и приложение настроено под тебя</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ob-name">Как тебя зовут?</Label>
                <Input
                  id="ob-name"
                  placeholder="Например: Алексей"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ob-rate">
                  Сколько ты зарабатываешь в час?
                  <span className="text-muted-foreground font-normal"> (не обязательно)</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="ob-rate"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="pl-7"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Используется чтобы показать денежный эквивалент сэкономленного времени
                </p>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleSetupNext}>
              Далее <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Step 2 — First task */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Шаг 2 из 2</p>
              <h2 className="text-2xl font-bold">Первая задача</h2>
              <p className="text-sm text-muted-foreground">
                Залоггируй одну задачу, которую ты сделал сегодня с AI
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Что ты делал с AI?</Label>
                <Input
                  placeholder="Например: написал отчёт, ответил на письма"
                  value={taskName}
                  onChange={e => { setTaskName(e.target.value); setTaskError(""); }}
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>
                    С AI <span className="text-muted-foreground font-normal">(минут)</span>
                  </Label>
                  <Input
                    type="number" min="0" placeholder="15"
                    value={withAI}
                    onChange={e => { setWithAI(e.target.value); setTaskError(""); }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>
                    Без AI <span className="text-muted-foreground font-normal">(минут)</span>
                  </Label>
                  <Input
                    type="number" min="0" placeholder="60"
                    value={withoutAI}
                    onChange={e => { setWithoutAI(e.target.value); setTaskError(""); }}
                  />
                </div>
              </div>

              {/* Live saving preview */}
              {saved > 0 && (
                <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-2 flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                  <p className="text-sm text-orange-300">
                    Ты сэкономил <strong>{saved} минут</strong> на этой задаче
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Тип задачи</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      className={cn(
                        "rounded-lg border p-2.5 text-left text-xs transition-colors",
                        category === c.value
                          ? "border-orange-500 bg-orange-500/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      )}
                    >
                      <p className="font-medium">{c.label}</p>
                      <p className="text-muted-foreground mt-0.5 text-[10px]">{c.example}</p>
                    </button>
                  ))}
                </div>
              </div>

              {taskError && <p className="text-sm text-red-400">{taskError}</p>}
            </div>

            <Button className="w-full" size="lg" onClick={handleTaskSubmit}>
              <Plus className="h-4 w-4 mr-1" />
              Сохранить и открыть дашборд
            </Button>
            <button onClick={skipTask} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center">
              Добавлю позже →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
