// src/components/QuizScreen.js

import React from 'react';
import { quizData } from '../QuizData';

function QuizScreen({ selectedRole, currentScenario, currentQuestionIndex, onAnswerSelect, onGoBack }) {
  const currentQuestion = currentScenario.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / currentScenario.questions.length) * 100;

  return (
    <div className="quiz-container">
      {/* ۱. هدر جدید با دکمه بازگشت و عنوان سناریو */}
      <div className="quiz-header">
        <button onClick={onGoBack} className="back-to-dashboard-btn minimal">
          <i className="fa-solid fa-arrow-right"></i> بازگشت
        </button>
        <h2>{currentScenario.title}</h2>
      </div>

      {/* ۲. نوار پیشرفت جذاب */}
      <div className="progress-bar-quiz-container">
        <div className="progress-bar-quiz-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      
      {/* ۳. کارت سوال با طراحی جدید و خواناتر */}
      <div className="question-card-main">
        <p className="question-counter">
          سوال {currentQuestionIndex + 1} از {currentScenario.questions.length}
        </p>
        <p className="question-text-main">{currentQuestion.question}</p>
        
        {/* ۴. گرید گزینه‌ها با دکمه‌های جدید و زیبا */}
        <div className="quiz-options-grid">
          {currentQuestion.options.map((option, index) => (
            <button key={index} className="quiz-option-btn" onClick={() => onAnswerSelect(option)}>
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizScreen;