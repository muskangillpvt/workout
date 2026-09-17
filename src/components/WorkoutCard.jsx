import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const ACCENTS = {
  pink: {
    bg: "bg-pink-soft",
    text: "text-pink-dark",
    ring: "ring-pink/40",
  },
  lilac: {
    bg: "bg-lilac-soft",
    text: "text-[#8467C4]",
    ring: "ring-lilac/40",
  },
  sage: {
    bg: "bg-cream-dark",
    text: "text-[#5C7A63]",
    ring: "ring-sage/40",
  },
};

// Large hero card — used on Home for "Shift Day" / "Full Workout".
export function HeroWorkoutCard({
  to,
  emoji,
  title,
  meta,
  focus,
  cta,
  accent = "pink",
}) {
  const a = ACCENTS[accent] || ACCENTS.pink;
  return (
    <Link
      to={to}
      className={`press animate-fade-in-up block rounded-[26px] bg-card p-5 shadow-[0_2px_14px_rgba(59,48,44,0.06)] ring-1 ring-inset ${a.ring}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl leading-none" aria-hidden="true">
              {emoji}
            </span>
            <h3 className="text-lg font-bold tracking-wide text-ink">
              {title}
            </h3>
          </div>
          <p className="text-sm text-ink-soft">{meta}</p>
          <p className="mt-0.5 text-sm text-ink-soft">{focus}</p>
        </div>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${a.bg}`}
        >
          <ChevronRight size={18} className={a.text} aria-hidden="true" />
        </div>
      </div>
      <div
        className={`mt-4 inline-flex items-center rounded-full ${a.bg} px-4 py-2 text-sm font-semibold ${a.text}`}
      >
        {cta}
      </div>
    </Link>
  );
}

// Compact list card — used for Session A/B/C and other workout lists.
export function CompactWorkoutCard({ to, emoji, title, subtitle, duration }) {
  return (
    <Link
      to={to}
      className="press animate-fade-in-up flex items-center gap-3 rounded-3xl bg-card p-4 shadow-[0_2px_10px_rgba(59,48,44,0.05)] ring-1 ring-border"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-soft text-xl">
        <span aria-hidden="true">{emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink">{title}</p>
        <p className="truncate text-sm text-ink-soft">{subtitle}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs font-medium text-ink-soft">{duration}</p>
      </div>
      <ChevronRight
        size={18}
        className="shrink-0 text-ink-soft"
        aria-hidden="true"
      />
    </Link>
  );
}
