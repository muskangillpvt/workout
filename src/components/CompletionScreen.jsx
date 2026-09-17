import { Link } from "react-router-dom";

export default function CompletionScreen({ workout, durationMin, exerciseNames }) {
  return (
    <div className="flex h-full flex-col items-center justify-between px-6 pb-8 pt-14 text-center">
      <div className="animate-pop-in flex flex-col items-center">
        <span className="animate-float text-5xl" aria-hidden="true">
          🌷
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-wide text-ink">
          YOU DID IT
        </h1>
        <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-pink-dark">
          {workout.title}
        </p>
        <p className="text-sm text-ink-soft">{durationMin} minutes</p>
      </div>

      <div className="w-full flex-1 overflow-y-auto py-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Completed exercises
        </p>
        <ul className="space-y-2 text-left">
          {exerciseNames.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 text-sm text-ink ring-1 ring-border"
            >
              <span className="text-[#6E9B77]" aria-hidden="true">
                ✓
              </span>
              {name}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full space-y-3">
        <p className="text-sm text-ink-soft">Keep building.</p>
        <Link
          to="/"
          className="press block w-full rounded-full bg-pink py-4 text-center text-base font-bold text-white shadow-sm"
        >
          Done
        </Link>
      </div>
    </div>
  );
}
