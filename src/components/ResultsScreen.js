// src/components/ResultsScreen.js

import React, { useState, useEffect } from 'react';
import { quizData } from '../QuizData';
import logo from '../logo.jpeg';

function ResultsScreen({ selectedRole, currentScenario, userAnswers, onRestart, hasUnlockedReport, onUnlockReport }) {
  const [result, setResult] = useState({ userScore: 0, maxScore: 0, percentage: 0 });

  useEffect(() => {
    const userScore = userAnswers.reduce((total, answer) => total + answer.points, 0);
    const maxScore = currentScenario.questions.length * 10;
    const percentage = maxScore > 0 ? (userScore / maxScore) * 100 : 0;
    setResult({ userScore, maxScore, percentage });
  }, [userAnswers, currentScenario]);

  return (
    <div className="App">
      <div className="results-container">
        <img src={logo} alt="لوگوی مدیر یک دقیقه‌ای" className="app-logo" />
        <h1>نتایج آزمون</h1>
        <h2>سناریو: {currentScenario.title}</h2>
        
        {/* این بخش همیشه رایگان نمایش داده می‌شود */}
        <div className="score-circle">
          <p>درصد موفقیت شما</p>
          <span>{Math.round(result.percentage)}%</span>
        </div>

        {/* منطق Freemium برای نمایش گزارش */}
        {hasUnlockedReport ? (
          <div className="answers-review">
            <h3>بررسی کامل پاسخ‌ها:</h3>
            {currentScenario.questions.map((_, index) => {
              const userAnswer = userAnswers[index];
              const originalScenario = quizData[selectedRole].scenarios.find(s => s.title === currentScenario.title);
              const originalQuestion = originalScenario.questions[index];
              const correctAnswer = originalQuestion.options.find(opt => opt.points === 10);
              const isCorrect = userAnswer.points === 10;

              return (
                <div key={index} className={`answer-card ${isCorrect ? 'correct-border' : 'incorrect-border'}`}>
                  <h4>{index + 1}. {originalQuestion.question}</h4>
                  <p className={isCorrect ? 'correct' : 'incorrect'}>
                    پاسخ شما: {userAnswer.text} ({userAnswer.points} امتیاز)
                  </p>
                  <p className="rationale"><span>چرا؟ </span>{userAnswer.rationale}</p>
                  {!isCorrect && correctAnswer && (
                    <p className="rationale-correct">
                      <span>پاسخ بهتر: </span>{correctAnswer.text}
                      <br/>
                      <span>چرا؟ </span> {correctAnswer.rationale}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="report-paywall">
            <h3>گزارش تحلیلی شما آماده است!</h3>
            <p>برای مشاهده تحلیل کامل هر سوال، نقاط قوت و ضعف مدیریتی خود و مقایسه عملکردتان، گزارش کامل را دریافت کنید.</p>
            <button className="unlock-button" onClick={onUnlockReport}>
              🔒 دریافت گزارش کامل تحلیلی
            </button>
          </div>
        )}
        
        <button onClick={onRestart}>بازگشت به داشبورد</button>
      </div>
    </div>
  );
}

export default ResultsScreen;