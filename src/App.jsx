import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Workouts from "./pages/Workouts";
import WorkoutIntro from "./pages/WorkoutIntro";
import WorkoutPlayer from "./pages/WorkoutPlayer";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import { getSettings } from "./utils/storage";

export default function App() {
  const location = useLocation();
  // Keep dark mode in sync if it's changed from the Settings page.
  const [darkMode, setDarkMode] = useState(() => getSettings().darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  // Both the workout intro and the active player are focused, single-task
  // screens with their own fixed bottom CTA — the tab bar would just get in
  // the way, so we hide it there.
  const isFullScreenRoute =
    location.pathname.startsWith("/play/") ||
    location.pathname.startsWith("/workout/");

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-cream">
      <main className={isFullScreenRoute ? "h-screen" : "pb-24"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workout/:workoutId" element={<WorkoutIntro />} />
          <Route path="/play/:workoutId" element={<WorkoutPlayer />} />
          <Route path="/progress" element={<Progress />} />
          <Route
            path="/settings"
            element={<Settings onDarkModeChange={setDarkMode} />}
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!isFullScreenRoute && <BottomNav />}
    </div>
  );
}
