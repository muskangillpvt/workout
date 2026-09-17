import { useState } from "react";
import { Flame } from "lucide-react";
import { getWorkoutHistory } from "../utils/storage";
import {
  getWeekOverview,
  getCurrentStreak,
  formatRelativeDate,
} from "../utils/workoutUtils";

const TYPE_EMOJI = { shift: "🍔", full: "💪", posture: "🌷" };

export default function Progress() {
  const [history] = useState(() => getWorkoutHistory());
  const [overview] = useState(() => getWeekOverview(history));
  const [streak] = useState(() => getCurrentStreak(history));

  return (
    <div className="px-5 pt-8">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-wide text-ink">
          Progress
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Consistency matters more than perfection.
        </p>
      </header>

      {overview && (
        <>
          <section className="mb-5 grid grid-cols-3 gap-2.5">
            <StatCard
              label="Full workouts"
              value={`${overview.fullCount}/3`}
            />
            <StatCard label="Workout time" value={`${overview.totalMinutes}m`} />
            <StatCard
              label="Stamina"
              value={`${overview.staminaMinutes}m`}
            />
          </section>

          <section className="mb-5 rounded-3xl bg-card p-5 ring-1 ring-border">
            <p className="mb-3 text-sm font-semibold text-ink">This week</p>
            <div className="flex justify-between">
              {overview.days.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-ink-soft">
                    {day.label}
                  </span>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      day.done
                        ? "bg-pink text-white"
                        : day.isToday
                        ? "bg-cream-dark text-ink ring-1 ring-pink"
                        : "bg-cream-dark text-ink-soft"
                    }`}
                  >
                    {day.done ? "✓" : ""}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6 flex items-center gap-3 rounded-3xl bg-lilac-soft p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card">
              <Flame size={20} className="text-pink-dark" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">
                {streak > 0
                  ? `${streak} day${streak === 1 ? "" : "s"} streak`
                  : "No streak yet"}
              </p>
              <p className="text-xs text-ink-soft">
                {streak > 0
                  ? "Rest is part of training — streaks don't need to be perfect."
                  : "Your first workout today can start one."}
              </p>
            </div>
          </section>
        </>
      )}

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Recent Workouts
      </h2>

      {history.length === 0 ? (
        <div className="mb-10 rounded-3xl bg-card p-8 text-center ring-1 ring-border">
          <p className="text-sm font-semibold text-ink">No workouts yet.</p>
          <p className="mt-1 text-sm text-ink-soft">
            Your first one can start today.
          </p>
        </div>
      ) : (
        <ul className="mb-10 space-y-2.5">
          {history.slice(0, 15).map((entry) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-border"
            >
              <span className="text-xl" aria-hidden="true">
                {TYPE_EMOJI[entry.type] || "🌷"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {entry.title}
                </p>
                <p className="text-xs text-ink-soft">
                  {formatRelativeDate(entry.date)}
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium text-ink-soft">
                {entry.durationMin} min
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-card p-3 text-center ring-1 ring-border">
      <p className="text-lg font-extrabold text-ink">{value}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-ink-soft">{label}</p>
    </div>
  );
}
