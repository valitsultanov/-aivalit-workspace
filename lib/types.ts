export type TaskCategory = "Deep work" | "Routine" | "Creative" | "Communication";

export type SavedTimeUsage = "New project" | "Rest" | "Learning" | "Nowhere yet";

export interface Task {
  id: string;
  name: string;
  timeWithAI: number;      // minutes
  timeWithoutAI: number;   // minutes
  category: TaskCategory;
  date: string;            // YYYY-MM-DD
  createdAt: string;       // ISO datetime
}

export interface DailyNote {
  date: string;
  savedTimeUsage: SavedTimeUsage;
}

export interface Settings {
  userName: string;
  hourlyRate: number;
  currency: string;
  dailyGoal: number; // hours
}

export interface DailyStats {
  date: string;
  totalSavedMinutes: number;
  taskCount: number;
  efficiencyRatio: number;
}
