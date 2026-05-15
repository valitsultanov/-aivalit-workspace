"use client";

import { useState, useEffect } from "react";
import { Onboarding } from "@/components/Onboarding";
import { isOnboarded, saveTask } from "@/lib/storage";
import { Task } from "@/lib/types";

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isOnboarded()) {
      setShowOnboarding(true);
    }
  }, []);

  function handleComplete(firstTask?: Task) {
    if (firstTask) saveTask(firstTask);
    setShowOnboarding(false);
    // Force re-render of children so they pick up the new task
    window.dispatchEvent(new Event("storage"));
  }

  if (!mounted) return <>{children}</>;

  return (
    <>
      {children}
      {showOnboarding && <Onboarding onComplete={handleComplete} />}
    </>
  );
}
