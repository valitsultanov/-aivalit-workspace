"use client";

import { SavedTimeUsage, DailyNote } from "@/lib/types";

const OPTIONS: SavedTimeUsage[] = [
  "New project",
  "Rest",
  "Learning",
  "Nowhere yet",
];

interface Props {
  note: DailyNote | null;
  onSave: (note: DailyNote) => void;
  date: string;
}

export function DailyNoteSelector({ note, onSave, date }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <p className="text-sm text-muted-foreground font-medium">
        Where did you spend the saved time?
      </p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => onSave({ date, savedTimeUsage: opt })}
            className={`rounded-full px-3 py-1 text-xs border transition-colors ${
              note?.savedTimeUsage === opt
                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                : "border-border text-muted-foreground hover:border-muted-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
