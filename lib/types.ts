export type TaskCategory = "Deep work" | "Routine" | "Creative" | "Communication";
export type SavedTimeUsage = "New project" | "Rest" | "Learning" | "Nowhere yet";
export type JourneyStage = "tracking" | "idea" | "build" | "demand" | "sale" | "done";

export interface Task {
  id: string;
  name: string;
  timeWithAI: number;
  timeWithoutAI: number;
  category: TaskCategory;
  date: string;
  createdAt: string;
}

export interface DailyNote {
  date: string;
  savedTimeUsage: SavedTimeUsage;
}

export interface Settings {
  userName: string;
  hourlyRate: number;
  currency: string;
  dailyGoal: number;
}

export interface DailyStats {
  date: string;
  totalSavedMinutes: number;
  taskCount: number;
  efficiencyRatio: number;
}

// ── Journey ──────────────────────────────────────────────

export interface IdeaAnswers {
  jobTitle: string;
  aiSuperpower: string;
  targetAudience: "colleagues" | "freelancers" | "small businesses" | "students";
  priceRange: "$10-50" | "$50-200" | "$200-1000";
  weeklyHours: "2" | "5" | "10+";
}

export interface ProductIdea {
  id: string;
  name: string;
  tagline: string;
  description: string;
  format: "guide" | "templates" | "service" | "workshop" | "newsletter";
  buildHours: number;
  priceFrom: number;
  priceTo: number;
  postTemplate: string;
}

export interface BuildMilestone {
  id: string;
  title: string;
  description: string;
  hours: number;
  completed: boolean;
  completedAt?: string;
}

export interface DemandPost {
  content: string;
  platform: string;
  postedAt: string | null;
  likes: number;
  comments: number;
  dms: number;
}

export interface FirstSale {
  amount: number;
  currency: string;
  date: string;
  note: string;
}

export interface Journey {
  stage: JourneyStage;
  ideaAnswers: IdeaAnswers | null;
  chosenIdea: ProductIdea | null;
  milestones: BuildMilestone[];
  demandPost: DemandPost | null;
  firstSale: FirstSale | null;
}
