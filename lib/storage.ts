import { Task, DailyNote, Settings, Journey, JourneyStage } from "./types";

const KEYS = {
  tasks: "aipt_tasks",
  notes: "aipt_daily_notes",
  settings: "aipt_settings",
  journey: "aipt_journey",
} as const;

export const DEFAULT_SETTINGS: Settings = {
  userName: "",
  hourlyRate: 0,
  currency: "$",
  dailyGoal: 2,
};

const DEFAULT_JOURNEY: Journey = {
  stage: "tracking",
  ideaAnswers: null,
  chosenIdea: null,
  milestones: [],
  demandPost: null,
  firstSale: null,
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Tasks
export function getTasks(): Task[] { return read<Task[]>(KEYS.tasks, []); }
export function saveTask(task: Task): void { write(KEYS.tasks, [...getTasks(), task]); }
export function deleteTask(id: string): void { write(KEYS.tasks, getTasks().filter(t => t.id !== id)); }
export function getTasksByDate(date: string): Task[] { return getTasks().filter(t => t.date === date); }
export function getTasksInRange(s: string, e: string): Task[] { return getTasks().filter(t => t.date >= s && t.date <= e); }

// Daily notes
export function getDailyNote(date: string): DailyNote | null {
  return read<DailyNote[]>(KEYS.notes, []).find(n => n.date === date) ?? null;
}
export function saveDailyNote(note: DailyNote): void {
  write(KEYS.notes, [...read<DailyNote[]>(KEYS.notes, []).filter(n => n.date !== note.date), note]);
}

// Settings
export function getSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(KEYS.settings, {}) };
}
export function saveSettings(settings: Settings): void { write(KEYS.settings, settings); }

// Journey
export function getJourney(): Journey {
  return { ...DEFAULT_JOURNEY, ...read<Partial<Journey>>(KEYS.journey, {}) };
}
export function saveJourney(journey: Journey): void { write(KEYS.journey, journey); }
export function updateJourney(patch: Partial<Journey>): Journey {
  const current = getJourney();
  const updated = { ...current, ...patch };
  saveJourney(updated);
  return updated;
}
export function setJourneyStage(stage: JourneyStage): void {
  updateJourney({ stage });
}
