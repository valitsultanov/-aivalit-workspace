"use client";

import { Task } from "@/lib/types";
import { taskSavedMinutes, taskEfficiencyRatio, formatHours } from "@/lib/calculations";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  "Deep work": "text-blue-400 bg-blue-400/10",
  "Routine": "text-gray-400 bg-gray-400/10",
  "Creative": "text-purple-400 bg-purple-400/10",
  "Communication": "text-green-400 bg-green-400/10",
};

interface Props {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskRow({ task, onDelete }: Props) {
  const saved = taskSavedMinutes(task);
  const ratio = taskEfficiencyRatio(task);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground truncate">{task.name}</span>
          <span className={cn("text-xs rounded-full px-2 py-0.5 shrink-0", CATEGORY_COLORS[task.category])}>
            {task.category}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {task.timeWithAI}m with AI · {task.timeWithoutAI}m without
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-orange-400">
          +{formatHours(saved)}
        </p>
        <p className="text-xs text-muted-foreground">{ratio.toFixed(1)}x faster</p>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
        aria-label="Delete task"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
