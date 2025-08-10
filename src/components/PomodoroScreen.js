// src/components/PomodoroScreen.js

import React, { useState, useEffect, useRef, useMemo } from 'react';
import moment from 'moment-jalaali';

const MODES = {
  work: { time: 25 * 60, name: 'تمرکز', color: '#4ade80' },
  shortBreak: { time: 5 * 60, name: 'استراحت کوتاه', color: '#60a5fa' },
  longBreak: { time: 15 * 60, name: 'استراحت طولانی', color: '#facc15' }
};
const POINTS_PER_CYCLE = 10;
const GOAL = 4;

function PomodoroScreen({ user, onUpdateUser, onGoToDashboard }) {
  // ... تمام منطق و state های کامپوننت بدون تغییر باقی می‌ماند ...
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(MODES[mode].time);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef(null);
  const todayString = moment().format('jYYYY-jM-jD');
  const pomodoroStats = useMemo(() => user.pomodoroStats || { dailyCycles: {}, totalPoints: 0 }, [user]);
  const todaysCycles = pomodoroStats.dailyCycles[todayString] || 0;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      audioRef.current.play().catch(e => console.log("Audio play failed."));
      if (mode === 'work') {
        const newCycleCount = todaysCycles + 1;
        const newTotalPoints = pomodoroStats.totalPoints + POINTS_PER_CYCLE;
        const updatedStats = {
          ...pomodoroStats,
          dailyCycles: { ...pomodoroStats.dailyCycles, [todayString]: newCycleCount },
          totalPoints: newTotalPoints
        };
        onUpdateUser({ ...user, pomodoroStats: updatedStats });
        switchMode(newCycleCount % GOAL === 0 ? 'longBreak' : 'shortBreak');
      } else {
        switchMode('work');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].time);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (MODES[mode].time - timeLeft) / MODES[mode].time;
  const circumference = 54 * 2 * Math.PI;
  const offset = circumference * (1 - progress);

  return (
    <div className="pomodoro-container v3-design">
        {/* --- هدر و دکمه بازگشت اینجا اضافه شد --- */}
        <div className="page-header pomodoro-page-header">
          <h1>تایمر پومودورو</h1>
          <button onClick={onGoToDashboard} className="back-to-dashboard-btn">
              <i className="fa-solid fa-arrow-right"></i> بازگشت
          </button>
        </div>

        <main className="pomodoro-card">
            <div className="timer-display-wrapper">
                <svg className="timer-svg" viewBox="0 0 120 120">
                    <circle className="timer-circle-bg" cx="60" cy="60" r="54" />
                    <circle className="timer-circle-progress" cx="60" cy="60" r="54" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={offset}
                        style={{ stroke: MODES[mode].color }}
                    />
                </svg>
                <div className="timer-text-content">
                    <span className="timer-time">{formatTime(timeLeft)}</span>
                    <span className="timer-mode-text">{MODES[mode].name}</span>
                </div>
            </div>

            <div className="pomodoro-controls">
                <button className="reset-btn" onClick={() => switchMode(mode)}>
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
                <button className="start-pause-btn" onClick={() => setIsActive(!isActive)}>
                    {isActive ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
                    <span>{isActive ? 'توقف' : 'شروع'}</span>
                </button>
            </div>

            <div className="mode-selection">
                <button className={`mode-button ${mode === 'work' ? 'active' : ''}`} onClick={() => switchMode('work')}>تمرکز</button>
                <button className={`mode-button ${mode === 'shortBreak' ? 'active' : ''}`} onClick={() => switchMode('shortBreak')}>استراحت کوتاه</button>
                <button className={`mode-button ${mode === 'longBreak' ? 'active' : ''}`} onClick={() => switchMode('longBreak')}>استراحت طولانی</button>
            </div>

            <div className="pomodoro-stats">
                <h3>آمار امروز</h3>
                <div className="stats-grid">
                    <div>
                        <p className="stats-value">{todaysCycles}</p>
                        <p className="stats-label">دوره‌های تکمیل شده</p>
                    </div>
                    <div>
                        <p className="stats-value">{todaysCycles * POINTS_PER_CYCLE}</p>
                        <p className="stats-label">امتیاز کسب شده</p>
                    </div>
                </div>
            </div>
        </main>
        <audio ref={audioRef} src="/ring.mp3" />
    </div>
  );
}

export default PomodoroScreen;