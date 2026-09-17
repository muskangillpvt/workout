import ExerciseImage from "./ExerciseImage";

export default function ExerciseCard({ exercise, meta, index, done }) {
  if (!exercise) return null;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border">
      <div className="relative shrink-0">
        <ExerciseImage
          src={exercise.image}
          alt={exercise.name}
          category={exercise.category}
          rounded="rounded-xl"
          className="h-12 w-12"
        />
        {typeof index === "number" && (
          <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cream text-[10px] font-semibold text-ink-soft ring-1 ring-border">
            {index}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">
          {exercise.name}
        </p>
        {meta && <p className="truncate text-xs text-ink-soft">{meta}</p>}
      </div>
      {done && (
        <span className="shrink-0 text-sm font-semibold text-[#6E9B77]">✓</span>
      )}
    </div>
  );
}
