// src/components/QuizHomeScreen.js

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { quizId } from '../QuizData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// کامپوننت نمودار عملکرد (بدون تغییر)
const PerformanceChart = ({ results }) => {
  const labels = results.map(r => new Date(r.date).toLocaleDateString('fa-IR'));
  const dataPoints = results.map(r => r.percentage);
  const data = {
    labels,
    datasets: [
      {
        label: 'درصد موفقیت',
        data: dataPoints,
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.5)',
        tension: 0.2,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'روند پیشرفت شما در آزمون‌ها',
        font: { family: 'Vazirmatn', size: 16 },
        color: '#ecf0f1'
      },
    },
    scales: {
        x: { ticks: { color: '#a4b0be' } },
        y: { ticks: { color: '#a4b0be' } }
    }
  };
  return <Line options={options} data={data} />;
};


function QuizHomeScreen({ user, onStartNewQuiz, onGoToDashboard, onGoToLeaderboard }) {
  if (!user) {
    return <div className="loading-container">در حال بارگذاری...</div>;
  }
  
  const quizResults = user.results?.[quizId] || [];

  // تابع کمکی برای تعیین کلاس رنگ امتیاز
  const getScoreClass = (percentage) => {
    if (percentage >= 70) return 'score-high';
    if (percentage >= 40) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="quiz-home-container">
      <div className="page-header">
        <h1>داشبورد شبیه‌ساز</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn minimal">
          <i className="fa-solid fa-arrow-right"></i> بازگشت
        </button>
      </div>

      <div className="quiz-home-actions">
        <button className="btn btn-primary" onClick={onStartNewQuiz}>
          شروع شبیه‌ساز جدید
        </button>
        <button className="btn btn-secondary" onClick={onGoToLeaderboard}>
          <i className="fa-solid fa-trophy"></i> مشاهده رتبه‌بندی
        </button>
      </div>

      {quizResults.length > 0 ? (
        <>
          <div className="chart-container" style={{marginBottom: '30px'}}>
            <PerformanceChart results={quizResults} />
          </div>
          
          {/* === بخش تاریخچه آزمون‌ها با طراحی جدید === */}
          <div className="results-history">
            <h3>تاریخچه آزمون‌ها</h3>
            <div className="history-list">
              {quizResults.slice().reverse().map((result, index) => ( // .slice().reverse() برای نمایش جدیدترین‌ها در بالا
                <div key={index} className="history-card">
                  <div className="history-card-content">
                    <h4 className="history-title">سناریو: {result.scenarioTitle}</h4>
                    <p className="history-date">{new Date(result.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className={`history-score-badge ${getScoreClass(result.percentage)}`}>
                    {Math.round(result.percentage)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* === پایان بخش بازطراحی شده === */}
        </>
      ) : (
        <div className="no-results-box">
          <p>شما هنوز در هیچ شبیه‌سازی شرکت نکرده‌اید.</p>
          <span>اولین آزمون خود را با کلیک روی دکمه بالا شروع کنید.</span>
        </div>
      )}
    </div>
  );
}

export default QuizHomeScreen;
