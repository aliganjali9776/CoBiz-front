// src/components/LeaderboardScreen.js

import React, { useState, useEffect } from 'react';
import { leaderboardData } from '../data/leaderboardData'; // ایمپورت داده‌های نمونه

function LeaderboardScreen({ onGoToDashboard }) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    // در آینده اینجا از بک‌اند داده‌ها را می‌گیریم
    setRanking(leaderboardData);
  }, []);

  return (
    <div className="leaderboard-container glass-card">
      <div className="page-header">
        <h1>رتبه‌بندی کاربران</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn minimal">
          <i className="fa-solid fa-arrow-left"></i> بازگشت
        </button>
      </div>
      <p className="leaderboard-description">جایگاه خود را در میان تمام مدیران شرکت‌کننده در شبیه‌ساز بحران ببینید.</p>
      
      <div className="leaderboard-list">
        <div className="leaderboard-header">
          <span>رتبه</span>
          <span>کاربر</span>
          <span>امتیاز</span>
        </div>
        {ranking.map(player => (
          <div key={player.rank} className={`leaderboard-row ${player.isCurrentUser ? 'current-user' : ''}`}>
            <span className="rank">{player.rank}</span>
            <span className="name">{player.name}</span>
            <span className="score">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardScreen;