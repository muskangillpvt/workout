import { CompactWorkoutCard } from "../components/WorkoutCard";
import { WORKOUTS, FULL_SESSION_IDS } from "../data/workouts";

export default function Workouts() {
  return (
    <div className="px-5 pt-8">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-wide text-ink">
          Workouts
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Pick what fits today — light or full.
        </p>
      </header>

      <section className="mb-7">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Shift Days
        </h2>
        <div className="space-y-2.5">
          <CompactWorkoutCard
            to="/workout/shiftDay"
            emoji="🍔"
            title={WORKOUTS.shiftDay.title}
            subtitle={WORKOUTS.shiftDay.subtitle}
            duration={WORKOUTS.shiftDay.duration}
          />
          <CompactWorkoutCard
            to="/workout/quickShift"
            emoji="🍔"
            title={WORKOUTS.quickShift.title}
            subtitle="Really tired? The bare minimum."
            duration={WORKOUTS.quickShift.duration}
          />
        </div>
      </section>

      <section className="mb-7">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Full Workouts
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
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Posture
        </h2>
        <CompactWorkoutCard
          to="/workout/shoulderReset"
          emoji="🌷"
          title={WORKOUTS.shoulderReset.title}
          subtitle={WORKOUTS.shoulderReset.subtitle}
          duration={WORKOUTS.shoulderReset.duration}
        />
      </section>

      <p className="mb-8 rounded-2xl bg-lilac-soft px-4 py-3 text-center text-xs leading-relaxed text-[#5C4A8A]">
        Consistency matters more than perfection. 2–3 full workouts a week is
        the goal — not every day.
      </p>
    </div>
  );
}
