// src/components/CalendarScreen.js

import React, { useState, useMemo } from 'react';
import moment from 'moment-jalaali';

function CalendarScreen({ user, onUpdateUser, onGoToDashboard }) {
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
      id: `okr-${kr.id}`,
      date: moment(kr.deadline).format('YYYY-M-D'),
      title: `مهلت OKR: ${kr.title}`,
      type: 'okr',
    }));
    const userCreatedEvents = calendarEvents.map((event, index) => ({
      ...event,
      id: event.id || `evt-${index}-${new Date(event.start).getTime()}`,
      completed: event.completed === true,
      date: moment(event.start).format('YYYY-M-D'),
    }));
    const eventsMap = {};
    [...okrDeadlines, ...userCreatedEvents].forEach(event => {
      if (!eventsMap[event.date]) { eventsMap[event.date] = []; }
      eventsMap[event.date].push(event);
    });
    return eventsMap;
  }, [user]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return allEvents[selectedDate.format('YYYY-M-D')] || [];
  }, [selectedDate, allEvents]);

  if (!user) {
    return <div className="loading-container">در حال بارگذاری...</div>;
  }
  
  const renderCalendarGrid = () => {
    const year = navDate.jYear();
    const month = navDate.jMonth();
    const firstDayOfMonth = navDate.clone().startOf('jMonth');
    const daysInMonth = navDate.daysInMonth();
    let startDayIndex = firstDayOfMonth.day(); // 0 = شنبه

    const grid = [];
    for (let i = 0; i < startDayIndex; i++) {
      grid.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(`${year}/${month + 1}/${day}`, 'jYYYY/jM/jD');
      const dateKey = date.format('YYYY-M-D');
      let classes = "calendar-day";
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
      id: Date.now(),
      title,
      start: selectedDate.toISOString(),
      end: selectedDate.toISOString(),
      allDay: true,
      type,
      completed: false
    };
    const updatedUser = { ...user, calendarEvents: [...(user.calendarEvents || []), newEvent] };
    onUpdateUser(updatedUser);
    if (type === 'task') setTaskTitle('');
    else setMeetingTitle('');
  };

  const handleToggleTask = (taskId) => {
    const updatedEvents = user.calendarEvents.map(event => {
      if (event.id === taskId) {
        return { ...event, completed: !event.completed };
      }
      return event;
    });
    onUpdateUser({ ...user, calendarEvents: updatedEvents });
  };

  return (
    <div className="calendar-container">
      <div className="page-header">
        <h1>تقویم هوشمند</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn minimal">
          <i className="fa-solid fa-arrow-right"></i> بازگشت
        </button>
      </div>
     
      <main className="pomodoro-card">
        <div className="calendar-header">
          <button onClick={() => setNavDate(navDate.clone().subtract(1, 'jMonth'))} className="calendar-nav-btn">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
          <h2>{navDate.format('jMMMM jYYYY')}</h2>
          <button onClick={() => setNavDate(navDate.clone().add(1, 'jMonth'))} className="calendar-nav-btn">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        </div>
        
        <div className="calendar-grid">
          {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(d => <div key={d} className="calendar-grid-header">{d}</div>)}
        </div>
        <div className="calendar-grid">
          {renderCalendarGrid()}
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-3 text-indigo-200 border-b border-white/10 pb-2">برنامه روز {selectedDate.format('jD jMMMM')}</h3>
          <ul className="event-list">
            {selectedDayEvents.length > 0 ? selectedDayEvents.map((event) => (
              <li key={event.id} className={`todo-item ${event.completed ? 'completed' : ''}`}>
                {event.type === 'task' ? (
                  <input type="checkbox" checked={event.completed} onChange={() => handleToggleTask(event.id)} />
                ) : (
                  <span className="event-icon"><i className={`fa-solid ${event.type === 'okr' ? 'fa-bullseye' : 'fa-users'}`}></i></span>
                )}
                <span className="todo-title">{event.title}</span>
              </li>
            )) : <li className="text-indigo-400 text-center p-4">رویدادی برای این روز ثبت نشده است.</li>}
          </ul>
        </div>
        
        <div className="add-event-form">
          <div>
            <h3><i className="fa-solid fa-clipboard-list"></i><span>افزودن تسک جدید</span></h3>
            <div className="form-input-group">
              <input type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="مثلا: ارسال گزارش هفتگی..." className="form-input"/>
              <button onClick={() => handleAddEvent('task')} className="form-btn task">افزودن</button>
            </div>
          </div>
          <div className="mt-6">
            <h3><i className="fa-solid fa-calendar-plus"></i><span>ثبت جلسه / قرار ملاقات</span></h3>
            <div className="form-input-group">
              <input type="text" value={meetingTitle} onChange={e => setMeetingTitle(e.target.value)} placeholder="مثلا: جلسه با تیم فروش..." className="form-input"/>
              <button onClick={() => handleAddEvent('meeting')} className="form-btn meeting">ثبت</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CalendarScreen;