// src/components/QuizHomeScreen.js

import React from 'react';
import { Line } from 'react-chartjs-2'; // نمودار را به اینجا منتقل می‌کنیم
// ... بقیه import های ChartJS ...

// کامپوننت نمودار را هم به این فایل منتقل می‌کنیم
const PerformanceChart = ({ results }) => { /* ... کد کامل نمودار ... */ };

function QuizHomeScreen({ user, onStartNewQuiz, onGoToDashboard }) {
  const results = user.results || {};
  const crisisResults = results['crisis-management'] || [];

  return (
    <div className="quiz-home-container">
      <div className="page-header">
        <h1>داشبورد آزمون‌ها</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn">
          <i className="fa-solid fa-arrow-right"></i> بازگشت به منوی اصلی
        </button>
      </div>
      <p>در این بخش می‌توانید در آزمون‌های شبیه‌ساز شرکت کرده و نتایج خود را بررسی کنید.</p>
      
      <button className="start-quiz-btn" onClick={onStartNewQuiz}>
        شروع آزمون جدید مدیریت بحران
      </button>

      {crisisResults.length > 0 ? (
        <>
          <div className="chart-container">
            <PerformanceChart results={crisisResults} />
          </div>
          <div className="results-history">
            <h3>تاریخچه آزمون‌ها</h3>
            <ul>
              {crisisResults.map((result, index) => (
                <li key={index}>
                  <span className="result-scenario">سناریو: {result.scenarioTitle}</span>
                  <span className="result-score">امتیاز: {Math.round(result.percentage)}%</span>
                  <span className="result-date">{new Date(result.date).toLocaleDateString('fa-IR')}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="no-results-box">
          <p>شما هنوز در هیچ آزمونی شرکت نکرده‌اید.</p>
          <span>اولین آزمون خود را با کلیک روی دکمه بالا شروع کنید.</span>
        </div>
      )}
    </div>
  );
}

export default QuizHomeScreen;