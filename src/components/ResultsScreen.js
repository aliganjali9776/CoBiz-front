// src/components/ResultsScreen.js

import React from 'react';

const ScoreGauge = ({ percentage }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const validPercentage = isNaN(percentage) ? 0 : percentage;
  const offset = circumference - (validPercentage / 100) * circumference;

  return (
    <div className="score-gauge">
      <svg>
        <circle className="score-gauge-bg" cx="90" cy="90" r={radius}></circle>
        <circle
          className="score-gauge-fg"
          cx="90"
          cy="90"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        ></circle>
      </svg>
      <div className="score-text">{Math.round(validPercentage)}<span>%</span></div>
    </div>
  );
};

// پراپرتی hasUnlockedReport برای نمایش گزارش اضافه شده
function ResultsScreen({ currentScenario, userAnswers = [], onRestart, onUnlockReport, hasUnlockedReport }) {
  
  const { percentage } = React.useMemo(() => {
    if (!userAnswers || !Array.isArray(userAnswers) || !currentScenario?.questions?.length) {
      return { percentage: 0 };
    }
    const userScore = userAnswers.reduce((total, answer) => total + (answer.points || 0), 0);
    const maxScore = currentScenario.questions.length * 10;
    const calculatedPercentage = maxScore > 0 ? (userScore / maxScore) * 100 : 0;
    return { percentage: calculatedPercentage };
  }, [userAnswers, currentScenario]);

  return (
    <div className="results-container">
      <h1>نتایج آزمون</h1>
      <div className="results-summary">
        <h3>سناریو: {currentScenario?.title || 'نامشخص'}</h3>
        <p>درصد موفقیت شما</p>
        <ScoreGauge percentage={percentage} />
      </div>

      {/* منطق جدید: اگر گزارش باز شده باشد، آن را نمایش بده در غیر این صورت دکمه را نشان بده */}
      {hasUnlockedReport ? (
        <div className="answers-review">
          <h3>بررسی کامل پاسخ‌ها:</h3>
          {currentScenario.questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer.points === 10;
            return (
              <div key={index} className={`answer-card ${isCorrect ? 'correct-border' : 'incorrect-border'}`}>
                <h4>{index + 1}. {question.question}</h4>
                <p className={isCorrect ? 'correct' : 'incorrect'}>
                  پاسخ شما: {userAnswer.text} ({userAnswer.points} امتیاز)
                </p>
                <p className="rationale"><span>چرا؟ </span>{userAnswer.rationale}</p>
              </div>
            );
          })}
          <button className="btn btn-secondary" style={{marginTop: '20px'}} onClick={onRestart}>
            بازگشت به داشبورد
          </button>
        </div>
      ) : (
        <div className="report-paywall">
          <h4>گزارش تحلیلی شما آماده است!</h4>
          <p>برای مشاهده تحلیل کامل، نقاط قوت و ضعف و مقایسه عملکردتان، گزارش کامل را دریافت کنید.</p>
          <div className="results-actions">
            <button className="btn btn-primary" onClick={onUnlockReport}>
              <i className="fa-solid fa-file-invoice"></i> دریافت گزارش کامل
            </button>
            <button className="btn btn-secondary" onClick={onRestart}>
              بازگشت به داشبورد
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsScreen;

