"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, DailyNote, Settings, Journey } from "@/lib/types";
import {
  getTasks, saveTask, deleteTask,
  getDailyNote, saveDailyNote,
  getSettings, saveSettings,
  getJourney, updateJourney,
} from "@/lib/storage";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const refresh = useCallback(() => setTasks(getTasks()), []);
  useEffect(() => { refresh(); }, [refresh]);
  const addTask = useCallback((task: Task) => { saveTask(task); refresh(); }, [refresh]);
  const removeTask = useCallback((id: string) => { deleteTask(id); refresh(); }, [refresh]);
  return { tasks, addTask, removeTask, refresh };
}

export function useDailyNote(date: string) {
  const [note, setNote] = useState<DailyNote | null>(null);
  useEffect(() => { setNote(getDailyNote(date)); }, [date]);
  const saveNote = useCallback((n: DailyNote) => { saveDailyNote(n); setNote(n); }, []);
  return { note, saveNote };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({ userName: "", hourlyRate: 0, currency: "$", dailyGoal: 2 });
  useEffect(() => { setSettings(getSettings()); }, []);
  const update = useCallback((s: Settings) => { saveSettings(s); setSettings(s); }, []);
  return { settings, update };
}

export function useJourney() {
  const [journey, setJourney] = useState<Journey>({
    stage: "tracking", ideaAnswers: null, chosenIdea: null,
    milestones: [], demandPost: null, firstSale: null,
  });

  const refresh = useCallback(() => setJourney(getJourney()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const patch = useCallback((p: Partial<Journey>) => {
    const updated = updateJourney(p);
    setJourney(updated);
  }, []);

  return { journey, patch, refresh };
}
