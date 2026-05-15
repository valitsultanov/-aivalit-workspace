import { Task, Journey, Settings, IdeaAnswers, ProductIdea, BuildMilestone, DemandPost } from "./types";
import { generateId } from "./utils";

const TASK_TEMPLATES = [
  { name: "Написать отчёт по проекту", category: "Deep work", ai: 25, no: 120 },
  { name: "Подготовить презентацию", category: "Creative", ai: 35, no: 180 },
  { name: "Ответить на email-рассылку", category: "Communication", ai: 12, no: 45 },
  { name: "Анализ конкурентов", category: "Deep work", ai: 40, no: 150 },
  { name: "Написать пост в LinkedIn", category: "Creative", ai: 15, no: 60 },
  { name: "Составить КП клиенту", category: "Deep work", ai: 30, no: 180 },
  { name: "Транскрипция встречи", category: "Routine", ai: 5, no: 60 },
  { name: "Резюме статьи", category: "Routine", ai: 8, no: 40 },
  { name: "Подготовка к интервью", category: "Deep work", ai: 25, no: 90 },
  { name: "Перевод документа", category: "Routine", ai: 10, no: 90 },
  { name: "Письмо потенциальному клиенту", category: "Communication", ai: 8, no: 35 },
  { name: "План на неделю", category: "Routine", ai: 10, no: 30 },
  { name: "Описание продукта для лендинга", category: "Creative", ai: 20, no: 90 },
  { name: "Генерация идей для контента", category: "Creative", ai: 15, no: 60 },
  { name: "Резюме большого PDF", category: "Routine", ai: 8, no: 75 },
  { name: "Письмо руководителю", category: "Communication", ai: 10, no: 30 },
  { name: "Подготовка к встрече", category: "Deep work", ai: 20, no: 60 },
  { name: "Анализ метрик", category: "Deep work", ai: 30, no: 90 },
  { name: "Написать ТЗ дизайнеру", category: "Creative", ai: 25, no: 90 },
  { name: "Подбор референсов", category: "Creative", ai: 15, no: 60 },
] as const;

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function generateDemoTasks(): Task[] {
  const tasks: Task[] = [];
  // 14 days, 2–4 tasks per day, skip 2 days (realistic gaps)
  const skipDays = new Set([5, 11]);

  for (let d = 13; d >= 0; d--) {
    if (skipDays.has(d)) continue;
    const date = daysAgo(d);
    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const t = TASK_TEMPLATES[Math.floor(Math.random() * TASK_TEMPLATES.length)];
      const aiJitter = Math.floor(Math.random() * 10) - 5;
      const noJitter = Math.floor(Math.random() * 20) - 10;
      tasks.push({
        id: generateId(),
        name: t.name,
        timeWithAI: Math.max(2, t.ai + aiJitter),
        timeWithoutAI: Math.max(t.ai + 10, t.no + noJitter),
        category: t.category,
        date,
        createdAt: `${date}T${10 + i}:00:00.000Z`,
      });
    }
  }
  return tasks;
}

const DEMO_SETTINGS: Settings = {
  userName: "Алексей",
  hourlyRate: 50,
  currency: "$",
  dailyGoal: 2,
};

const DEMO_IDEA: ProductIdea = {
  id: generateId(),
  name: "AI Content Pack",
  tagline: "30 готовых постов для бизнеса за выходные",
  description:
    "Ты упаковываешь своё умение писать контент с AI в набор из 30 постов для конкретной ниши. Продаёшь один раз, используют месяц.",
  format: "guide",
  buildHours: 6,
  priceFrom: 49,
  priceTo: 149,
  postTemplate:
    "Я трачу на написание контента 20 минут вместо 3 часов.\n\nAI делает черновик — я правлю под голос клиента.\n\nСобрал 30 готовых постов для малого бизнеса. Пишешь один раз — используешь 3 месяца.\n\nКому нужно — пишите в личку или ставьте + в комментарии.",
};

const DEMO_IDEA_ANSWERS: IdeaAnswers = {
  jobTitle: "маркетолог",
  aiSuperpower: "пишу контент",
  targetAudience: "small businesses",
  priceRange: "$50-200",
  weeklyHours: "5",
};

function generateDemoMilestones(): BuildMilestone[] {
  return [
    {
      id: generateId(),
      title: "Написать оффер",
      description: "Одна страница: что именно ты делаешь, для кого, какой результат, цена $49–149.",
      hours: 1,
      completed: true,
      completedAt: daysAgo(4) + "T14:00:00.000Z",
    },
    {
      id: generateId(),
      title: "Создать пост для теста спроса",
      description: "Пост для соцсетей уже готов в разделе «Тест спроса». Скопируй и опубликуй.",
      hours: 0.5,
      completed: true,
      completedAt: daysAgo(3) + "T10:00:00.000Z",
    },
    {
      id: generateId(),
      title: "Настроить приём оплаты",
      description: "Stripe, ЮMoney или просто карта. Ссылка на оплату = ссылка на продукт.",
      hours: 0.5,
      completed: false,
    },
    {
      id: generateId(),
      title: "Написать 10 потенциальным клиентам",
      description: "Из твоей сети: коллеги, знакомые, LinkedIn.",
      hours: 2,
      completed: false,
    },
    {
      id: generateId(),
      title: "Сделать первую доставку",
      description: "Выполни заказ для первого клиента.",
      hours: 3,
      completed: false,
    },
  ];
}

const DEMO_POST: DemandPost = {
  content: DEMO_IDEA.postTemplate
    .replace("{audience}", "малого бизнеса"),
  platform: "LinkedIn",
  postedAt: daysAgo(2) + "T09:30:00.000Z",
  likes: 7,
  comments: 3,
  dms: 2,
};

const DEMO_JOURNEY: Journey = {
  stage: "demand",
  ideaAnswers: DEMO_IDEA_ANSWERS,
  chosenIdea: DEMO_IDEA,
  milestones: generateDemoMilestones(),
  demandPost: DEMO_POST,
  firstSale: null,
};

export function loadDemoData(): void {
  const tasks = generateDemoTasks();
  localStorage.setItem("aipt_tasks", JSON.stringify(tasks));
  localStorage.setItem("aipt_settings", JSON.stringify(DEMO_SETTINGS));
  localStorage.setItem("aipt_journey", JSON.stringify(DEMO_JOURNEY));
  localStorage.setItem("aipt_onboarded", "true");
  localStorage.setItem("aipt_unlocked", "true");
  window.dispatchEvent(new Event("storage"));
}

export function resetAllData(): void {
  const keys = [
    "aipt_tasks", "aipt_daily_notes", "aipt_settings",
    "aipt_journey", "aipt_onboarded", "aipt_unlocked",
  ];
  keys.forEach(k => localStorage.removeItem(k));
  window.dispatchEvent(new Event("storage"));
}
