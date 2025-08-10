// src/components/QuizHomeScreen.js

import React, { useMemo } from 'react';
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

// کامپوننت نمودار عملکرد
const PerformanceChart = ({ results }) => {
  const labels = results.map(r => new Date(r.date).toLocaleDateString('fa-IR'));
  const dataPoints = results.map(r => r.percentage);
  const data = {
    labels,
    datasets: [
      {
        label: 'درصد موفقیت',
        data: dataPoints,
        borderColor: '#4e54c8',
        backgroundColor: '#8f94fb',
        tension: 0.1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'روند پیشرفت شما در آزمون مدیریت بحران',
        font: { family: 'Vazirmatn', size: 16, color: '#fff' },
        color: '#fff'
      },
    },
    scales: {
        x: { ticks: { color: '#fff' } },
        y: { ticks: { color: '#fff' } }
    }
  };
  return <Line options={options} data={data} />;
};


function QuizHomeScreen({ user, onStartNewQuiz, onGoToDashboard, onGoToLeaderboard }) {
  if (!user) {
    return <div className="loading-container">در حال بارگذاری...</div>;
  }
  
  const quizResults = user.results?.[quizId] || [];

  return (
    <div className="quiz-home-container">
      <div className="page-header">
        <h1>داشبورد شبیه‌ساز</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn minimal">
          <i className="fa-solid fa-arrow-right"></i> بازگشت
        </button>
      </div>
      <p>در این بخش می‌توانید در شبیه‌سازهای مدیریتی شرکت کرده و نتایج خود را بررسی کنید.</p>
      
      <button className="start-quiz-btn" onClick={onStartNewQuiz}>
        شروع شبیه‌ساز جدید مدیریت بحران
      </button>

      <button className="leaderboard-link-btn" onClick={onGoToLeaderboard}>
        <i className="fa-solid fa-trophy"></i> مشاهده رتبه‌بندی کل
      </button>

      {quizResults.length > 0 ? (
        <>
          <div className="chart-container">
            <PerformanceChart results={quizResults} />
          </div>
          <div className="results-history">
            <h3>تاریخچه آزمون‌ها</h3>
            <ul>
              {quizResults.map((result, index) => (
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
          <p>شما هنوز در هیچ شبیه‌سازی شرکت نکرده‌اید.</p>
          <span>اولین آزمون خود را با کلیک روی دکمه بالا شروع کنید.</span>
        </div>
      )}
    </div>
  );
}

export default QuizHomeScreen;