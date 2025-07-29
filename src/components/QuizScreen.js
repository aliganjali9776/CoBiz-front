// src/components/QuizScreen.js

import React from 'react';
import { quizData } from '../QuizData';
import logo from '../logo.jpeg';

function QuizScreen({ selectedRole, currentScenario, currentQuestionIndex, onAnswerSelect }) {
  const currentQuestion = currentScenario.questions[currentQuestionIndex];

  return (
    <div className="App">
      <div className="quiz-container">
        <img src={logo} alt="لوگوی مدیر یک دقیقه‌ای" className="app-logo" />
        <div className="scenario-header">
          <h2>نقش: {quizData[selectedRole].name}</h2>
          <h3>سناریو: {currentScenario.title}</h3>
          <p className="scenario-description">{currentScenario.description}</p>
        </div>
        <div className="question-card">
          <h4>سوال {currentQuestionIndex + 1} از {currentScenario.questions.length}</h4>
          <p className="question-text">{currentQuestion.question}</p>
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <button key={index} onClick={() => onAnswerSelect(option)}>
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizScreen;