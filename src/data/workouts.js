// Workout definitions. Each workout is built from "blocks":
//   { kind: "single", exerciseId, reps?, duration?, sides?, rest? }
//   { kind: "circuit", label, rounds, restBetweenRounds, exercises: [ {exerciseId, reps?, duration?, rest?} ] }
//   { kind: "interval", label, rounds, briskDuration, easyDuration }
//
// workoutUtils.js turns these into a flat, playable step sequence.

export const WORKOUTS = {
  shiftDay: {
    id: "shiftDay",
    type: "shift",
    title: "SHIFT DAY",
    subtitle: "You already spent hours on your feet. Keep today light.",
    duration: "10–15 min",
    emoji: "🍔",
    intro:
      "This is a recovery session — gentle movement and posture work, nothing intense.",
    blocks: [
      { kind: "single", exerciseId: "easy-walk", duration: 300, rest: 30 },
      { kind: "single", exerciseId: "wall-angels", reps: "10", rest: 45 },
      { kind: "single", exerciseId: "rows", reps: "12", rest: 60 },
      { kind: "single", exerciseId: "glute-bridge", reps: "15", rest: 60 },
      { kind: "single", exerciseId: "dead-bug", reps: "8 each side", rest: 45 },
      { kind: "single", exerciseId: "bird-dog", reps: "8 each side", rest: 45 },
      { kind: "single", exerciseId: "plank", duration: 25, rest: 45 },
      {
        kind: "single",
        exerciseId: "chest-stretch",
        duration: 30,
        sides: 2,
        rest: 15,
      },
    ],
  },

  quickShift: {
    id: "quickShift",
    type: "shift",
    title: "QUICK SHIFT",
    subtitle: "That's enough for today.",
    duration: "5–8 min",
    emoji: "🍔",
    intro: "The bare minimum to keep moving. No pressure to do more than this.",
    blocks: [
      { kind: "single", exerciseId: "wall-angels", reps: "10", rest: 30 },
      { kind: "single", exerciseId: "rows", reps: "12", rest: 30 },
      { kind: "single", exerciseId: "dead-bug", reps: "8 each side", rest: 30 },
      {
        kind: "single",
        exerciseId: "chest-stretch",
        duration: 30,
        sides: 2,
        rest: 0,
      },
    ],
  },

  sessionA: {
    id: "sessionA",
    type: "full",
    title: "SESSION A",
    subtitle: "Shoulders + Back + Core",
    duration: "35–40 min",
    emoji: "💪",
    intro:
      "A warm-up, then 3 rounds of a full strength circuit, finishing with an easy walk.",
    blocks: [
      {
        kind: "circuit",
        label: "Warm-up",
        rounds: 1,
        restBetweenRounds: 0,
        exercises: [
          { exerciseId: "march-walk", duration: 120, rest: 15 },
          { exerciseId: "arm-circles", duration: 30, rest: 15 },
          { exerciseId: "shoulder-rolls", reps: "10", rest: 15 },
          { exerciseId: "hip-circles", reps: "10", rest: 15 },
          { exerciseId: "good-morning", reps: "10", rest: 20 },
        ],
      },
      {
        kind: "circuit",
        label: "Strength Circuit",
        rounds: 3,
        restBetweenRounds: 75,
        exercises: [
          { exerciseId: "squats", reps: "12–15", rest: 20 },
          { exerciseId: "incline-pushup", reps: "10–12", rest: 20 },
          { exerciseId: "rows", reps: "12–15", rest: 20 },
          { exerciseId: "glute-bridge", reps: "15", rest: 20 },
          { exerciseId: "wall-angels", reps: "10", rest: 20 },
          { exerciseId: "dead-bug", reps: "8 each side", rest: 20 },
          { exerciseId: "plank", duration: 30, rest: 0 },
        ],
      },
      {
        kind: "single",
        exerciseId: "easy-walk",
        duration: 420,
        rest: 0,
        label: "Finish Walk",
      },
    ],
  },

  sessionB: {
    id: "sessionB",
    type: "full",
    title: "SESSION B",
    subtitle: "Stamina + Core",
    duration: "35–45 min",
    emoji: "💪",
    intro:
      "An interval walk to build stamina, then a core circuit to finish strong.",
    blocks: [
      {
        kind: "single",
        exerciseId: "easy-walk",
        duration: 300,
        rest: 20,
        label: "Warm-up Walk",
      },
      {
        kind: "interval",
        label: "Interval Walk",
        rounds: 8,
        briskDuration: 120,
        easyDuration: 60,
      },
      {
        kind: "single",
        exerciseId: "easy-walk",
        duration: 300,
        rest: 30,
        label: "Cool-down Walk",
      },
      {
        kind: "circuit",
        label: "Core Circuit",
        rounds: 3,
        restBetweenRounds: 60,
        exercises: [
          { exerciseId: "dead-bug", reps: "10 each side", rest: 20 },
          { exerciseId: "bird-dog", reps: "10 each side", rest: 20 },
          { exerciseId: "plank", duration: 30, rest: 20 },
          {
            exerciseId: "side-plank",
            duration: 20,
            sides: 2,
            rest: 20,
          },
          { exerciseId: "glute-bridge", reps: "15", rest: 0 },
        ],
      },
    ],
  },

  sessionC: {
    id: "sessionC",
    type: "full",
    title: "SESSION C",
    subtitle: "Full Body + Posture",
    duration: "35–40 min",
    emoji: "💪",
    intro: "3 rounds of full-body strength and posture work, then a comfortable walk.",
    blocks: [
      {
        kind: "circuit",
        label: "Full Body Circuit",
        rounds: 3,
        restBetweenRounds: 75,
        exercises: [
          { exerciseId: "squats", reps: "15", rest: 20 },
          { exerciseId: "reverse-lunge", reps: "8 per leg", rest: 20 },
          { exerciseId: "incline-pushup", reps: "10", rest: 20 },
          { exerciseId: "rows", reps: "15", rest: 20 },
          { exerciseId: "reverse-fly", reps: "10–12", rest: 20 },
          { exerciseId: "glute-bridge", reps: "15", rest: 20 },
          { exerciseId: "dead-bug", reps: "10 each side", rest: 20 },
          { exerciseId: "plank", duration: 35, rest: 0 },
        ],
      },
      {
        kind: "single",
        exerciseId: "easy-walk",
        duration: 600,
        rest: 0,
        label: "Finish Walk",
      },
    ],
  },

  shoulderReset: {
    id: "shoulderReset",
    type: "posture",
    title: "SHOULDER RESET",
    subtitle: "Posture + upper-back strength",
    duration: "6–8 min",
    emoji: "🌷",
    intro:
      "Think: shoulders relaxed, chest open, neck long. Don't force your shoulders backward.",
    blocks: [
      { kind: "single", exerciseId: "wall-angels", reps: "10", rest: 30 },
      { kind: "single", exerciseId: "rows", reps: "12", rest: 45 },
      { kind: "single", exerciseId: "reverse-fly", reps: "10–12", rest: 30 },
      {
        kind: "single",
        exerciseId: "chest-stretch",
        duration: 30,
        sides: 2,
        rest: 0,
      },
    ],
  },
};

export function getWorkout(id) {
  return WORKOUTS[id] || null;
}

export const FULL_SESSION_IDS = ["sessionA", "sessionB", "sessionC"];
