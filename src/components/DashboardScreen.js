// src/components/DashboardScreen.js

import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { quizId } from '../QuizData';

function DashboardScreen({ user, onGoToQuizHome, onGoToOKR, onGoToCalendar, onGoToKnowledge, onGoToPomodoro, onLogout, onGoToDashboard, onGoToReviews, onGoToPrices, onGoToNews }) {
  
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
        {/* ✅ کارت‌های اصلی جدید */}
        <div className="dashboard-grid grid grid-cols-2 gap-4 compact">
          <div className="dashboard-card glass-card" onClick={onGoToQuizHome}>
            <div className="icon-wrapper bg-green-500/20 text-green-300"><i className="fa-solid fa-file-signature"></i></div>
            <h3 className="card-title">شبیه‌ساز</h3>
          </div>
          <div className="dashboard-card glass-card" onClick={onGoToKnowledge}>
            <div className="icon-wrapper bg-orange-500/20 text-orange-300"><i className="fa-solid fa-book-bookmark"></i></div>
            <h3 className="card-title">بانک دانش</h3>
          </div>
           <div className="dashboard-card glass-card" onClick={onGoToCalendar}>
            <div className="icon-wrapper bg-yellow-500/20 text-yellow-300"><i className="fa-solid fa-calendar-days"></i></div>
            <h3 className="card-title">برنامه ریزی</h3>
          </div>
          <div className="dashboard-card glass-card" onClick={onGoToReviews}>
            <div className="icon-wrapper bg-purple-500/20 text-purple-300"><i className="fa-solid fa-star"></i></div>
            <h3 className="card-title">راهنمای مدیران</h3>
          </div>
          <div className="dashboard-card glass-card" onClick={onGoToOKR}>
            <div className="icon-wrapper bg-blue-500/20 text-blue-300"><i className="fa-solid fa-bullseye"></i></div>
            <h3 className="card-title">هدف‌گذاری</h3>
          </div>
          <div className="dashboard-card glass-card" onClick={onGoToPomodoro}>
            <div className="icon-wrapper bg-teal-500/20 text-teal-300"><i className="fa-solid fa-clock"></i></div>
            <h3 className="card-title">کار عمیق</h3>
          </div>
        </div>

        <Swiper modules={[Autoplay]} loop={true} autoplay={{ delay: 3500, disableOnInteraction: false }} className="swiper mt-4 h-16">
          <SwiperSlide className="swiper-slide glass-card small-text">نکته روز: تمرکز کوتاه بهتر از حواس‌پرتی طولانی است.</SwiperSlide>
          <SwiperSlide className="swiper-slide glass-card small-text">اعلان: وبینار جدیدی به کتابخانه اضافه شد.</SwiperSlide>
        </Swiper>
      </main>

      {/* ✅ نوار پایین جدید */}
      <footer className="bottom-nav compact">
        <div className="nav-item active" onClick={onGoToDashboard}><i className="fa-solid fa-home"></i><span className="nav-text">خانه</span></div>
        <div className="nav-item" onClick={onGoToNews}><i className="fa-solid fa-newspaper"></i><span className="nav-text">اخبار</span></div>
        <div className="nav-item" onClick={onGoToPrices}><i className="fa-solid fa-chart-line"></i><span className="nav-text">بازار</span></div>
        <div className="nav-item" onClick={onLogout}><i className="fa-solid fa-sign-out-alt"></i><span className="nav-text">خروج</span></div>
      </footer>
    </div>
  );
}

export default DashboardScreen;
