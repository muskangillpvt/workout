import { useState } from "react";
import { HeroWorkoutCard, CompactWorkoutCard } from "../components/WorkoutCard";
import { WORKOUTS, FULL_SESSION_IDS } from "../data/workouts";
import { getWorkoutHistory } from "../utils/storage";
import { getWeekOverview } from "../utils/workoutUtils";

export default function Home() {
  const [overview] = useState(() => getWeekOverview(getWorkoutHistory()));

  return (
    <div className="px-5 pt-8">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-wide text-ink">
          MY WORKOUT
        </h1>
        <p className="mt-1 text-sm font-medium text-ink-soft">
          Build • Strengthen • Feel Better
        </p>
      </header>

      <h2 className="mb-3 text-base font-semibold text-ink">
        How's today looking?
      </h2>

      <div className="space-y-3">
        <HeroWorkoutCard
          to="/workout/shiftDay"
          accent="pink"
          emoji="🍔"
          title="SHIFT DAY"
          meta="10–15 min"
          focus="Recovery + posture"
          cta="Keep it light"
        />
        <HeroWorkoutCard
          to="/workouts"
          accent="lilac"
          emoji="💪"
          title="FULL WORKOUT"
          meta="35–45 min"
          focus="Strength + stamina"
          cta="Build today"
        />
      </div>

      <h2 className="mb-3 mt-7 text-base font-semibold text-ink">
        Full workout options
      </h2>
      <div className="space-y-2.5">
        {FULL_SESSION_IDS.map((id) => {
          const w = WORKOUTS[id];
          return (
            <CompactWorkoutCard
              key={id}
              to={`/workout/${id}`}
              emoji={w.emoji}
              title={w.title}
              subtitle={w.subtitle}
              duration={w.duration}
            />
          );
        })}
      </div>

      <div className="mb-8 mt-7 rounded-3xl bg-card p-5 ring-1 ring-border">
        <p className="mb-3 text-sm font-semibold text-ink">This week</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-extrabold text-ink">
              {overview.fullCount}{" "}
              <span className="text-sm font-medium text-ink-soft">/ 3</span>
            </p>
            <p className="text-xs text-ink-soft">full workouts</p>
          </div>
          <div className="h-8 w-px bg-border" aria-hidden="true" />
          <div>
            <p className="text-xl font-extrabold text-ink">
              {overview.totalMinutes}
              <span className="text-sm font-medium text-ink-soft"> min</span>
            </p>
            <p className="text-xs text-ink-soft">completed</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          {overview.days.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-medium text-ink-soft">
                {day.label}
              </span>
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
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
      </div>
    </div>
  );
}
