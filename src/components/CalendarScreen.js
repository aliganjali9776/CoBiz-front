// src/components/CalendarScreen.js

import React, { useState, useMemo } from 'react';
import Calendar from '@hassanmojab/react-modern-calendar-datepicker';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import moment from 'moment-jalaali';

const toCalendarDay = (dateString) => {
  if (!dateString) return null;
  const mDate = moment(dateString);
  if (!mDate.isValid()) return null;
  return {
    year: mDate.jYear(),
    month: mDate.jMonth() + 1,
    day: mDate.jDate(),
  };
};

function CalendarScreen({ user, onUpdateUser, onGoToDashboard }) {
  // --- تمام هوک‌ها به بالای کامپوننت منتقل شدند ---
  const [navDate, setNavDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [taskTitle, setTaskTitle] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');

  const allEvents = useMemo(() => {
    if (!user) return {};
    const okrsData = user.okrsData || { yearly: [], quarterly: [], monthly: [] };
    const calendarEvents = user.calendarEvents || [];
    const okrDeadlines = [
      ...(okrsData.yearly || []),
      ...(okrsData.quarterly || []),
      ...(okrsData.monthly || [])
    ].flatMap(obj => obj.keyResults || []).map(kr => ({
      date: moment(kr.deadline).format('YYYY-M-D'),
      title: `مهلت OKR: ${kr.title}`,
      type: 'okr'
    }));
    const userTasks = calendarEvents.map(event => ({
      date: moment(event.start).format('YYYY-M-D'),
      title: event.title,
      type: 'task'
    }));

    const eventsMap = {};
    [...okrDeadlines, ...userTasks].forEach(event => {
      if (!eventsMap[event.date]) { eventsMap[event.date] = []; }
      eventsMap[event.date].push(event);
    });
    return eventsMap;
  }, [user]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return allEvents[selectedDate.format('YYYY-M-D')] || [];
  }, [selectedDate, allEvents]);

  // --- گارد محافظ بعد از تمام هوک‌ها ---
  if (!user) {
    return <div className="loading-container">در حال بارگذاری...</div>;
  }
  
  const renderCalendarGrid = () => {
    const year = navDate.jYear();
    const month = navDate.jMonth();
    const firstDayOfMonth = navDate.clone().startOf('jMonth');
    const lastDayOfMonth = navDate.clone().endOf('jMonth');
    const daysInMonth = lastDayOfMonth.jDate();
    let startDayIndex = firstDayOfMonth.day(); // 0 for Saturday in moment-jalaali

    const grid = [];
    for (let i = 0; i < startDayIndex; i++) {
      grid.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(`${year}/${month + 1}/${day}`, 'jYYYY/jM/jD');
      const dateKey = date.format('YYYY-M-D');
      let classes = "calendar-day h-10 flex items-center justify-center rounded-full cursor-pointer";
      if (date.isSame(moment(), 'day')) classes += ' today';
      if (date.isSame(selectedDate, 'day')) classes += ' selected';
      if (allEvents[dateKey]) classes += ' has-event';
      grid.push(
        <div key={day} className={classes} onClick={() => setSelectedDate(date)}>
          {day}
        </div>
      );
    }
    return grid;
  };
  
  const handleAddEvent = (type) => {
    const title = type === 'task' ? taskTitle : meetingTitle;
    if (!title.trim()) return;

    const newEvent = {
      title,
      start: selectedDate.toISOString(),
      end: selectedDate.toISOString(),
      allDay: true,
      type
    };
    const updatedUser = { ...user, calendarEvents: [...(user.calendarEvents || []), newEvent] };
    onUpdateUser(updatedUser);

    if (type === 'task') setTaskTitle('');
    else setMeetingTitle('');
  };

  return (
    <div className="calendar-container v3-design">
      <button onClick={onGoToDashboard} className="back-to-dashboard-btn minimal">
        <i className="fa-solid fa-arrow-right"></i>
      </button>
      <header className="pomodoro-header">
        <h1 className="text-4xl font-bold">تقویم هوشمند</h1>
        <p className="text-indigo-300 mt-2">برنامه‌های خود را مدیریت کنید</p>
      </header>
      <main className="pomodoro-card">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setNavDate(navDate.clone().add(1, 'jMonth'))} className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
          <h2 className="text-xl font-semibold">{navDate.format('jMMMM jYYYY')}</h2>
          <button onClick={() => setNavDate(navDate.clone().subtract(1, 'jMonth'))} className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        </div>
        <div className="calendar-grid mb-6 text-center">
          {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(d => <div key={d} className="font-bold text-indigo-300">{d}</div>)}
        </div>
        <div className="calendar-grid">{renderCalendarGrid()}</div>
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-3 text-indigo-200 border-b border-white/10 pb-2">برنامه روز {selectedDate.format('jD jMMMM')}</h3>
          <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
            {selectedDayEvents.length > 0 ? selectedDayEvents.map((event, index) => (
              <li key={index} className="bg-white/5 p-3 rounded-lg flex items-center gap-3">
                <i className={`fa-solid ${event.type === 'task' ? 'fa-list-check text-blue-400' : 'fa-calendar-check text-green-400'}`}></i>
                <span>{event.title}</span>
              </li>
            )) : <li className="text-indigo-400 text-center p-4">رویدادی برای این روز ثبت نشده است.</li>}
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2 text-indigo-200 flex items-center gap-2"><i className="fa-solid fa-clipboard-list"></i><span>افزودن تسک جدید</span></h3>
          <div className="flex gap-2">
            <input type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="عنوان تسک..." className="flex-grow bg-white/5 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"/>
            <button onClick={() => handleAddEvent('task')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg">افزودن</button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2 text-indigo-200 flex items-center gap-2"><i className="fa-solid fa-calendar-plus"></i><span>ثبت جلسه / قرار ملاقات</span></h3>
          <div className="flex gap-2">
            <input type="text" value={meetingTitle} onChange={e => setMeetingTitle(e.target.value)} placeholder="عنوان جلسه..." className="flex-grow bg-white/5 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"/>
            <button onClick={() => handleAddEvent('meeting')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg">ثبت</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CalendarScreen;