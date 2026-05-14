"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, TaskCategory } from "@/lib/types";
import { generateId, todayISO } from "@/lib/utils";
import { Plus } from "lucide-react";

const CATEGORIES: TaskCategory[] = [
  "Deep work",
  "Routine",
  "Creative",
  "Communication",
];

interface Props {
  onAdd: (task: Task) => void;
}

export function AddTaskModal({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [withAI, setWithAI] = useState("");
  const [withoutAI, setWithoutAI] = useState("");
  const [category, setCategory] = useState<TaskCategory>("Deep work");
  const [error, setError] = useState("");

  function reset() {
    setName("");
    setWithAI("");
    setWithoutAI("");
    setCategory("Deep work");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ai = parseInt(withAI, 10);
    const noAI = parseInt(withoutAI, 10);

    if (!name.trim()) { setError("Task name is required."); return; }
    if (isNaN(ai) || ai < 0) { setError("Time with AI must be a positive number."); return; }
    if (isNaN(noAI) || noAI < 0) { setError("Time without AI must be a positive number."); return; }

    const task: Task = {
      id: generateId(),
      name: name.trim(),
      timeWithAI: ai,
      timeWithoutAI: noAI,
      category,
      date: todayISO(),
      createdAt: new Date().toISOString(),
    };
    onAdd(task);
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log AI-assisted task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-name">Task name</Label>
            <Input
              id="task-name"
              placeholder="e.g. Write project proposal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="time-ai">Time with AI (min)</Label>
              <Input
                id="time-ai"
                type="number"
                min="0"
                placeholder="15"
                value={withAI}
                onChange={(e) => setWithAI(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time-no-ai">Time without AI (min)</Label>
              <Input
                id="time-no-ai"
                type="number"
                min="0"
                placeholder="60"
                value={withoutAI}
                onChange={(e) => setWithoutAI(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as TaskCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setOpen(false); reset(); }}
            >
              Cancel
            </Button>
            <Button type="submit">Save task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
