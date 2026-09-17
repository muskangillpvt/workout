import { useState } from "react";
import { Trash2 } from "lucide-react";
import { getSettings, saveSettings, clearHistory } from "../utils/storage";
import ConfirmDialog from "../components/ConfirmDialog";

const REST_OPTIONS = [
  { value: null, label: "Recommended" },
  { value: 30, label: "30 sec" },
  { value: 45, label: "45 sec" },
  { value: 60, label: "60 sec" },
  { value: 90, label: "90 sec" },
];

const STAMINA_WEEKS = [
  { week: 1, label: "Week 1–2", detail: "2 min brisk / 1 min easy × 8" },
  { week: 3, label: "Week 3–4", detail: "3 min brisk / 1 min easy × 6–8" },
  { week: 5, label: "Week 5–6", detail: "5 min brisk / 1 min easy" },
];

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`press relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        checked ? "bg-pink" : "bg-cream-dark"
      }`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function Settings({ onDarkModeChange }) {
  const [settings, setSettings] = useState(getSettings());
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);

  const update = (partial) => {
    const updated = saveSettings(partial);
    setSettings(updated);
    if ("darkMode" in partial && onDarkModeChange) {
      onDarkModeChange(updated.darkMode);
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setConfirmClear(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 2500);
  };

  return (
    <div className="px-5 pt-8">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-wide text-ink">
          Settings
        </h1>
        <p className="mt-1 text-sm text-ink-soft">Make the app feel right.</p>
      </header>

      <section className="mb-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Rest Duration
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {REST_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => update({ restOverride: opt.value })}
              className={`press rounded-2xl py-3 text-sm font-semibold ring-1 ${
                settings.restOverride === opt.value
                  ? "bg-pink text-white ring-pink"
                  : "bg-card text-ink ring-border"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Feedback
        </h2>
        <div className="flex items-center justify-between rounded-2xl bg-card p-4 ring-1 ring-border">
          <div>
            <p className="text-sm font-semibold text-ink">Sound</p>
            <p className="text-xs text-ink-soft">Gentle chime on completion</p>
          </div>
          <Toggle
            checked={settings.soundEnabled}
            onChange={(v) => update({ soundEnabled: v })}
            label="Sound"
          />
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-card p-4 ring-1 ring-border">
          <div>
            <p className="text-sm font-semibold text-ink">Vibration</p>
            <p className="text-xs text-ink-soft">Buzz when a timer ends</p>
          </div>
          <Toggle
            checked={settings.vibrationEnabled}
            onChange={(v) => update({ vibrationEnabled: v })}
            label="Vibration"
          />
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-card p-4 ring-1 ring-border">
          <div>
            <p className="text-sm font-semibold text-ink">Dark Mode</p>
            <p className="text-xs text-ink-soft">Easier on the eyes at night</p>
          </div>
          <Toggle
            checked={settings.darkMode}
            onChange={(v) => update({ darkMode: v })}
            label="Dark mode"
          />
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Stamina Progression
        </h2>
        <p className="mb-3 text-xs text-ink-soft">
          A future goal, not a requirement — choose what reflects where you
          are now.
        </p>
        <div className="space-y-2">
          {STAMINA_WEEKS.map((w) => (
            <button
              key={w.week}
              type="button"
              onClick={() => update({ staminaWeek: w.week })}
              className={`press flex w-full items-center justify-between rounded-2xl p-4 text-left ring-1 ${
                settings.staminaWeek === w.week
                  ? "bg-pink-soft ring-pink"
                  : "bg-card ring-border"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-ink">{w.label}</p>
                <p className="text-xs text-ink-soft">{w.detail}</p>
              </div>
              {settings.staminaWeek === w.week && (
                <span className="text-pink-dark" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Data
        </h2>
        <button
          type="button"
          onClick={() => setConfirmClear(true)}
          className="press flex w-full items-center justify-center gap-2 rounded-2xl bg-card p-4 text-sm font-semibold text-[#C9636F] ring-1 ring-border"
        >
          <Trash2 size={16} aria-hidden="true" />
          Clear workout history
        </button>
        {cleared && (
          <p className="mt-2 text-center text-xs text-ink-soft">
            History cleared.
          </p>
        )}
      </section>

      <ConfirmDialog
        open={confirmClear}
        title="Clear workout history?"
        message="This removes all saved workouts from this device. This can't be undone."
        confirmLabel="Clear history"
        danger
        onConfirm={handleClearHistory}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}
