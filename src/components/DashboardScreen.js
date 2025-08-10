// src/components/DashboardScreen.js

import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { quizId } from '../QuizData';
import logo from '../Logo.jpg';

function DashboardScreen({ user, onGoToQuizHome, onGoToOKR, onGoToCalendar, onGoToKnowledge, onGoToAI, onGoToPomodoro, onLogout, onGoToDashboard, onGoToReviews, onGoToPrices, onGoToNews }) {
  
  const userProgress = useMemo(() => {
    if (!user || !user.results || !user.results[quizId] || user.results[quizId].length === 0) return 0;
    const quizResults = user.results[quizId];
    const totalScore = quizResults.reduce((acc, result) => acc + result.percentage, 0);
    return Math.round(totalScore / quizResults.length);
  }, [user]);

  if (!user) {
    return <div className="loading-container dark-mode">در حال بارگذاری...</div>;
  }

  return (
    <div className="main-menu-container compact">
      <header className="compact-header">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">سلام، {user.name}!</h1>
            <div className="header-actions">
              <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-slate-800 font-bold text-xl shadow-lg">
                <i className="fa-solid fa-user"></i>
              </div>
            </div>
        </div>
        <p className="text-indigo-300 mt-1 text-sm">با CoBiz بیزینست رو بهبود بده!</p>
        <div className="mt-3">
            <div className="w-full bg-black/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{ width: `${userProgress}%` }}></div>
            </div>
        </div>
      </header>

      <main className="compact-main">
        <div className="dashboard-grid grid grid-cols-2 gap-4 compact">
          {/* --- کلاس‌های رنگی اینجا اصلاح شدند --- */}
          <div className="dashboard-card glass-card" onClick={onGoToQuizHome}>
            <div className="icon-wrapper bg-green-500/20 text-green-300"><i className="fa-solid fa-file-signature"></i></div>
            <h3 className="card-title">آزمون‌ها</h3>
          </div>
          <div className="dashboard-card glass-card" onClick={onGoToKnowledge}>
            <div className="icon-wrapper bg-orange-500/20 text-orange-300"><i className="fa-solid fa-book-bookmark"></i></div>
            <h3 className="card-title">کتابخانه</h3>
          </div>
          <div className="dashboard-card glass-card" onClick={onGoToCalendar}>
            <div className="icon-wrapper bg-yellow-500/20 text-yellow-300"><i className="fa-solid fa-calendar-days"></i></div>
            <h3 className="card-title">تقویم</h3>
          </div>
           <div className="dashboard-card glass-card" onClick={onGoToReviews}>
            <div className="icon-wrapper bg-purple-500/20 text-purple-300"><i className="fa-solid fa-star"></i></div>
            <h3 className="card-title">نقد و بررسی</h3>
          </div>
          <div className="dashboard-card glass-card" onClick={onGoToPrices}>
            <div className="icon-wrapper bg-indigo-500/20 text-indigo-300"><i className="fa-solid fa-chart-line"></i></div>
            <h3 className="card-title">قیمت بازار</h3>
          </div>
          <div className="dashboard-card glass-card" onClick={onGoToNews}>
            <div className="icon-wrapper bg-red-500/20 text-red-300"><i className="fa-solid fa-newspaper"></i></div>
            <h3 className="card-title">اخبار</h3>
          </div>
        </div>

        <Swiper modules={[Autoplay]} loop={true} autoplay={{ delay: 3500, disableOnInteraction: false }} className="swiper mt-4 h-16">
          <SwiperSlide className="swiper-slide glass-card small-text">نکته روز: تمرکز کوتاه بهتر از حواس‌پرتی طولانی است.</SwiperSlide>
          <SwiperSlide className="swiper-slide glass-card small-text">اعلان: وبینار جدیدی به کتابخانه اضافه شد.</SwiperSlide>
        </Swiper>
      </main>

      <footer className="bottom-nav compact">
        <div className="nav-item active" onClick={onGoToDashboard}><i className="fa-solid fa-home"></i><span className="nav-text">خانه</span></div>
        <div className="nav-item" onClick={onGoToOKR}><i className="fa-solid fa-bullseye"></i><span className="nav-text">اهداف</span></div>
        <div className="nav-item" onClick={onGoToPomodoro}><i className="fa-solid fa-clock"></i><span className="nav-text">پومودورو</span></div>
        <div className="nav-item" onClick={onGoToAI}><i className="fa-solid fa-robot"></i><span className="nav-text">دستیار AI</span></div>
        <div className="nav-item" onClick={onLogout}><i className="fa-solid fa-sign-out-alt"></i><span className="nav-text">خروج</span></div>
      </footer>
    </div>
  );
}

export default DashboardScreen;