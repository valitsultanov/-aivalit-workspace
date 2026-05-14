"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJourney, useTasks } from "@/hooks/useStore";
import { generateIdeas, generateMilestones, generatePostContent } from "@/lib/ideas";
import { IdeaAnswers, ProductIdea } from "@/lib/types";
import { formatHours, minutesToHours } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Clock, Zap } from "lucide-react";

const STEPS = 5;

const AUDIENCES = [
  { value: "colleagues", label: "Коллеги / наёмные" },
  { value: "freelancers", label: "Фрилансеры" },
  { value: "small businesses", label: "Малый бизнес" },
  { value: "students", label: "Студенты" },
] as const;

const PRICES = [
  { value: "$10-50", label: "$10–50", sub: "Простой цифровой продукт" },
  { value: "$50-200", label: "$50–200", sub: "Полноценный инструмент" },
  { value: "$200-1000", label: "$200–1000", sub: "Сервис или воркшоп" },
] as const;

const HOURS = [
  { value: "2", label: "2 часа / нед", sub: "Минимум — только выходные" },
  { value: "5", label: "5 часов / нед", sub: "По вечерам + выходные" },
  { value: "10+", label: "10+ часов / нед", sub: "Серьёзный старт" },
] as const;

type AudienceVal = typeof AUDIENCES[number]["value"];
type PriceVal = typeof PRICES[number]["value"];
type HoursVal = typeof HOURS[number]["value"];

function FormatBadge({ format }: { format: ProductIdea["format"] }) {
  const MAP: Record<string, string> = {
    guide: "Гайд",
    templates: "Шаблоны",
    service: "Услуга",
    workshop: "Воркшоп",
    newsletter: "Рассылка",
  };
  return (
    <span className="text-xs rounded-full px-2 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20">
      {MAP[format]}
    </span>
  );
}

export default function IdeaPage() {
  const router = useRouter();
  const { journey, patch } = useJourney();
  const { tasks } = useTasks();

  const totalSavedMinutes = tasks.reduce(
    (s, t) => s + Math.max(0, t.timeWithoutAI - t.timeWithAI), 0
  );

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<IdeaAnswers>>({
    jobTitle: "",
    aiSuperpower: "",
  });
  const [ideas, setIdeas] = useState<ProductIdea[]>([]);
  const [chosen, setChosen] = useState<ProductIdea | null>(null);

  // If idea already chosen, show it
  if (journey.chosenIdea && step === 0 && ideas.length === 0) {
    return <AlreadyChosen idea={journey.chosenIdea} onReset={() => patch({ chosenIdea: null, milestones: [], stage: "idea", demandPost: null })} onContinue={() => router.push("/build")} />;
  }

  function next() { setStep(s => Math.min(s + 1, STEPS)); }
  function back() { setStep(s => Math.max(s - 1, 0)); }

  function handleGenerate() {
    const full = answers as IdeaAnswers;
    const generated = generateIdeas(full);
    setIdeas(generated);
    next();
  }

  function handleChoose(idea: ProductIdea) {
    setChosen(idea);
    const milestones = generateMilestones(idea);
    const postContent = generatePostContent(idea);
    patch({
      stage: "build",
      ideaAnswers: answers as IdeaAnswers,
      chosenIdea: idea,
      milestones,
      demandPost: {
        content: postContent,
        platform: "",
        postedAt: null,
        likes: 0,
        comments: 0,
        dms: 0,
      },
    });
    router.push("/build");
  }

  const progress = ((step) / (STEPS - 1)) * 100;

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-lg">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Clock className="h-3.5 w-3.5" />
          <span>Твой запас времени: <strong className="text-orange-400">{formatHours(totalSavedMinutes)}</strong></span>
        </div>
        <h1 className="text-2xl font-bold">Найдём твой продукт</h1>
        <p className="text-muted-foreground text-sm mt-1">5 вопросов — 3 идеи, которые реально продаются</p>
      </div>

      {/* Progress */}
      {step < STEPS && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Шаг {step + 1} из {STEPS}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Steps */}
      {step === 0 && (
        <StepCard
          title="Кем ты работаешь?"
          subtitle="Должность или то, чем занимаешься каждый день"
        >
          <Input
            placeholder="Например: маркетолог, разработчик, менеджер проектов"
            value={answers.jobTitle}
            onChange={e => setAnswers(a => ({ ...a, jobTitle: e.target.value }))}
            autoFocus
          />
          <Button className="w-full mt-4" disabled={!answers.jobTitle?.trim()} onClick={next}>
            Далее <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </StepCard>
      )}

      {step === 1 && (
        <StepCard
          title="Что ты теперь делаешь быстрее с AI?"
          subtitle="Одна задача, которая раньше занимала часы"
        >
          <Input
            placeholder="Например: пишу отчёты, готовлю презентации, отвечаю на письма"
            value={answers.aiSuperpower}
            onChange={e => setAnswers(a => ({ ...a, aiSuperpower: e.target.value }))}
            autoFocus
          />
          <Button className="w-full mt-4" disabled={!answers.aiSuperpower?.trim()} onClick={next}>
            Далее <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </StepCard>
      )}

      {step === 2 && (
        <StepCard
          title="Кому ещё нужно то, что ты умеешь?"
          subtitle="Твоя первая аудитория"
        >
          <div className="grid grid-cols-2 gap-2 mt-2">
            {AUDIENCES.map(a => (
              <button
                key={a.value}
                onClick={() => { setAnswers(prev => ({ ...prev, targetAudience: a.value as AudienceVal })); }}
                className={cn(
                  "rounded-lg border p-3 text-sm text-left transition-colors",
                  answers.targetAudience === a.value
                    ? "border-orange-500 bg-orange-500/10 text-foreground"
                    : "border-border hover:border-muted-foreground text-muted-foreground"
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" onClick={back}>Назад</Button>
            <Button className="flex-1" disabled={!answers.targetAudience} onClick={next}>
              Далее <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </StepCard>
      )}

      {step === 3 && (
        <StepCard
          title="Сколько ты хочешь брать за это?"
          subtitle="Твой комфортный диапазон цен"
        >
          <div className="space-y-2 mt-2">
            {PRICES.map(p => (
              <button
                key={p.value}
                onClick={() => setAnswers(prev => ({ ...prev, priceRange: p.value as PriceVal }))}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-colors flex items-center justify-between",
                  answers.priceRange === p.value
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <span className="font-medium">{p.label}</span>
                <span className="text-xs text-muted-foreground">{p.sub}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" onClick={back}>Назад</Button>
            <Button className="flex-1" disabled={!answers.priceRange} onClick={next}>
              Далее <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </StepCard>
      )}

      {step === 4 && (
        <StepCard
          title="Сколько времени можешь вкладывать?"
          subtitle="В неделю, помимо основной работы"
        >
          <div className="space-y-2 mt-2">
            {HOURS.map(h => (
              <button
                key={h.value}
                onClick={() => setAnswers(prev => ({ ...prev, weeklyHours: h.value as HoursVal }))}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-colors flex items-center justify-between",
                  answers.weeklyHours === h.value
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <span className="font-medium">{h.label}</span>
                <span className="text-xs text-muted-foreground">{h.sub}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" onClick={back}>Назад</Button>
            <Button
              className="flex-1"
              disabled={!answers.weeklyHours}
              onClick={handleGenerate}
            >
              <Zap className="h-4 w-4 mr-1" />
              Найти идеи
            </Button>
          </div>
        </StepCard>
      )}

      {step === 5 && ideas.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">3 идеи под тебя</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Выбери одну — начнём строить</p>
          </div>
          {ideas.map((idea, i) => (
            <div
              key={idea.id}
              className="rounded-xl border border-border bg-card p-5 space-y-3 hover:border-orange-500/50 transition-colors cursor-pointer group"
              onClick={() => handleChoose(idea)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{idea.name}</h3>
                    <FormatBadge format={idea.format} />
                  </div>
                  <p className="text-sm text-orange-400 mt-0.5">{idea.tagline}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">#{i + 1}</span>
              </div>
              <p className="text-sm text-muted-foreground">{idea.description}</p>
              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>⏱ {idea.buildHours}ч на старт</span>
                  <span>💰 ${idea.priceFrom}–${idea.priceTo}</span>
                </div>
                <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  Выбрать <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function AlreadyChosen({ idea, onReset, onContinue }: { idea: ProductIdea; onReset: () => void; onContinue: () => void }) {
  return (
    <div className="space-y-6 max-w-lg pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Твой продукт</h1>
        <p className="text-muted-foreground text-sm mt-1">Уже выбрано</p>
      </div>
      <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-orange-500" />
          <h2 className="font-semibold text-lg">{idea.name}</h2>
        </div>
        <p className="text-sm text-orange-300">{idea.tagline}</p>
        <p className="text-sm text-muted-foreground">{idea.description}</p>
        <div className="flex gap-4 text-xs text-muted-foreground pt-1">
          <span>⏱ {idea.buildHours}ч на старт</span>
          <span>💰 ${idea.priceFrom}–${idea.priceTo}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onReset}>Выбрать другую</Button>
        <Button className="flex-1" onClick={onContinue}>
          К задачам <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
