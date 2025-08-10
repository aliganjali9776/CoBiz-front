// src/components/OKRScreen.js

import React, { useState, useEffect, useMemo } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { faIR } from 'date-fns/locale';
import moment from 'moment-jalaali';

registerLocale('fa', faIR);

// کامپوننت مودال برای افزودن هدف
const AddObjectiveModal = ({ isOpen, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [krText, setKrText] = useState('');
  const [dueDate, setDueDate] = useState(new Date());

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return alert('عنوان هدف نمی‌تواند خالی باشد.');
    const krs = krText ? krText.split('\n').map(k => ({ title: k.trim(), progress: 0 })) : [];
    onSave({ title, owner, krs, due: dueDate.toISOString() });
    setTitle(''); setOwner(''); setKrText('');
  };

  return (
    <div className="modal-backdrop-v2">
      <div className="modal-v2">
        <h4>افزودن هدف جدید</h4>
        <div className="form-row">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="عنوان هدف (مثلاً: افزایش فروش ۲۰%)" />
        </div>
        <div className="form-row">
          <input value={owner} onChange={e => setOwner(e.target.value)} placeholder="مسئول (مثلاً: علیرضا)" />
          <DatePicker selected={dueDate} onChange={date => setDueDate(date)} dateFormat="yyyy/MM/dd" locale="fa" customInput={<input/>}/>
        </div>
        <textarea value={krText} onChange={e => setKrText(e.target.value)} rows="3" placeholder="نتایج کلیدی؛ هر خط یک KR بنویسید"></textarea>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button className="btn ghost" onClick={onCancel}>انصراف</button>
          <button className="btn" onClick={handleSave}>افزودن هدف</button>
        </div>
      </div>
    </div>
  );
};

function OKRScreen({ user, onUpdateUser, onGoToDashboard }) {
  // --- تمام هوک‌ها به بالای کامپوننت منتقل شدند ---
  const [activeTimeframe, setActiveTimeframe] = useState('quarterly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [objectives, setObjectives] = useState([]);
  const [newKrText, setNewKrText] = useState({});

  useEffect(() => {
    if (user && user.okrsData) {
      setObjectives(user.okrsData[activeTimeframe] || []);
    }
  }, [user, activeTimeframe]);
  
  const overallProgress = useMemo(() => {
    if (!objectives || objectives.length === 0) return 0;
    let totalPercent = 0;
    let count = 0;
    objectives.forEach(obj => {
      if (obj.krs && obj.krs.length > 0) {
        const objProgress = Math.round(obj.krs.reduce((sum, kr) => sum + (kr.progress || 0), 0) / obj.krs.length);
        totalPercent += objProgress;
        count++;
      }
    });
    return count > 0 ? Math.round(totalPercent / count) : 0;
  }, [objectives]);
  
  const totalKRs = useMemo(() => objectives.reduce((sum, obj) => sum + (obj.krs?.length || 0), 0), [objectives]);
  const doneKRs = useMemo(() => objectives.reduce((sum, obj) => sum + (obj.krs?.filter(k => k.progress >= 100).length || 0), 0), [objectives]);
  
  // --- گارد محافظ بعد از تمام هوک‌ها ---
  if (!user) { return <div className="loading-container">در حال بارگذاری...</div>; }

  const handleUpdateObjectives = (newObjectives) => {
    const updatedUser = { ...user, okrsData: { ...user.okrsData, [activeTimeframe]: newObjectives } };
    onUpdateUser(updatedUser);
  };
  
  const handleAddObjective = (newObjectiveData) => {
    const newObj = { id: Date.now(), ...newObjectiveData, created: new Date().toISOString() };
    handleUpdateObjectives([...objectives, newObj]);
    setIsModalOpen(false);
  };
  
  const handleAddKrToObjective = (objId) => {
    const text = newKrText[objId];
    if (!text || !text.trim()) return;

    const updatedObjectives = objectives.map(obj => {
        if (obj.id === objId) {
            const newKr = { title: text, progress: 0 };
            const updatedKrs = [...(obj.krs || []), newKr];
            return { ...obj, krs: updatedKrs };
        }
        return obj;
    });
    handleUpdateObjectives(updatedObjectives);
    setNewKrText({ ...newKrText, [objId]: '' });
  }

  const handleUpdateKrProgress = (objId, krIndex, newProgress) => {
      const updatedObjectives = objectives.map(obj => {
          if (obj.id === objId) {
              const updatedKrs = obj.krs.map((kr, index) => 
                  index === krIndex ? { ...kr, progress: newProgress } : kr
              );
              return { ...obj, krs: updatedKrs };
          }
          return obj;
      });
      handleUpdateObjectives(updatedObjectives);
  };

  return (
    <div className="okr-container v2-design">
      <AddObjectiveModal isOpen={isModalOpen} onSave={handleAddObjective} onCancel={() => setIsModalOpen(false)} />
      
      <div className="header-card-v2">
        <div className="avatar-v2">{user.name.charAt(0)}</div>
        <div className="header-text-v2">
          <h1>سلام، {user.name}!</h1>
          <p>با CoBiz — بام بیزینست را بهبود می‌دهیم</p>
        </div>
      </div>

      <div className="quick-grid">
        <div className={`quick q-blue ${activeTimeframe === 'yearly' ? 'active' : ''}`} onClick={() => setActiveTimeframe('yearly')}>
            <div className="title">سالیانه</div><div className="sub">اهداف بلندمدت</div>
        </div>
        <div className={`quick q-teal ${activeTimeframe === 'quarterly' ? 'active' : ''}`} onClick={() => setActiveTimeframe('quarterly')}>
            <div className="title">فصلی</div><div className="sub">تمرکز سه ماهه</div>
        </div>
        <div className={`quick q-orange ${activeTimeframe === 'monthly' ? 'active' : ''}`} onClick={() => setActiveTimeframe('monthly')}>
            <div className="title">ماهانه</div><div className="sub">اقدامات سریع</div>
        </div>
        <div className="quick q-yellow" onClick={onGoToDashboard}>
            <div className="title">بازگشت</div><div className="sub">به داشبورد اصلی</div>
        </div>
      </div>

      <div className="main-v2">
        <div className="left-panel-v2">
          <div className="okr-summary">
            <h3>پیشرفت کلی OKR</h3>
            <div className="okr-small">نمودار پیشرفت اهداف این دوره</div>
          </div>
          <div className="gauge-wrap">
            <div className="gauge">
              <svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#eef3f6" strokeWidth="10"></path>
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#3b82f6" strokeWidth="10" 
                      style={{strokeDasharray: `${overallProgress * 1.256}, 125.6`}}></path>
              </svg>
              <div className="pct">{overallProgress}%</div>
            </div>
          </div>
          <div className="actions">
            <button className="btn" onClick={() => setIsModalOpen(true)}>+ افزودن هدف جدید</button>
          </div>
          <div style={{ marginTop: '14px', textAlign: 'center', color: '#9aa3b2', fontSize: '13px' }}>
            <div>نتایج کلیدی کامل‌شده: <strong>{doneKRs}</strong> / {totalKRs}</div>
          </div>
        </div>

        <div className="right-panel-v2">
          <div className="panel-header">
            <h2>اهداف ({activeTimeframe})</h2>
          </div>
          <div className="objs">
            {objectives.map(obj => (
              <div key={obj.id} className="obj-card">
                <div className="obj-head">
                  <h3>{obj.title}</h3>
                  <div className="obj-meta">{obj.owner || 'بدون مسئول'} {obj.due ? `• تا ${new Date(obj.due).toLocaleDateString('fa-IR')}` : ''}</div>
                </div>
                <div className="krs">
                  {(obj.krs || []).map((kr, idx) => (
                    <div key={idx} className="kr">
                      <div className="kr-left">
                        <div className="kr-title">{kr.title}</div>
                        <div className="kr-meta">پیشرفت: {kr.progress || 0}%</div>
                      </div>
                      <div className="kr-actions">
                        <input type="range" min="0" max="100" value={kr.progress || 0}
                               onChange={(e) => handleUpdateKrProgress(obj.id, idx, parseInt(e.target.value))} />
                      </div>
                    </div>
                  ))}
                </div>
                 <form className="add-kr-inline-form" onSubmit={(e) => {
                     e.preventDefault();
                     const input = e.target.elements.krTitle;
                     handleAddKrToObjective(obj.id, input.value);
                     input.value = '';
                 }}>
                    <input name="krTitle" className="small-input" placeholder="نتیجه کلیدی جدید..." />
                    <button type="submit" className="btn">افزودن</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OKRScreen;