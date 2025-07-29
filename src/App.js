// src/App.js

import React, { useState, useEffect } from 'react';
import { quizId, quizData } from './QuizData'; 
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import OKRScreen from './components/OKRScreen';
import QuizHomeScreen from './components/QuizHomeScreen';
import CalendarScreen from './components/CalendarScreen';
import KnowledgeScreen from './components/KnowledgeScreen';
import AIScreen from './components/AIScreen';
import PomodoroScreen from './components/PomodoroScreen';
import './App.css';

const BACKEND_URL = 'https://cobiz.onrender.com';

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

  useEffect(() => {
    const loggedInUserPhone = localStorage.getItem('loggedInUser');
    if (loggedInUserPhone) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: loggedInUserPhone }),
          });
          const userData = await response.json();
          if (response.ok) {
            setCurrentUser(userData);
            setAppState('dashboard');
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error("Failed to fetch user on load:", error);
          handleLogout();
        }
      };
      fetchUser();
    }
  }, []);

  const handleLogin = (userFromBackend) => {
    setCurrentUser(userFromBackend);
    localStorage.setItem('loggedInUser', userFromBackend.phone);
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
  const handleGoToAI = () => setAppState('ai_assistant');
  const handleGoToPomodoro = () => setAppState('pomodoro');
  
  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'خطا در آپدیت کاربر.');
      }
      setCurrentUser(data);
    } catch (error) {
      console.error("خطا در آپدیت کاربر:", error);
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
        quizId, scenarioTitle: currentScenario.title,
        percentage, date: new Date().toISOString(),
      };
      const updatedUser = { ...currentUser };
      if (!updatedUser.results[quizId]) {
        updatedUser.results[quizId] = [];
      }
      updatedUser.results[quizId].push(newResult);
      handleUpdateUser(updatedUser);
      setAppState('results');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handleUnlockReport = () => setHasUnlockedReport(true);

  switch (appState) {
    case 'dashboard':
      return <DashboardScreen user={currentUser} onGoToQuizHome={handleGoToQuizHome} onGoToOKR={handleGoToOKR} onGoToCalendar={handleGoToCalendar} onGoToKnowledge={handleGoToKnowledge} onGoToAI={handleGoToAI} onGoToPomodoro={handleGoToPomodoro} onLogout={handleLogout} />;
    case 'quiz_home':
      return <QuizHomeScreen user={currentUser} onStartNewQuiz={handleStartNewQuiz} onGoToDashboard={handleGoToDashboard} />;
    case 'okr':
      return <OKRScreen user={currentUser} onUpdateUser={handleUpdateUser} onGoToDashboard={handleGoToDashboard} />;
    case 'calendar':
      return <CalendarScreen user={currentUser} onUpdateUser={handleUpdateUser} onGoToDashboard={handleGoToDashboard} />;
    case 'knowledge':
      return <KnowledgeScreen onGoToDashboard={handleGoToDashboard} />;
    case 'ai_assistant':
      return <AIScreen onGoToDashboard={handleGoToDashboard} />;
    case 'role_selection':
      return <RoleSelectionScreen onRoleSelect={handleRoleSelect} />;
    case 'quiz':
      return <QuizScreen selectedRole={selectedRole} currentScenario={currentScenario} currentQuestionIndex={currentQuestionIndex} onAnswerSelect={handleAnswerSelect} />;
    case 'results':
      return <ResultsScreen selectedRole={selectedRole} currentScenario={currentScenario} userAnswers={userAnswers} onRestart={handleGoToQuizHome} hasUnlockedReport={hasUnlockedReport} onUnlockReport={handleUnlockReport} />;
    case 'login':
    default:
      return <LoginScreen onLogin={handleLogin} />;
  }
}

export default App;