import { useCallback, useEffect, useRef, useState } from "react";

// A reliable countdown hook. Ticks once per second using a single interval,
// cleans up on unmount, and never lets two intervals run at once.
export function useCountdown(initialSeconds, { onComplete } = {}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Reset whenever the underlying duration changes (new exercise/step).
  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setIsRunning(false);
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSeconds]);

  useEffect(() => clear, [clear]);

  const tick = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        clear();
        setIsRunning(false);
        if (onCompleteRef.current) onCompleteRef.current();
        return 0;
      }
      return prev - 1;
    });
  }, [clear]);

  const start = useCallback(() => {
    if (intervalRef.current) return; // never double-start
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const pause = useCallback(() => {
    clear();
    setIsRunning(false);
  }, [clear]);

  const resume = useCallback(() => {
    if (secondsLeft <= 0) return;
    start();
  }, [secondsLeft, start]);

  const reset = useCallback(
    (seconds = initialSeconds) => {
      clear();
      setIsRunning(false);
      setSecondsLeft(seconds);
    },
    [clear, initialSeconds]
  );

  const addSeconds = useCallback((amount) => {
    setSecondsLeft((prev) => Math.max(0, prev + amount));
  }, []);

  const skip = useCallback(() => {
    clear();
    setIsRunning(false);
    setSecondsLeft(0);
    if (onCompleteRef.current) onCompleteRef.current();
  }, [clear]);

  return {
    secondsLeft,
    isRunning,
    start,
    pause,
    resume,
    reset,
    addSeconds,
    skip,
  };
}
