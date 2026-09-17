import { useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import Timer from "./Timer";
import ExerciseImage from "./ExerciseImage";
import { useCountdown } from "../utils/useCountdown";
import { notifyStepComplete } from "../utils/feedback";

const ENCOURAGEMENTS = [
  "Nice work.",
  "Take your rest.",
  "You don't need to rush.",
  "Breathe. You're doing great.",
  "Almost there.",
];

export default function RestTimer({ step, settings, onComplete }) {
  const encouragement = useRef(
    ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
  );

  const { secondsLeft, start, addSeconds, skip } = useCountdown(
    step.duration,
    {
      onComplete: () => {
        notifyStepComplete(settings);
        onComplete();
      },
    }
  );

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.stepId]);

  const nextExercise = step.restForStep?.exercise;

  return (
    <div className="flex h-full flex-col items-center justify-between px-6 pb-8 pt-10 text-center">
      <div className="animate-pop-in">
        <p className="text-lg font-semibold text-[#6E9B77]">Nice! ✓</p>
        <h2 className="mt-1 text-2xl font-bold tracking-wide text-ink">
          {step.roundTransition ? "REST BEFORE NEXT ROUND" : "REST TIME"}
        </h2>
        {step.roundTransition && (
          <p className="mt-1 text-sm font-medium text-pink-dark">
            Round {step.nextRound} of {step.totalRounds} coming up
          </p>
        )}
        <p className="mt-2 text-sm text-ink-soft">{encouragement.current}</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Timer
          secondsLeft={secondsLeft}
          totalSeconds={step.duration}
          tone="lilac"
        />
        <button
          type="button"
          onClick={() => addSeconds(30)}
          className="press flex items-center gap-1 rounded-full bg-lilac-soft px-4 py-2 text-sm font-semibold text-[#6B4FA0]"
        >
          <Plus size={16} aria-hidden="true" />
          30 sec
        </button>
      </div>

      <div className="w-full space-y-3">
        {nextExercise && (
          <div className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border">
            <ExerciseImage
              src={nextExercise.image}
              alt=""
              category={nextExercise.category}
              rounded="rounded-xl"
              className="h-11 w-11"
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs text-ink-soft">Up next</p>
              <p className="truncate text-sm font-semibold text-ink">
                {nextExercise.name}
              </p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={skip}
          className="press w-full rounded-full bg-ink py-4 text-base font-semibold text-cream shadow-sm"
        >
          Skip Rest
        </button>
      </div>
    </div>
  );
}
