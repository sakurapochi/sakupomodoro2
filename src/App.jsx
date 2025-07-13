import React, { useState, useRef } from "react";

const POMODORO_MINUTES = 25;
const BREAK_MINUTES = 5;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function App() {
  const [seconds, setSeconds] = useState(POMODORO_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef(null);

  React.useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev > 0) return prev - 1;
          clearInterval(timerRef.current);
          if (!isBreak) {
            setIsBreak(true);
            setSeconds(BREAK_MINUTES * 60);
            setIsRunning(true);
          } else {
            setIsBreak(false);
            setSeconds(POMODORO_MINUTES * 60);
            setIsRunning(false);
          }
          return prev;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isBreak]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setSeconds(POMODORO_MINUTES * 60);
  };

  return (
    <div className="container">
      <div className="timer-box">
        <h1>Sakura Pomodoro Timer</h1>
        <p className="session-label">{isBreak ? "Break Time" : "Focus Time"}</p>
        <div className="timer">{formatTime(seconds)}</div>
        <div className="controls">
          {!isRunning ? (
            <button onClick={handleStart}>Start</button>
          ) : (
            <button onClick={handlePause}>Pause</button>
          )}
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
      <footer>
        Photo by <a href="https://unsplash.com/@yu_kato" target="_blank" rel="noopener noreferrer">Yu Kato</a> on Unsplash
      </footer>
    </div>
  );
}
