// src/App.js

import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google'; // ۱. ایمپورت کتابخانه گوگل
import { quizId, quizData } from './QuizData'; 
import { reviewsData } from './data/reviewsData';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import OKRScreen from './components/OKRScreen';
import QuizHomeScreen from './components/QuizHomeScreen';
import CalendarScreen from './components/CalendarScreen';
import KnowledgeScreen from './components/KnowledgeScreen';
// کامپوننت AIScreen قبلاً حذف شده است
import PomodoroScreen from './components/PomodoroScreen';
import ReviewHomeScreen from './components/ReviewHomeScreen';
import ReviewDetailScreen from './components/ReviewDetailScreen';
import PricesScreen from './components/PricesScreen';
import NewsScreen from './components/NewsScreen';
import './App.css';

// ۲. Client ID شما اینجا قرار گرفت
const GOOGLE_CLIENT_ID = "395041529266-l0vt0ufonj84e20h17r986jd7i1uh26t.apps.googleusercontent.com";

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [appState, setAppState] = useState('login');
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [hasUnlockedReport, setHasUnlockedReport] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const loggedInUserPhone = localStorage.getItem('loggedInUser');
    if (loggedInUserPhone) {
      const userData = JSON.parse(localStorage.getItem(loggedInUserPhone));
      if (userData) {
        setCurrentUser(userData);
        setAppState('dashboard');
      }
    }
  }, []);

  const handleLogin = (userFromBackend) => {
    let user = { ...userFromBackend };
    if (!user.okrsData) user.okrsData = { yearly: [], quarterly: [], monthly: [] };
    if (!user.calendarEvents) user.calendarEvents = [];
    if (!user.pomodoroStats) user.pomodoroStats = { dailyCycles: {}, totalPoints: 0 };
    if (!user.results) user.results = {};
    setCurrentUser(user);
    // **مهم:** برای کاربران گوگل، باید یک شناسه منحصر به فرد دیگر (مثل ایمیل) ذخیره شود
    if (user.phone) {
      localStorage.setItem('loggedInUser', user.phone);
      localStorage.setItem(user.phone, JSON.stringify(user));
    }
    setAppState('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setCurrentUser(null);
    setAppState('login');
  };

  const handleStartNewQuiz = () => {
    setSelectedRole(null);
    setCurrentScenario(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setHasUnlockedReport(false);
    setAppState('role_selection');
  };
  
  const handleGoToDashboard = () => setAppState('dashboard');
  const handleGoToQuizHome = () => setAppState('quiz_home');
  const handleGoToOKR = () => setAppState('okr');
  const handleGoToCalendar = () => setAppState('calendar');
  const handleGoToKnowledge = () => setAppState('knowledge');
  const handleGoToPomodoro = () => setAppState('pomodoro');
  const handleGoToReviews = () => setAppState('reviews_home');
  const handleGoToPrices = () => setAppState('prices');
  const handleGoToNews = () => setAppState('news');
  
  const handleSelectReviewCategory = (category) => {
    const productToShow = reviewsData[category]?.[0];
    if (productToShow) {
      setSelectedReview(productToShow);
      setAppState('review_detail');
    }
  };
  
  const handleGoToReviewsHome = () => {
      setSelectedReview(null);
      setAppState('reviews_home');
  }

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    if (updatedUser.phone) {
      localStorage.setItem(updatedUser.phone, JSON.stringify(updatedUser));
    }
  };
  
  const handleRoleSelect = (roleKey) => {
    const roleScenarios = quizData[roleKey].scenarios;
    const randomScenario = roleScenarios[Math.floor(Math.random() * roleScenarios.length)];
    const scenarioWithShuffledOptions = JSON.parse(JSON.stringify(randomScenario));
    scenarioWithShuffledOptions.questions.forEach(q => q.options = shuffleArray(q.options));
    setSelectedRole(roleKey);
    setCurrentScenario(scenarioWithShuffledOptions);
    setAppState('quiz');
  };

  const handleAnswerSelect = (selectedOption) => {
    const nextAnswers = [...userAnswers, selectedOption];
    setUserAnswers(nextAnswers);
    if (currentQuestionIndex === currentScenario.questions.length - 1) {
      const userScore = nextAnswers.reduce((total, answer) => total + answer.points, 0);
      const maxScore = currentScenario.questions.length * 10;
      const percentage = maxScore > 0 ? (userScore / maxScore) * 100 : 0;
      const newResult = {
        quizId,
        scenarioTitle: currentScenario.title,
        percentage,
        date: new Date().toISOString(),
      };
      const updatedUser = { ...currentUser };
      if (!updatedUser.results) { updatedUser.results = {}; }
      if (!updatedUser.results[quizId]) { updatedUser.results[quizId] = []; }
      updatedUser.results[quizId].push(newResult);
      handleUpdateUser(updatedUser);
      setAppState('results');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleUnlockReport = () => setHasUnlockedReport(true);

  const renderContent = () => {
    switch (appState) {
      case 'dashboard':
        return <DashboardScreen 
                  user={currentUser} 
                  onGoToQuizHome={handleGoToQuizHome} 
                  onGoToOKR={handleGoToOKR} 
                  onGoToCalendar={handleGoToCalendar} 
                  onGoToKnowledge={handleGoToKnowledge} 
                  onGoToPomodoro={handleGoToPomodoro}
                  onGoToReviews={handleGoToReviews}
                  onGoToPrices={handleGoToPrices}
                  onGoToNews={handleGoToNews}
                  onLogout={handleLogout}
                  onGoToDashboard={handleGoToDashboard} 
               />;
      case 'quiz_home':
        return <QuizHomeScreen user={currentUser} onStartNewQuiz={handleStartNewQuiz} onGoToDashboard={handleGoToDashboard} onGoToLeaderboard={()=>{}} />;
      case 'okr':
        return <OKRScreen user={currentUser} onUpdateUser={handleUpdateUser} onGoToDashboard={handleGoToDashboard} />;
      case 'calendar':
        return <CalendarScreen user={currentUser} onUpdateUser={handleUpdateUser} onGoToDashboard={handleGoToDashboard} />;
      case 'knowledge':
        return <KnowledgeScreen onGoToDashboard={handleGoToDashboard} />;
      case 'pomodoro':
        return <PomodoroScreen user={currentUser} onUpdateUser={handleUpdateUser} onGoToDashboard={handleGoToDashboard} />;
      case 'reviews_home':
        return <ReviewHomeScreen onGoToDashboard={handleGoToDashboard} onSelectCategory={handleSelectReviewCategory} />;
      case 'review_detail':
        return <ReviewDetailScreen review={selectedReview} onGoBack={handleGoToReviewsHome} />;
      case 'prices':
        return <PricesScreen onGoToDashboard={handleGoToDashboard} />;
      case 'news':
        return <NewsScreen onGoToDashboard={handleGoToDashboard} />;
      case 'role_selection':
        return <RoleSelectionScreen onRoleSelect={handleRoleSelect} />;
      case 'quiz':
        return <QuizScreen 
                  selectedRole={selectedRole} 
                  currentScenario={currentScenario} 
                  currentQuestionIndex={currentQuestionIndex} 
                  onAnswerSelect={handleAnswerSelect} 
                  onGoBack={handleGoToQuizHome}
               />;
      case 'results':
        return <ResultsScreen 
                  selectedRole={selectedRole}
                  currentScenario={currentScenario}
                  userAnswers={userAnswers}
                  onRestart={handleGoToQuizHome} 
                  hasUnlockedReport={hasUnlockedReport}
                  onUnlockReport={handleUnlockReport}
               />;
      case 'login':
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    // ۳. کل اپلیکیشن داخل این Provider قرار گرفت
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="App">
        {renderContent()}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
