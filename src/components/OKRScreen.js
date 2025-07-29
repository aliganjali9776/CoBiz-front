// src/components/OKRScreen.js

import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

const AddObjectiveModal = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [timeframe, setTimeframe] = useState('quarterly');
  const handleSubmit = () => {
    if (title.trim()) { onAdd({ title, timeframe }); }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>افزودن هدف اصلی جدید</h2>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان هدف اصلی (مثال: افزایش فروش در فصل بهار)" />
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          <option value="monthly">ماهانه</option>
          <option value="quarterly">فصلی</option>
          <option value="yearly">سالیانه</option>
        </select>
        <div className="modal-actions">
          <button onClick={handleSubmit} className="btn-primary">ذخیره هدف</button>
          <button onClick={onCancel} className="btn-secondary">انصراف</button>
        </div>
      </div>
    </div>
  );
};

const ProgressDonut = ({ progress }) => {
  const data = {
    datasets: [{
        data: [progress, 100 - progress],
        backgroundColor: ['#28a745', '#e9ecef'],
        borderColor: ['#28a745', '#e9ecef'],
        circumference: 180,
        rotation: 270,
    }],
  };
  const options = { responsive: true, cutout: '80%', plugins: { tooltip: { enabled: false } } };
  return (
    <div className="progress-donut-container">
      <Doughnut data={data} options={options} />
      <span>{progress}%</span>
    </div>
  );
};


function OKRScreen({ user, onUpdateUser, onGoToDashboard }) {
  const [activeTab, setActiveTab] = useState('quarterly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyResults, setNewKeyResults] = useState({});
  const [deadlines, setDeadlines] = useState({});
  const [krOwners, setKrOwners] = useState({});

  const okrsData = useMemo(() => (user ? user.okrsData : null) || { yearly: [], quarterly: [], monthly: [] }, [user]);

  if (!user) {
    return <div className="loading-container">در حال بارگذاری اطلاعات...</div>;
  }

  const updateProgress = (okrs) => {
    return okrs.map(obj => {
      if (!obj.keyResults || obj.keyResults.length === 0) {
        return { ...obj, progress: 0 };
      }
      const completedCount = obj.keyResults.filter(kr => kr.completed).length;
      const progress = Math.round((completedCount / obj.keyResults.length) * 100);
      return { ...obj, progress };
    });
  };

  const handleAddObjective = ({ title, timeframe }) => {
    const newObjective = { id: Date.now(), title, progress: 0, keyResults: [] };
    const updatedOkrsData = { ...okrsData, [timeframe]: [...(okrsData[timeframe] || []), newObjective] };
    onUpdateUser({ ...user, okrsData: updatedOkrsData });
    setIsModalOpen(false);
    setActiveTab(timeframe);
  };
  
  const handleAddKeyResult = (objectiveId) => {
    const krText = newKeyResults[objectiveId];
    const krOwner = krOwners[objectiveId] || user.name;
    const krDeadline = deadlines[objectiveId] || new Date();

    if (!krText || !krText.trim()) return;

    const updatedOkrsData = { ...okrsData };
    updatedOkrsData[activeTab] = (updatedOkrsData[activeTab] || []).map(obj => {
      if (obj.id === objectiveId) {
        const newKr = { id: Date.now(), title: krText, completed: false, owner: krOwner, deadline: krDeadline.toISOString() };
        return { ...obj, keyResults: [...(obj.keyResults || []), newKr] };
      }
      return obj;
    });

    updatedOkrsData[activeTab] = updateProgress(updatedOkrsData[activeTab]);
    onUpdateUser({ ...user, okrsData: updatedOkrsData });
    
    // *** اینجا اصلاح شد ***
    setNewKeyResults({ ...newKeyResults, [objectiveId]: '' });
    setKrOwners({ ...krOwners, [objectiveId]: '' });
  };
  
  const handleToggleKR = (objectiveId, krId) => {
    const updatedOkrsData = { ...okrsData };
    updatedOkrsData[activeTab] = (updatedOkrsData[activeTab] || []).map(obj => {
        if (obj.id === objectiveId) {
            const updatedKrs = (obj.keyResults || []).map(kr => 
                kr.id === krId ? { ...kr, completed: !kr.completed } : kr
            );
            return { ...obj, keyResults: updatedKrs };
        }
        return obj;
    });

    updatedOkrsData[activeTab] = updateProgress(updatedOkrsData[activeTab]);
    onUpdateUser({ ...user, okrsData: updatedOkrsData });
  };

  const visibleOkrs = okrsData[activeTab] || [];

  return (
    <>
      {isModalOpen && <AddObjectiveModal onAdd={handleAddObjective} onCancel={() => setIsModalOpen(false)} />}
      <div className="okr-container professional">
        <div className="page-header">
            <h1>مدیریت اهداف (OKR)</h1>
            <button onClick={onGoToDashboard} className="back-to-dashboard-btn">
              <i className="fa-solid fa-arrow-right"></i> بازگشت به منوی اصلی
            </button>
        </div>
        <div className="okr-header">
            <div className="tabs">
                <button className={activeTab === 'yearly' ? 'active' : ''} onClick={() => setActiveTab('yearly')}>سالیانه</button>
                <button className={activeTab === 'quarterly' ? 'active' : ''} onClick={() => setActiveTab('quarterly')}>فصلی</button>
                <button className={activeTab === 'monthly' ? 'active' : ''} onClick={() => setActiveTab('monthly')}>ماهانه</button>
            </div>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <i className="fa-solid fa-plus"></i> افزودن هدف جدید
            </button>
        </div>
        <div className="objectives-list">
          {visibleOkrs.length > 0 ? visibleOkrs.map(obj => (
            <div key={obj.id} className="objective-card professional">
              <div className="objective-header">
                <h2>{obj.title}</h2>
                <ProgressDonut progress={obj.progress || 0} />
              </div>
              <div className="kr-list">
                {(obj.keyResults || []).map(kr => (
                  <div key={kr.id} className="kr-item professional">
                    <div className="kr-item-main" onClick={() => handleToggleKR(obj.id, kr.id)}>
                      <input type="checkbox" checked={kr.completed} readOnly />
                      <span className={kr.completed ? 'completed' : ''}>{kr.title}</span>
                    </div>
                    <div className="kr-meta">
                      <span className="kr-owner"><i className="fa-solid fa-user"></i> {kr.owner}</span>
                      <span className="kr-deadline"><i className="fa-solid fa-calendar-day"></i> {new Date(kr.deadline).toLocaleDateString('fa-IR')}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="add-kr-form professional">
                <i className="fa-solid fa-plus"></i>
                <input type="text" placeholder="نتیجه کلیدی جدید..." value={newKeyResults[obj.id] || ''} onChange={(e) => setNewKeyResults({ ...newKeyResults, [obj.id]: e.target.value })} />
                <input type="text" placeholder="مسئول..." className="kr-owner-input" value={krOwners[obj.id] || ''} onChange={(e) => setKrOwners({ ...krOwners, [obj.id]: e.target.value })} />
                <DatePicker selected={deadlines[obj.id] || new Date()} onChange={(date) => setDeadlines({ ...deadlines, [obj.id]: date })} dateFormat="yyyy/MM/dd" className="kr-datepicker" />
                <button onClick={() => handleAddKeyResult(obj.id)}>افزودن</button>
              </div>
            </div>
          )) : <p className="no-results">هیچ هدفی برای این بازه زمانی تعریف نشده است.</p>}
        </div>
      </div>
    </>
  );
}

export default OKRScreen;