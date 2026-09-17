import { useState } from "react";
import { Pause, Play, SkipForward, Plus, Check } from "lucide-react";
import ExerciseImage from "./ExerciseImage";
import Timer from "./Timer";
import { useCountdown } from "../utils/useCountdown";
import { notifyStepComplete } from "../utils/feedback";

export default function ExercisePlayer({ step, settings, onComplete }) {
  const [phase, setPhase] = useState("ready"); // 'ready' | 'active'
  const isDuration = step.exerciseType === "duration";

  const { secondsLeft, isRunning, start, pause, resume, addSeconds, skip } =
    useCountdown(step.duration || 0, {
      onComplete: () => {
        notifyStepComplete(settings);
        onComplete();
      },
    });

  // Note: WorkoutPlayer renders this component with key={step.stepId}, so a
  // new step means a fresh mount — phase naturally starts at "ready" again
  // without needing an effect to reset it.

  const handleStart = () => {
    setPhase("active");
    if (isDuration) start();
  };

  // `skip()` (from useCountdown) already invokes the onComplete callback we
  // registered below, which advances the workout — so this just needs to
  // trigger that, not call onComplete/onSkip a second time.
  const handleSkip = () => {
    skip();
  };

  const targetLabel = isDuration
    ? `${step.duration}s`
    : step.reps;

  return (
    <div className="flex h-full flex-col px-5 pb-6 pt-4">
      {(step.sectionLabel || step.round) && (
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-pink-dark">
          {step.sectionLabel && <span>{step.sectionLabel}</span>}
          {step.round && (
            <span className="rounded-full bg-pink-soft px-2.5 py-0.5 text-pink-dark">
              Round {step.round.current} of {step.round.total}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        {phase === "ready" && (
          <ExerciseImage
            src={step.exercise.image}
            alt={step.exercise.name}
            category={step.exercise.category}
            className="h-48 w-full max-w-[360px]"
          />
        )}

        <div>
          <h1 className="text-2xl font-bold tracking-wide text-ink">
            {step.exercise.name.toUpperCase()}
          </h1>
          {step.sideLabel && (
            <p className="mt-0.5 text-sm font-medium text-pink-dark">
              {step.sideLabel}
            </p>
          )}
          {phase === "ready" && (
            <p className="mt-2 text-3xl font-extrabold text-ink">
              {isDuration ? `${step.duration}s` : targetLabel}
              {!isDuration && (
                <span className="ml-1 text-base font-semibold text-ink-soft">
                  reps
                </span>
              )}
            </p>
          )}
        </div>

        {phase === "ready" && (
          <p className="max-w-[300px] text-sm leading-relaxed text-ink-soft">
            {step.exercise.instructions[0]}
          </p>
        )}

        {phase === "active" && isDuration && (
          <Timer secondsLeft={secondsLeft} totalSeconds={step.duration} />
        )}

        {phase === "active" && !isDuration && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-6xl font-extrabold text-ink">{step.reps}</p>
            <p className="text-sm text-ink-soft">reps — go at your own pace</p>
          </div>
        )}
      </div>

      {step.exercise.tips && phase === "ready" && (
        <p className="mb-4 rounded-2xl bg-lilac-soft px-4 py-3 text-center text-xs leading-relaxed text-[#5C4A8A]">
          💡 {step.exercise.tips}
        </p>
      )}

      <div className="space-y-3">
        {phase === "ready" && (
          <button
            type="button"
            onClick={handleStart}
            className="press w-full rounded-full bg-pink py-4 text-base font-bold text-white shadow-sm"
          >
            {isDuration ? "Start Timer" : "Start"}
          </button>
        )}

        {phase === "active" && isDuration && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => addSeconds(30)}
                aria-label="Add 30 seconds"
                className="press flex h-12 w-12 items-center justify-center rounded-full bg-lilac-soft text-[#6B4FA0]"
              >
                <Plus size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={isRunning ? pause : resume}
                aria-label={isRunning ? "Pause" : "Resume"}
                className="press flex h-16 w-16 items-center justify-center rounded-full bg-ink text-cream"
              >
                {isRunning ? (
                  <Pause size={26} aria-hidden="true" />
                ) : (
                  <Play size={26} aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                aria-label="Skip exercise"
                className="press flex h-12 w-12 items-center justify-center rounded-full bg-cream-dark text-ink-soft"
              >
                <SkipForward size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {phase === "active" && !isDuration && (
          <button
            type="button"
            onClick={onComplete}
            className="press flex w-full items-center justify-center gap-2 rounded-full bg-pink py-4 text-base font-bold text-white shadow-sm"
          >
            <Check size={20} aria-hidden="true" />
            Mark as Done
          </button>
        )}

        {phase === "ready" && (
          <button
            type="button"
            onClick={handleSkip}
            className="press w-full rounded-full py-2 text-center text-sm font-medium text-ink-soft"
          >
            Skip this exercise
          </button>
        )}
      </div>
    </div>
  );
}
