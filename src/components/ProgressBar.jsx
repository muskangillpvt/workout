export default function ProgressBar({
  value,
  max = 100,
  color = "bg-pink",
  trackColor = "bg-cream-dark",
  height = "h-2.5",
  label,
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 text-xs font-medium text-ink-soft">{label}</div>
      )}
      <div
        className={`w-full ${height} ${trackColor} rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${height} ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
