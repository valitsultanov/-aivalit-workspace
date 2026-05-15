"use client";

import { useState, useEffect, useCallback } from "react";
import { isUnlocked, unlock as doUnlock } from "@/lib/paywall";

export function usePaywall() {
  const [unlocked, setUnlocked] = useState(false);

  const refresh = useCallback(() => setUnlocked(isUnlocked()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [refresh]);

  const unlock = useCallback(() => {
    doUnlock();
    setUnlocked(true);
  }, []);

  return { unlocked, unlock };
}
