// src/components/DashboardScreen.js

import React from 'react';
import logo from '../logo.jpeg';

function DashboardScreen({ user, onGoToQuizHome, onGoToOKR, onGoToCalendar, onGoToKnowledge, onGoToAI, onGoToPomodoro, onLogout }) {
  if (!user) {
    return <div className="loading-container">در حال بارگذاری...</div>;
  }

  return (
    <div className="main-menu-container">
      <div className="main-menu-header">
        <img src={logo} alt="لوگو" className="app-logo-small" />
        <div>
          <h2>سلام، {user.name}!</h2>
          <p>به داشبورد دستیار مدیر خوش آمدید.</p>
        </div>
        <button onClick={onLogout} className="logout-btn-icon"><i className="fa-solid fa-right-from-bracket"></i></button>
      </div>

      <div className="main-menu-grid">
        <div className="menu-item" onClick={onGoToQuizHome}>
          <div className="menu-item-icon">
            <i className="fa-solid fa-file-signature"></i>
          </div>
          <span>آزمون‌ها</span>
        </div>

        <div className="menu-item" onClick={onGoToOKR}>
          <div className="menu-item-icon">
            <i className="fa-solid fa-bullseye"></i>
          </div>
          <span>اهداف (OKR)</span>
        </div>
        
        <div className="menu-item" onClick={onGoToCalendar}>
          <div className="menu-item-icon">
            <i className="fa-solid fa-calendar-days"></i>
          </div>
          <span>تقویم هوشمند</span>
        </div>

        <div className="menu-item" onClick={onGoToKnowledge}>
          <div className="menu-item-icon">
            <i className="fa-solid fa-book-bookmark"></i>
          </div>
          <span>کتابخانه دانش</span>
        </div>

        <div className="menu-item" onClick={onGoToAI}>
          <div className="menu-item-icon">
            <i className="fa-solid fa-robot"></i>
          </div>
          <span>دستیار AI</span>
        </div>
        
        <div className="menu-item" onClick={onGoToPomodoro}>
          <div className="menu-item-icon">
            <i className="fa-solid fa-clock"></i>
          </div>
          <span>تایمر پومودورو</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;