// src/components/CalendarScreen.js

import React, { useState, useMemo } from 'react';
import Calendar from '@hassanmojab/react-modern-calendar-datepicker';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { faIR } from 'date-fns/locale';
import moment from 'moment-jalaali';
import { registerLocale } from 'react-datepicker';

registerLocale('fa', faIR);

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

const DatePickerInput = ({ selectedDate, setSelectedDate }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const selectedDayObject = toCalendarDay(selectedDate.toISOString());

  const handleDateChange = (day) => {
    const newDate = new Date(moment(`${day.year}/${day.month}/${day.day}`, 'jYYYY/jM/jD').toString());
    setSelectedDate(newDate);
    setIsPickerOpen(false);
  };

  return (
    <div className="custom-datepicker-wrapper">
      <input
        type="text"
        readOnly
        className="event-datepicker-input"
        value={new Date(selectedDate).toLocaleDateString('fa-IR')}
        onClick={() => setIsPickerOpen(!isPickerOpen)}
        placeholder="انتخاب تاریخ"
      />
      {isPickerOpen && (
        <div className="datepicker-calendar-container">
          <Calendar
            value={selectedDayObject}
            onChange={handleDateChange}
            shouldHighlightWeekends
            locale="fa"
          />
        </div>
      )}
    </div>
  );
};

function CalendarScreen({ user, onUpdateUser, onGoToDashboard }) {
  // --- All Hooks moved to the top level ---
  const [selectedDay, setSelectedDay] = useState(toCalendarDay(new Date().toISOString()));
  const [newTask, setNewTask] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(new Date());
  const [newMeeting, setNewMeeting] = useState('');
  const [newMeetingDate, setNewMeetingDate] = useState(new Date());

  const allEvents = useMemo(() => {
    if (!user) return []; // Internal guard
    const okrsData = user.okrsData || { yearly: [], quarterly: [], monthly: [] };
    const calendarEvents = user.calendarEvents || [];
    const okrDeadlines = [
      ...(okrsData.yearly || []),
      ...(okrsData.quarterly || []),
      ...(okrsData.monthly || [])
    ].flatMap(obj => obj.keyResults || []).map(kr => ({
      date: kr.deadline,
      title: `مهلت OKR: ${kr.title}`,
      type: 'okr',
      completed: kr.completed,
    }));
    const userTasks = calendarEvents.map(event => ({
      date: event.start,
      title: event.title,
      type: 'task',
      completed: event.completed || false
    }));
    return [...okrDeadlines, ...userTasks];
  }, [user]);

  const markedDays = useMemo(() => 
    allEvents.map(event => {
      const day = toCalendarDay(event.date);
      if (!day) return null;
      return { ...day, className: event.type === 'okr' ? 'okr-marker' : 'task-marker' };
    }).filter(Boolean),
  [allEvents]);

  const todaysEvents = useMemo(() => {
    const todayStr = moment().format('YYYY-MM-DD');
    return allEvents.filter(event => moment(event.date).format('YYYY-MM-DD') === todayStr);
  }, [allEvents]);

  const eventsForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    const selectedDateStr = moment(`${selectedDay.year}/${selectedDay.month}/${selectedDay.day}`, 'jYYYY/jM/jD').format('YYYY-MM-DD');
    return allEvents.filter(event => moment(event.date).format('YYYY-MM-DD') === selectedDateStr);
  }, [selectedDay, allEvents]);

  // --- Guard clause now comes AFTER all hooks ---
  if (!user) {
    return <div className="loading-container">در حال بارگذاری...</div>;
  }

  // --- Handler functions ---
  const handleAddEvent = (type) => {
    const title = type === 'task' ? newTask : newMeeting;
    const date = type === 'task' ? newTaskDate : newMeetingDate;
    if (!title.trim()) return;
    const newEvent = {
      title,
      start: date.toISOString(),
      end: date.toISOString(),
      allDay: true,
      completed: false,
    };
    const updatedUser = { ...user, calendarEvents: [...(user.calendarEvents || []), newEvent] };
    onUpdateUser(updatedUser);
    if (type === 'task') {
      setNewTask('');
      setNewTaskDate(new Date());
    } else {
      setNewMeeting('');
      setNewMeetingDate(new Date());
    }
  };
  
  const handleToggleTask = (task) => {
    const updatedUser = {
      ...user,
      calendarEvents: (user.calendarEvents || []).map(event => {
        if (event.title === task.title && event.start === task.date) {
          return { ...event, completed: !event.completed };
        }
        return event;
      })
    };
    onUpdateUser(updatedUser);
  };
  
  const renderCustomFooter = () => {
    return (
      <div className="custom-calendar-footer-ads">
        <div className="footer-today-styled">
          <span>امروز</span>
          <strong>{moment().format('jD jMMMM')}</strong>
        </div>
        <div className="footer-ad-placeholder"></div>
      </div>
    );
  };

  return (
    <div className="calendar-container modern">
      <div className="page-header">
        <h1>تقویم هوشمند مدیریتی</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn">
          <i className="fa-solid fa-arrow-right"></i> بازگشت به منوی اصلی
        </button>
      </div>
      
      <div className="todays-agenda">
        <div className="events-header">
          <h3>برنامه امروز شما</h3>
          <span>{moment().format('dddd jD jMMMM jYYYY')}</span>
        </div>
        <div className="events-list">
          {todaysEvents.length > 0 ? (
            todaysEvents.map((event, index) => (
              <div key={index} className={`event-item event-${event.type} ${event.completed ? 'completed' : ''}`} onClick={() => event.type === 'task' && handleToggleTask(event)}>
                <span className="event-title">{event.title}</span>
                {event.type === 'task' && <div className="checkmark">✔</div>}
              </div>
            ))
          ) : (
            <p className="no-events">امروز برنامه‌ای ثبت نشده است.</p>
          )}
        </div>
      </div>

      <div className="input-forms-section">
        <div className="add-event-form">
          <h4><i className="fa-solid fa-list-check"></i> افزودن تسک جدید</h4>
          <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="عنوان تسک..." />
          <DatePickerInput selectedDate={newTaskDate} setSelectedDate={setNewTaskDate} />
          <button onClick={() => handleAddEvent('task')}>افزودن تسک</button>
        </div>
        
        <div className="add-event-form">
          <h4><i className="fa-solid fa-calendar-plus"></i> ثبت جلسه / قرار ملاقات</h4>
          <input type="text" value={newMeeting} onChange={(e) => setNewMeeting(e.target.value)} placeholder="عنوان جلسه..." />
          <DatePickerInput selectedDate={newMeetingDate} setSelectedDate={setNewMeetingDate} />
          <button onClick={() => handleAddEvent('meeting')}>ثبت جلسه</button>
        </div>
      </div>

      <div className="calendar-widget-wrapper full-view">
        <h3 className="calendar-title">نمای کلی ماه</h3>
        <Calendar value={selectedDay} onChange={setSelectedDay} shouldHighlightWeekends locale="fa" customDaysClassName={markedDays} calendarClassName="responsive-calendar final" renderFooter={renderCustomFooter} />
      </div>
    </div>
  );
}

export default CalendarScreen;