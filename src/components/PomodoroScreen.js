// src/components/PomodoroScreen.js

import React, { useState, useEffect, useRef } from 'react';

const WORK_MINUTES = 25;
const SHORT_BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;

function PomodoroScreen({ onGoToDashboard }) {
  const [minutes, setMinutes] = useState(WORK_MINUTES);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work | shortBreak | longBreak
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // رفرنس به فایل صوتی
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // زمان تمام شد
            audioRef.current.play();
            if (mode === 'work') {
              const newPomodoroCount = pomodoroCount + 1;
              setPomodoroCount(newPomodoroCount);
              // بعد از ۴ پومودورو، استراحت طولانی
              switchMode(newPomodoroCount % 4 === 0 ? 'longBreak' : 'shortBreak');
            } else {
              switchMode('work');
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // پاکسازی در زمان unmount
  }, [isActive, seconds, minutes, mode, pomodoroCount]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    switchMode(mode);
  };
  
  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'work') {
      setMinutes(WORK_MINUTES);
    } else if (newMode === 'shortBreak') {
      setMinutes(SHORT_BREAK_MINUTES);
    } else {
      setMinutes(LONG_BREAK_MINUTES);
    }
    setSeconds(0);
  };
  
  // فرمت کردن زمان برای نمایش دو رقمی
  const formatTime = (time) => time < 10 ? `0${time}` : time;

  return (
    <div className="pomodoro-container">
      <div className="page-header">
        <h1>تایمر پومودورو</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn">
          <i className="fa-solid fa-arrow-right"></i> بازگشت به منوی اصلی
        </button>
      </div>
      <div className="timer-card">
        <div className="timer-modes">
          <button className={mode === 'work' ? 'active' : ''} onClick={() => switchMode('work')}>تمرکز</button>
          <button className={mode === 'shortBreak' ? 'active' : ''} onClick={() => switchMode('shortBreak')}>استراحت کوتاه</button>
          <button className={mode === 'longBreak' ? 'active' : ''} onClick={() => switchMode('longBreak')}>استراحت طولانی</button>
        </div>
        <div className="timer-display">
          <span>{formatTime(minutes)}</span>:<span>{formatTime(seconds)}</span>
        </div>
        <div className="timer-controls">
          <button className="control-btn main" onClick={toggleTimer}>
            {isActive ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
            {isActive ? 'توقف' : 'شروع'}
          </button>
          <button className="control-btn" onClick={resetTimer}>
            <i className="fa-solid fa-rotate-right"></i>
            ریست
          </button>
        </div>
      </div>
      <audio ref={audioRef} src="/ring.mp3" />
    </div>
  );
}

export default PomodoroScreen;