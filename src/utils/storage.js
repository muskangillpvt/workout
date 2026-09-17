// Small, defensive wrapper around localStorage. All reads guard against
// missing or corrupted data so the app never crashes because of it.

const KEYS = {
  history: "myWorkoutHistory",
  settings: "myWorkoutSettings",
  preferences: "myWorkoutPreferences",
};

const DEFAULT_SETTINGS = {
  restOverride: null, // null = use each exercise's recommended rest
  soundEnabled: true,
  vibrationEnabled: true,
  darkMode: false,
  staminaWeek: 1, // 1-6, used by the stamina progression view
};

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object") return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

function isStorageAvailable() {
  try {
    const testKey = "__myWorkoutTest__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export const storageAvailable = isStorageAvailable();

export function getWorkoutHistory() {
  if (!storageAvailable) return [];
  const raw = window.localStorage.getItem(KEYS.history);
  const parsed = safeParse(raw, []);
  if (!Array.isArray(parsed)) return [];
  // Filter out any malformed entries defensively.
  return parsed.filter(
    (entry) => entry && typeof entry === "object" && entry.date && entry.title
  );
}

export function saveWorkout(entry) {
  if (!storageAvailable) return;
  const history = getWorkoutHistory();
  const newEntry = {
    id: `w-${Date.now()}`,
    date: new Date().toISOString(),
    title: entry.title,
    type: entry.type, // 'shift' | 'full' | 'posture'
    durationMin: entry.durationMin,
    exercises: entry.exercises || [],
    ...entry,
  };
  const updated = [newEntry, ...history].slice(0, 200);
  try {
    window.localStorage.setItem(KEYS.history, JSON.stringify(updated));
  } catch {
    // Storage full or unavailable — fail silently, don't crash the app.
  }
  return newEntry;
}

export function clearHistory() {
  if (!storageAvailable) return;
  try {
    window.localStorage.removeItem(KEYS.history);
  } catch {
    // ignore
  }
}

export function getSettings() {
  if (!storageAvailable) return { ...DEFAULT_SETTINGS };
  const raw = window.localStorage.getItem(KEYS.settings);
  const parsed = safeParse(raw, {});
  return { ...DEFAULT_SETTINGS, ...parsed };
}

export function saveSettings(partial) {
  if (!storageAvailable) return { ...DEFAULT_SETTINGS, ...partial };
  const current = getSettings();
  const updated = { ...current, ...partial };
  try {
    window.localStorage.setItem(KEYS.settings, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

export function getPreferences() {
  if (!storageAvailable) return {};
  const raw = window.localStorage.getItem(KEYS.preferences);
  return safeParse(raw, {});
}

export function savePreferences(partial) {
  if (!storageAvailable) return partial;
  const current = getPreferences();
  const updated = { ...current, ...partial };
  try {
    window.localStorage.setItem(KEYS.preferences, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

export { DEFAULT_SETTINGS };
