import { formatSeconds } from "../utils/workoutUtils";

// Purely presentational big countdown display, shared by the exercise
// player (when timing a duration exercise) and the rest screen.
export default function Timer({
  secondsLeft,
  totalSeconds,
  size = "large",
  tone = "pink",
}) {
  const pct =
    totalSeconds > 0 ? Math.max(0, Math.min(1, secondsLeft / totalSeconds)) : 0;
  const dimension = size === "large" ? 210 : 160;
  const stroke = size === "large" ? 12 : 10;
  const radius = dimension / 2 - stroke;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct);
  const ringColor = tone === "lilac" ? "#C9B8E8" : "#E9A9B4";

  return (
    <div
      className="relative mx-auto flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
      role="timer"
      aria-live="polite"
      aria-label={`${formatSeconds(secondsLeft)} remaining`}
    >
      <svg
        width={dimension}
        height={dimension}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="var(--color-cream-dark)"
          strokeWidth={stroke}
        />
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.4s linear" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className={`font-bold tabular-nums text-ink ${
            size === "large" ? "text-5xl" : "text-4xl"
          }`}
        >
          {formatSeconds(secondsLeft)}
        </span>
      </div>
    </div>
  );
}
