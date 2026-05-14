import { Task, DailyNote, Settings } from "./types";

const KEYS = {
  tasks: "aipt_tasks",
  notes: "aipt_daily_notes",
  settings: "aipt_settings",
} as const;

export const DEFAULT_SETTINGS: Settings = {
  userName: "",
  hourlyRate: 0,
  currency: "$",
  dailyGoal: 2,
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
export function getTasks(): Task[] {
  return read<Task[]>(KEYS.tasks, []);
}

export function saveTask(task: Task): void {
  const tasks = getTasks();
  write(KEYS.tasks, [...tasks, task]);
}

export function deleteTask(id: string): void {
  const tasks = getTasks().filter((t) => t.id !== id);
  write(KEYS.tasks, tasks);
}

export function getTasksByDate(date: string): Task[] {
  return getTasks().filter((t) => t.date === date);
}

export function getTasksInRange(startDate: string, endDate: string): Task[] {
  return getTasks().filter((t) => t.date >= startDate && t.date <= endDate);
}

// Daily notes
export function getDailyNote(date: string): DailyNote | null {
  const notes = read<DailyNote[]>(KEYS.notes, []);
  return notes.find((n) => n.date === date) ?? null;
}

export function saveDailyNote(note: DailyNote): void {
  const notes = read<DailyNote[]>(KEYS.notes, []).filter(
    (n) => n.date !== note.date
  );
  write(KEYS.notes, [...notes, note]);
}

// Settings
export function getSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(KEYS.settings, {}) };
}

export function saveSettings(settings: Settings): void {
  write(KEYS.settings, settings);
}
