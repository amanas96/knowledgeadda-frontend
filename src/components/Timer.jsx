import React, { useEffect, useState } from "react";

const Timer = ({ duration, onEnd }) => {
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onEnd();
      return;
    }
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, onEnd]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="text-right mb-4 text-lg font-semibold">
      ⏱ {mins}:{secs.toString().padStart(2, "0")}
    </div>
  );
};

export default Timer;
