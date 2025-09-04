// src/App.js

import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
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
import PomodoroScreen from './components/PomodoroScreen';
import ReviewHomeScreen from './components/ReviewHomeScreen';
import ReviewDetailScreen from './components/ReviewDetailScreen';
import PricesScreen from './components/PricesScreen';
import NewsScreen from './components/NewsScreen';
import './App.css';

// ✅ ۱. Client ID از فایل .env خوانده می‌شود
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
console.log("My Client ID is:", GOOGLE_CLIENT_ID); // <-- این خط را اضافه کن
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
    // برای امنیت، ابتدا توکن را چک می‌کنیم
    const token = localStorage.getItem('authToken');
    const loggedInUserIdentifier = localStorage.getItem('loggedInUser');

    if (token && loggedInUserIdentifier) {
      const userData = JSON.parse(localStorage.getItem(loggedInUserIdentifier));
      if (userData) {
        setCurrentUser(userData);
        setAppState('dashboard');
      }
    }
  }, []);

  // ✅ ۲. تابع لاگین برای دریافت user و token به‌روز شد
  const handleLogin = (dataFromBackend) => {
    const { user, token } = dataFromBackend;

    let userToSave = { ...user };
    if (!userToSave.okrsData) userToSave.okrsData = { yearly: [], quarterly: [], monthly: [] };
    if (!userToSave.calendarEvents) userToSave.calendarEvents = [];
    if (!userToSave.pomodoroStats) userToSave.pomodoroStats = { dailyCycles: {}, totalPoints: 0 };
    if (!userToSave.results) userToSave.results = {};
    
    setCurrentUser(userToSave);

    if (token) {
      localStorage.setItem('authToken', token);
    }
    
    const userIdentifier = userToSave.email || userToSave.phone;
    if (userIdentifier) {
      localStorage.setItem('loggedInUser', userIdentifier);
      localStorage.setItem(userIdentifier, JSON.stringify(userToSave));
    }

    setAppState('dashboard');
  };

  const handleLogout = () => {
    const loggedInUserIdentifier = localStorage.getItem('loggedInUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUser');
    if(loggedInUserIdentifier) {
      localStorage.removeItem(loggedInUserIdentifier);
    }
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

  const handleGoToAdminPanel = () => {
    const adminUrl = 'https://cobiz-admin-panel.netlify.app/'; 
    window.open(adminUrl, '_blank');
  };
  
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
    const userIdentifier = updatedUser.email || updatedUser.phone;
    if (userIdentifier) {
      localStorage.setItem(userIdentifier, JSON.stringify(updatedUser));
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
                  onGoToAdminPanel={handleGoToAdminPanel}
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
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="App">
        {renderContent()}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;

