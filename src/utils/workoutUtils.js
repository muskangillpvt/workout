import { getExercise } from "../data/exercises";

let uid = 0;
function nextId() {
  uid += 1;
  return `step-${uid}`;
}

function makeExerciseStep({
  exercise,
  type,
  reps,
  duration,
  round,
  sectionLabel,
  sideLabel,
}) {
  return {
    stepId: nextId(),
    kind: "exercise",
    exercise,
    exerciseType: type,
    reps: reps || null,
    duration: duration || null,
    round: round || null,
    sectionLabel: sectionLabel || null,
    sideLabel: sideLabel || null,
  };
}

function makeRestStep(duration, meta = {}) {
  return {
    stepId: nextId(),
    kind: "rest",
    duration,
    restFor: null, // filled in a post-pass
    roundTransition: meta.roundTransition || false,
    nextRound: meta.nextRound || null,
    totalRounds: meta.totalRounds || null,
  };
}

function pushSingleSteps(steps, block) {
  const ex = getExercise(block.exerciseId);
  if (!ex) return;
  const sides = block.sides || ex.defaultSides || null;

  if (sides) {
    for (let s = 1; s <= sides; s += 1) {
      steps.push(
        makeExerciseStep({
          exercise: ex,
          type: ex.type,
          duration: block.duration || ex.defaultDuration,
          reps: block.reps || ex.defaultReps,
          sectionLabel: block.label || null,
          sideLabel: `Side ${s} of ${sides}`,
        })
      );
    }
  } else {
    steps.push(
      makeExerciseStep({
        exercise: ex,
        type: ex.type,
        duration: block.duration || (ex.type === "duration" ? ex.defaultDuration : null),
        reps: block.reps || (ex.type === "reps" ? ex.defaultReps : null),
        sectionLabel: block.label || null,
      })
    );
  }

  const restLen = block.rest ?? ex.defaultRest;
  if (restLen > 0) {
    steps.push(makeRestStep(restLen));
  }
}

function pushCircuitSteps(steps, block) {
  for (let r = 1; r <= block.rounds; r += 1) {
    block.exercises.forEach((exDef) => {
      const ex = getExercise(exDef.exerciseId);
      if (!ex) return;
      const sides = exDef.sides || ex.defaultSides || null;
      const roundInfo =
        block.rounds > 1 ? { current: r, total: block.rounds } : null;

      if (sides) {
        for (let s = 1; s <= sides; s += 1) {
          steps.push(
            makeExerciseStep({
              exercise: ex,
              type: ex.type,
              duration: exDef.duration || ex.defaultDuration,
              reps: exDef.reps || ex.defaultReps,
              round: roundInfo,
              sectionLabel: block.label,
              sideLabel: `Side ${s} of ${sides}`,
            })
          );
        }
      } else {
        steps.push(
          makeExerciseStep({
            exercise: ex,
            type: ex.type,
            duration: exDef.duration || (ex.type === "duration" ? ex.defaultDuration : null),
            reps: exDef.reps || (ex.type === "reps" ? ex.defaultReps : null),
            round: roundInfo,
            sectionLabel: block.label,
          })
        );
      }

      const restLen = exDef.rest ?? ex.defaultRest;
      if (restLen > 0) {
        steps.push(makeRestStep(restLen));
      }
    });

    if (r < block.rounds && block.restBetweenRounds > 0) {
      steps.push(
        makeRestStep(block.restBetweenRounds, {
          roundTransition: true,
          nextRound: r + 1,
          totalRounds: block.rounds,
        })
      );
    }
  }
}

function pushIntervalSteps(steps, block) {
  const brisk = getExercise("brisk-walk");
  const easy = getExercise("easy-walk");
  for (let r = 1; r <= block.rounds; r += 1) {
    const roundInfo = { current: r, total: block.rounds };
    steps.push(
      makeExerciseStep({
        exercise: brisk,
        type: "duration",
        duration: block.briskDuration,
        round: roundInfo,
        sectionLabel: block.label,
      })
    );
    steps.push(
      makeExerciseStep({
        exercise: easy,
        type: "duration",
        duration: block.easyDuration,
        round: roundInfo,
        sectionLabel: block.label,
      })
    );
  }
}

// Turns a workout definition (see data/workouts.js) into a flat, ordered
// array of playable steps (exercise + rest), ready for the WorkoutPlayer.
export function flattenWorkout(workout, options = {}) {
  const steps = [];
  workout.blocks.forEach((block) => {
    if (block.kind === "single") pushSingleSteps(steps, block);
    else if (block.kind === "circuit") pushCircuitSteps(steps, block);
    else if (block.kind === "interval") pushIntervalSteps(steps, block);
  });

  // Drop a trailing rest step — no need to rest after the very last exercise.
  while (steps.length && steps[steps.length - 1].kind === "rest") {
    steps.pop();
  }

  // Fill in "up next" info for each rest step, and apply a global rest
  // override from settings if provided.
  for (let i = 0; i < steps.length; i += 1) {
    if (steps[i].kind === "rest") {
      if (options.restOverride != null && !steps[i].roundTransition) {
        steps[i].duration = options.restOverride;
      }
      const next = steps[i + 1];
      if (next && next.kind === "exercise") {
        steps[i].restFor = next.exercise.name;
        steps[i].restForStep = next;
      }
    }
  }

  if (steps.length) {
    steps[steps.length - 1].isLast = true;
  }

  return steps;
}

// Rough estimate (in seconds) of total workout time, for display purposes.
export function estimateWorkoutSeconds(workout) {
  const steps = flattenWorkout(workout);
  let total = 0;
  steps.forEach((step) => {
    if (step.kind === "rest") {
      total += step.duration;
    } else if (step.exerciseType === "duration") {
      total += step.duration || 0;
    } else {
      // Rough guess for rep-based exercises: ~3 seconds per rep, min 20s.
      total += 30;
    }
  });
  return total;
}

export function formatSeconds(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}

export function formatMinutesLabel(totalSeconds) {
  const mins = Math.max(1, Math.round(totalSeconds / 60));
  return `${mins} min`;
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Summarises this week's workout history for the Home + Progress pages.
export function getWeekOverview(history) {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEntries = history.filter((entry) => {
    const d = new Date(entry.date);
    return d >= weekStart && d <= now;
  });

  const fullCount = weekEntries.filter((e) => e.type === "full").length;
  const totalMinutes = weekEntries.reduce(
    (sum, e) => sum + (e.durationMin || 0),
    0
  );
  const staminaMinutes = weekEntries
    .filter((e) => e.workoutId === "sessionB")
    .reduce((sum, e) => sum + (e.durationMin || 0), 0);

  const days = DAY_LABELS.map((label, i) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + i);
    const done = weekEntries.some((e) => {
      const d = new Date(e.date);
      return (
        d.getFullYear() === dayDate.getFullYear() &&
        d.getMonth() === dayDate.getMonth() &&
        d.getDate() === dayDate.getDate()
      );
    });
    const isToday =
      dayDate.getFullYear() === now.getFullYear() &&
      dayDate.getMonth() === now.getMonth() &&
      dayDate.getDate() === now.getDate();
    return { label, done, isToday };
  });

  return { fullCount, totalMinutes, staminaMinutes, days };
}

// Simple day-streak: consecutive days (including today) with a workout.
export function getCurrentStreak(history) {
  if (!history.length) return 0;
  const daysWithWorkout = new Set(
    history.map((e) => new Date(e.date).toDateString())
  );
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (daysWithWorkout.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function formatRelativeDate(isoDate) {
  const date = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";

  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return date.toLocaleDateString(undefined, { weekday: "long" });
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
