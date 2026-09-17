import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getWorkout } from "../data/workouts";
import ExerciseCard from "../components/ExerciseCard";
import { flattenWorkout, formatMinutesLabel, estimateWorkoutSeconds } from "../utils/workoutUtils";

export default function WorkoutIntro() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const workout = getWorkout(workoutId);

  if (!workout) {
    return (
      <div className="px-5 pt-8 text-center">
        <p className="text-ink-soft">We couldn't find that workout.</p>
        <Link to="/workouts" className="mt-4 inline-block text-pink-dark underline">
          Back to workouts
        </Link>
      </div>
    );
  }

  const steps = flattenWorkout(workout);
  const exerciseSteps = steps.filter((s) => s.kind === "exercise");
  // De-duplicate consecutive repeats (e.g. circuit rounds, interval sides) for the preview list.
  const seen = new Set();
  const previewList = [];
  exerciseSteps.forEach((s) => {
    const key = `${s.exercise.id}-${s.sectionLabel || ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      previewList.push(s);
    }
  });

  const estimatedMin = formatMinutesLabel(estimateWorkoutSeconds(workout));

  return (
    <div className="flex min-h-screen flex-col px-5 pt-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="press mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-card ring-1 ring-border"
      >
        <ArrowLeft size={18} className="text-ink" aria-hidden="true" />
      </button>

      <div className="mb-1 flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">
          {workout.emoji}
        </span>
        <h1 className="text-2xl font-extrabold tracking-wide text-ink">
          {workout.title}
        </h1>
      </div>
      <p className="text-sm text-ink-soft">{workout.subtitle}</p>
      <p className="mt-1 text-xs font-semibold text-pink-dark">
        ~{estimatedMin || workout.duration}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-ink">{workout.intro}</p>

      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-cream-dark px-4 py-3 text-xs leading-relaxed text-ink-soft">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-ink-soft" aria-hidden="true" />
        <p>
          Move at a comfortable intensity. Stop if you feel unwell, dizzy,
          faint, or experience unusual pain.
        </p>
      </div>

      <h2 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-ink-soft">
        What's included
      </h2>
      <div className="mb-28 space-y-2">
        {previewList.map((s, i) => (
          <ExerciseCard
            key={s.stepId}
            exercise={s.exercise}
            index={i + 1}
            meta={s.exercise.type === "duration" ? `${s.duration}s` : s.reps}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] bg-gradient-to-t from-cream via-cream to-transparent px-5 pb-8 pt-6">
        <Link
          to={`/play/${workout.id}`}
          className="press block w-full rounded-full bg-pink py-4 text-center text-base font-bold text-white shadow-sm"
        >
          Let's build.
        </Link>
        {workout.id === "shiftDay" && (
          <Link
            to="/workout/quickShift"
            className="mt-3 block text-center text-sm font-medium text-ink-soft underline"
          >
            Really tired? Try the 5–8 min quick version
          </Link>
        )}
      </div>
    </div>
  );
}
