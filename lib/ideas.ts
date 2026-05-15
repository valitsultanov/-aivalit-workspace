import { IdeaAnswers, ProductIdea, BuildMilestone } from "./types";
import { generateId } from "./utils";

// Product idea catalogue — 18 templates
const CATALOGUE: Omit<ProductIdea, "id">[] = [
  {
    name: "AI Content Pack",
    tagline: "30 готовых постов для бизнеса за выходные",
    description: "Ты упаковываешь своё умение писать контент с AI в набор из 30 постов для конкретной ниши. Продаёшь один раз, используют месяц.",
    format: "guide",
    buildHours: 6,
    priceFrom: 49,
    priceTo: 149,
    postTemplate:
      "Я трачу на написание контента {hours} минут вместо {hoursBefore} часов.\n\nAI делает черновик — я правлю под голос клиента.\n\nСобрал 30 готовых постов для {audience}. Пишешь один раз — используешь 3 месяца.\n\nКому нужно — пишите в личку или ставьте + в комментарии.",
  },
  {
    name: "AI Prompt Kit",
    tagline: "Пачка промптов под твою профессию",
    description: "Ты собираешь 20-30 проверенных промптов для конкретной роли (маркетолог, рекрутер, аналитик). Люди платят за то, что работает сразу.",
    format: "templates",
    buildHours: 4,
    priceFrom: 19,
    priceTo: 79,
    postTemplate:
      "Использую ChatGPT каждый день.\n\nЗа {months} месяцев собрал {count} промптов, которые реально работают для {jobTitle}.\n\nНе \"напиши мне текст\". А промпты, которые дают результат с первого раза.\n\nОтдаю пачку за символическую цену. Кому нужно — ставьте +",
  },
  {
    name: "AI-процесс за 1 день",
    tagline: "Внедряю AI в один рабочий процесс вашей команды",
    description: "Ты берёшь один процесс у клиента (рассылки, отчёты, ответы на запросы) и автоматизируешь его с AI. Один день — измеримый результат.",
    format: "service",
    buildHours: 8,
    priceFrom: 150,
    priceTo: 500,
    postTemplate:
      "Недавно помог коллеге автоматизировать {process}.\n\nРаньше занимало {hoursBefore} часов в неделю.\nТеперь — {hoursAfter} минут.\n\nТеперь делаю это для других команд.\nОдин день работы — один процесс автоматизирован.\n\nКому актуально — напишите, обсудим.",
  },
  {
    name: "AI-воркшоп для команды",
    tagline: "2-часовой воркшоп: AI-инструменты для вашего отдела",
    description: "Ты проводишь живой воркшоп для команды — показываешь конкретные инструменты под их задачи. Корпоративные клиенты платят хорошо.",
    format: "workshop",
    buildHours: 10,
    priceFrom: 200,
    priceTo: 1000,
    postTemplate:
      "Команда из {teamSize} человек после моего воркшопа сократила время на {task} с {before} до {after}.\n\nЭто не теория про ChatGPT.\nЭто 2 часа практики под конкретные задачи вашего отдела.\n\nЕсть 2 слота на следующий месяц.\nКому интересно — пишите.",
  },
  {
    name: "AI-дайджест для профессионалов",
    tagline: "Еженедельная рассылка: лучшее об AI для твоей ниши",
    description: "Ты раз в неделю собираешь и пересказываешь главное об AI для конкретной профессии. Подписка — $5-15/мес. Масштабируется само.",
    format: "newsletter",
    buildHours: 5,
    priceFrom: 5,
    priceTo: 15,
    postTemplate:
      "Каждую неделю читаю 20+ материалов об AI для {niche}.\n\nСобрал это в рассылку: только то, что реально полезно {jobTitle}.\nБез воды, без хайпа.\n\nПервые 50 подписчиков — бесплатно.\nЗатем $9/мес.\n\nСсылка в комментарии.",
  },
  {
    name: "Шаблоны документов с AI",
    tagline: "10 шаблонов деловых документов, которые заполняет AI",
    description: "Коммерческое предложение, бриф, отчёт, договор — ты собираешь шаблоны, которые ChatGPT заполняет за 2 минуты. Продаёшь раз, используют годами.",
    format: "templates",
    buildHours: 5,
    priceFrom: 29,
    priceTo: 99,
    postTemplate:
      "КП писал 3 часа. Теперь — 15 минут.\n\nСоздал 10 шаблонов деловых документов, которые ChatGPT заполняет за тебя.\nПросто отвечаешь на вопросы — получаешь готовый документ.\n\nДля {audience}. Тестировал сам, всё работает.\n\nКому надо — пишите. Первым 10 — со скидкой 50%.",
  },
  {
    name: "Инструкция по найму с AI",
    tagline: "Система найма: от вакансии до оффера с помощью AI",
    description: "Описание вакансии, вопросы для интервью, оценочная таблица — полная система для найма одного сотрудника. Актуально для малого бизнеса.",
    format: "guide",
    buildHours: 6,
    priceFrom: 49,
    priceTo: 199,
    postTemplate:
      "Собеседовал 30 кандидатов за 3 недели.\nС AI сократил подготовку с 2 часов до 20 минут.\n\nСоздал систему найма: вакансия → вопросы → оценка → оффер.\nВсё через ChatGPT. Работает для команд от 2 человек.\n\nКому нужно закрыть вакансию быстро — напишите.",
  },
  {
    name: "AI-отчёты по данным",
    tagline: "Превращаю твои цифры в понятные отчёты за 24 часа",
    description: "Клиент присылает таблицу или выгрузку — ты делаешь красивый отчёт с инсайтами через AI. Еженедельно или разово.",
    format: "service",
    buildHours: 7,
    priceFrom: 100,
    priceTo: 400,
    postTemplate:
      "Аналитика занимала у меня {before} часов в неделю.\nТеперь — {after} минут.\n\nПомогаю малому бизнесу превращать данные в понятные отчёты.\nПрисылаешь таблицу — через 24 часа получаешь отчёт с выводами.\n\nПервый отчёт — бесплатно.\nКому нужно понять, что происходит в бизнесе — напишите.",
  },
  {
    name: "AI-скрипты продаж",
    tagline: "Скрипты для холодных продаж, которые пишет AI",
    description: "Пачка скриптов для звонков, переписки, обработки возражений — всё заточено под конкретную нишу. Продавцы любят конкретику.",
    format: "templates",
    buildHours: 5,
    priceFrom: 39,
    priceTo: 149,
    postTemplate:
      "Менеджер по продажам тратит до 30% времени на написание сообщений.\n\nСобрал 15 скриптов для {niche}: холодный контакт, follow-up, обработка возражений.\nКаждый написан с AI и проверен на реальных сделках.\n\nКому нужны готовые скрипты — пишите в личку.",
  },
];

// Scoring: match ideas to user answers
function score(
  idea: Omit<ProductIdea, "id">,
  answers: IdeaAnswers
): number {
  let s = 0;

  const { priceRange, weeklyHours, targetAudience } = answers;

  // Price fit
  const [pMin] = priceRange.split("-").map(Number);
  if (idea.priceFrom <= pMin + 50 && idea.priceTo >= pMin - 10) s += 3;

  // Time fit
  const hours = weeklyHours === "2" ? 2 : weeklyHours === "5" ? 5 : 10;
  if (idea.buildHours <= hours * 3) s += 2;
  if (idea.buildHours <= hours * 2) s += 1;

  // Audience fit
  if (targetAudience === "small businesses" && (idea.format === "service" || idea.format === "workshop")) s += 2;
  if (targetAudience === "freelancers" && (idea.format === "templates" || idea.format === "guide")) s += 2;
  if (targetAudience === "colleagues" && idea.format === "workshop") s += 2;
  if (targetAudience === "students" && (idea.format === "guide" || idea.format === "newsletter")) s += 2;

  return s;
}

export function generateIdeas(answers: IdeaAnswers): ProductIdea[] {
  const scored = CATALOGUE.map(idea => ({ idea, s: score(idea, answers) }));
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, 3).map(({ idea }) => ({ id: generateId(), ...idea }));
}

export function generateMilestones(idea: ProductIdea): BuildMilestone[] {
  return [
    {
      id: generateId(),
      title: "Написать оффер",
      description: `Одна страница: что именно ты делаешь (${idea.name}), для кого, какой результат, цена ${idea.priceFrom}–${idea.priceTo}$.`,
      hours: 1,
      completed: false,
    },
    {
      id: generateId(),
      title: "Создать пост для теста спроса",
      description: "Пост для соцсетей уже готов в разделе «Тест спроса». Скопируй и опубликуй.",
      hours: 0.5,
      completed: false,
    },
    {
      id: generateId(),
      title: "Настроить приём оплаты",
      description: "Stripe, ЮMoney или просто карта. Ссылка на оплату = ссылка на продукт. Займёт 30 минут.",
      hours: 0.5,
      completed: false,
    },
    {
      id: generateId(),
      title: "Написать 10 потенциальным клиентам",
      description: "Из твоей сети: коллеги, знакомые, LinkedIn. Не продавай — спроси, актуальна ли проблема.",
      hours: 2,
      completed: false,
    },
    {
      id: generateId(),
      title: "Сделать первую доставку",
      description: `Выполни заказ для первого клиента. Даже если бесплатно — первый опыт важнее первых денег.`,
      hours: idea.buildHours * 0.5,
      completed: false,
    },
  ];
}

export function generatePostContent(idea: ProductIdea): string {
  // Fill in approximate placeholders in the template
  return idea.postTemplate
    .replace("{hours}", "20")
    .replace("{hoursBefore}", "3")
    .replace("{hoursAfter}", "15")
    .replace("{before}", "3 часа")
    .replace("{after}", "15")
    .replace("{months}", "6")
    .replace("{count}", "30")
    .replace("{niche}", "вашей нише")
    .replace("{audience}", "малого бизнеса")
    .replace("{teamSize}", "5-10")
    .replace("{task}", "рутинные задачи")
    .replace("{process}", "подготовку отчётов");
}
