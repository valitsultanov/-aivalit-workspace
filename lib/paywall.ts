const KEY = "aipt_unlocked";

export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try { return localStorage.getItem(KEY) === "true"; } catch { return false; }
}

export function unlock(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, "true");
  window.dispatchEvent(new Event("storage"));
}
