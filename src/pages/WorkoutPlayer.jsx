import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, X, ChevronLeft } from "lucide-react";
import { getWorkout } from "../data/workouts";
import { flattenWorkout } from "../utils/workoutUtils";
import { getSettings, saveWorkout } from "../utils/storage";
import ExercisePlayer from "../components/ExercisePlayer";
import RestTimer from "../components/RestTimer";
import CompletionScreen from "../components/CompletionScreen";
import ConfirmDialog from "../components/ConfirmDialog";
import ProgressBar from "../components/ProgressBar";

export default function WorkoutPlayer() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const workout = getWorkout(workoutId);
  const settings = useMemo(() => getSettings(), []);

  const steps = useMemo(
    () =>
      workout
        ? flattenWorkout(workout, { restOverride: settings.restOverride })
        : [],
    [workout, settings.restOverride]
  );

  const exerciseSteps = useMemo(
    () => steps.filter((s) => s.kind === "exercise"),
    [steps]
  );

  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(null); // set once the workout is complete
  const [confirmFinish, setConfirmFinish] = useState(false);
  const completedNames = useRef([]);
  const startTime = useRef(null);
  if (startTime.current === null) startTime.current = Date.now();
  const savedRef = useRef(false);

  if (!workout) {
    return (
      <div className="flex h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-ink-soft">We couldn't find that workout.</p>
        <Link to="/workouts" className="mt-4 text-pink-dark underline">
          Back to workouts
        </Link>
      </div>
    );
  }

  const currentStep = steps[index];
  const exercisePosition =
    currentStep?.kind === "exercise"
      ? exerciseSteps.findIndex((s) => s.stepId === currentStep.stepId) + 1
      : exerciseSteps.findIndex(
          (s) => s.stepId === steps[index + 1]?.stepId
        ) + 1;

  const completeWorkout = () => {
    if (savedRef.current) return;
    savedRef.current = true;
    const durationMin = Math.max(
      1,
      Math.round((Date.now() - startTime.current) / 60000)
    );
    saveWorkout({
      title: workout.title,
      type: workout.type,
      workoutId: workout.id,
      durationMin,
      exercises: completedNames.current,
    });
    setResult({ durationMin, exerciseNames: completedNames.current });
  };

  const goToNext = () => {
    if (index + 1 >= steps.length) {
      completeWorkout();
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handleExerciseComplete = () => {
    if (currentStep?.kind === "exercise") {
      completedNames.current = [
        ...completedNames.current,
        currentStep.exercise.name,
      ];
    }
    goToNext();
  };

  const handleBack = () => {
    setIndex((i) => Math.max(0, i - 1));
  };

  const handleFinishEarly = () => {
    setConfirmFinish(false);
    completeWorkout();
  };

  if (result) {
    return (
      <CompletionScreen
        workout={workout}
        durationMin={result.durationMin}
        exerciseNames={result.exerciseNames}
      />
    );
  }

  const overallProgress = ((index + 1) / steps.length) * 100;

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center gap-3 px-4 pb-2 pt-5">
        <button
          type="button"
          onClick={index === 0 ? () => navigate(-1) : handleBack}
          aria-label={index === 0 ? "Go back" : "Previous step"}
          className="press flex h-9 w-9 items-center justify-center rounded-full bg-card ring-1 ring-border"
        >
          {index === 0 ? (
            <ArrowLeft size={18} className="text-ink" aria-hidden="true" />
          ) : (
            <ChevronLeft size={18} className="text-ink" aria-hidden="true" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">
            {workout.title}
          </p>
        </div>
        {exercisePosition > 0 && (
          <span className="shrink-0 text-xs font-medium text-ink-soft">
            {exercisePosition}/{exerciseSteps.length}
          </span>
        )}
        <button
          type="button"
          onClick={() => setConfirmFinish(true)}
          aria-label="Finish workout"
          className="press flex h-9 w-9 items-center justify-center rounded-full bg-card ring-1 ring-border"
        >
          <X size={16} className="text-ink-soft" aria-hidden="true" />
        </button>
      </div>

      <div className="px-4">
        <ProgressBar value={overallProgress} max={100} />
      </div>

      <div className="min-h-0 flex-1">
        {currentStep.kind === "exercise" ? (
          <ExercisePlayer
            key={currentStep.stepId}
            step={currentStep}
            settings={settings}
            onComplete={handleExerciseComplete}
          />
        ) : (
          <RestTimer
            key={currentStep.stepId}
            step={currentStep}
            settings={settings}
            onComplete={goToNext}
          />
        )}
      </div>

      <ConfirmDialog
        open={confirmFinish}
        title="Finish workout now?"
        message="No pressure — what you've done so far will still be saved."
        confirmLabel="Finish now"
        cancelLabel="Keep going"
        onConfirm={handleFinishEarly}
        onCancel={() => setConfirmFinish(false)}
      />
    </div>
  );
}
