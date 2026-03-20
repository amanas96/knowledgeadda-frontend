import React, { useEffect, useState } from "react";

const Timer = ({ duration, onEnd, quizId }) => {
  const TIMER_KEY = `quiz_timer_${quizId}`;

  const getSecondsLeft = () => {
    try {
      const saved = localStorage.getItem(TIMER_KEY);
      if (saved) {
        const endTime = Number(saved);
        const remaining = Math.floor((endTime - Date.now()) / 1000);
        // ✅ If time already expired, return 0
        return remaining > 0 ? remaining : 0;
      }
    } catch {
      // ignore
    }

    // ✅ First time — save end time and return full duration
    const endTime = Date.now() + duration * 60 * 1000;
    localStorage.setItem(TIMER_KEY, endTime.toString());
    return duration * 60;
  };

  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);

  useEffect(() => {
    if (secondsLeft <= 0) {
      localStorage.removeItem(TIMER_KEY);
      onEnd();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          localStorage.removeItem(TIMER_KEY);
          onEnd();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // ✅ runs once only

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  // ✅ Color changes as time runs out
  const isWarning = secondsLeft < 300; // under 5 mins
  const isDanger = secondsLeft < 60; // under 1 min

  return (
    <div
      className={`text-right text-lg text-white font-semibold ${
        isDanger
          ? "text-red-600 animate-pulse"
          : isWarning
            ? "text-amber-500"
            : "text-gray-700"
      }`}
    >
      ⏱ {mins}:{secs.toString().padStart(2, "0")}
    </div>
  );
};

export default Timer;
