// src/components/OKRScreen.js

import React, { useState, useEffect, useMemo } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { faIR } from 'date-fns/locale';

registerLocale('fa', faIR);

const AddObjectiveModal = ({ isOpen, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [dueDate, setDueDate] = useState(new Date());

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return alert('عنوان هدف نمی‌تواند خالی باشد.');
    onSave({ title, owner, krs: [], kpis: [], due: dueDate.toISOString() });
    setTitle(''); setOwner(''); setDueDate(new Date());
  };

  return (
    <div className="modal-backdrop-v2">
      <div className="modal-v2">
        <h4>افزودن هدف جدید</h4>
        <div className="form-row">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="عنوان هدف (مثلاً: افزایش فروش ۲۰%)" />
        </div>
        <div className="form-row" style={{display: 'flex', gap: '8px'}}>
          <input style={{flex: 1}} value={owner} onChange={e => setOwner(e.target.value)} placeholder="مسئول (مثلاً: علیرضا)" />
          <DatePicker selected={dueDate} onChange={date => setDueDate(date)} dateFormat="yyyy/MM/dd" locale="fa" customInput={<input placeholder="تاریخ سررسید" style={{width: '120px'}}/>}/>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button className="btn ghost" onClick={onCancel}>انصراف</button>
          <button className="btn" onClick={handleSave}>افزودن هدف</button>
        </div>
      </div>
    </div>
  );
};


function OKRScreen({ user, onUpdateUser, onGoToDashboard }) {
  const [activeTimeframe, setActiveTimeframe] = useState('quarterly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKrText, setNewKrText] = useState({});
  const [newKpiData, setNewKpiData] = useState({});

  const objectives = useMemo(() => {
    return user?.okrsData?.[activeTimeframe] || [];
  }, [user, activeTimeframe]);
  
  const overallProgress = useMemo(() => {
    if (!objectives || objectives.length === 0) return 0;
    const progresses = objectives.flatMap(obj => obj.krs || []).map(kr => kr.progress || 0);
    if (progresses.length === 0) return 0;
    return Math.round(progresses.reduce((sum, p) => sum + p, 0) / progresses.length);
  }, [objectives]);
  
  if (!user) { return <div className="loading-container">در حال بارگذاری...</div>; }

  const handleUpdateObjectives = (newObjectives) => {
    const updatedOkrsData = { ...(user.okrsData || {}), [activeTimeframe]: newObjectives };
    onUpdateUser({ ...user, okrsData: updatedOkrsData });
  };
  
  const handleAddObjective = (newObjectiveData) => {
    const newObj = { id: Date.now(), ...newObjectiveData, kpis: [], created: new Date().toISOString() };
    handleUpdateObjectives([...objectives, newObj]);
    setIsModalOpen(false);
  };
  
  const handleAddKrToObjective = (objId) => {
    const text = newKrText[objId];
    if (!text || !text.trim()) return;
    const updatedObjectives = objectives.map(obj => {
      if (obj.id === objId) {
        const newKr = { id: Date.now(), title: text, progress: 0, kpis: [] };
        return { ...obj, krs: [...(obj.krs || []), newKr] };
      }
      return obj;
    });
    handleUpdateObjectives(updatedObjectives);
    setNewKrText({ ...newKrText, [objId]: '' });
  };

  const handleAddKpi = (objId, krId = null) => {
    const stateKey = krId ? `kr-${krId}` : `obj-${objId}`;
    const kpi = newKpiData[stateKey];
    if (!kpi || !kpi.title || !kpi.target) return;

    const updatedObjectives = objectives.map(obj => {
      if (obj.id !== objId) return obj;
      const newKpi = { id: Date.now(), title: kpi.title, targetValue: Number(kpi.target), currentValue: 0 };
      if (krId) {
        const updatedKrs = (obj.krs || []).map(kr => 
          kr.id === krId ? { ...kr, kpis: [...(kr.kpis || []), newKpi] } : kr
        );
        return { ...obj, krs: updatedKrs };
      } else {
        return { ...obj, kpis: [...(obj.kpis || []), newKpi] };
      }
    });

    handleUpdateObjectives(updatedObjectives);
    setNewKpiData({ ...newKpiData, [stateKey]: { title: '', target: '' } });
  };

  const handleUpdateKrProgress = (objId, krId, newProgress) => {
    const updatedObjectives = objectives.map(obj => {
      if (obj.id === objId) {
        const updatedKrs = (obj.krs || []).map(kr => 
          kr.id === krId ? { ...kr, progress: newProgress } : kr
        );
        return { ...obj, krs: updatedKrs };
      }
      return obj;
    });
    handleUpdateObjectives(updatedObjectives);
  };

  const handleUpdateKpiValue = (objId, krId, kpiId, newValue) => {
    const updatedObjectives = objectives.map(obj => {
      if (obj.id !== objId) return obj;
      const updateKpiLogic = (kpi) => kpi.id === kpiId ? { ...kpi, currentValue: Number(newValue) } : kpi;
      if (krId) {
        const updatedKrs = (obj.krs || []).map(kr => 
          kr.id === krId ? { ...kr, kpis: (kr.kpis || []).map(updateKpiLogic) } : kr
        );
        return { ...obj, krs: updatedKrs };
      } else {
        return { ...obj, kpis: (obj.kpis || []).map(updateKpiLogic) };
      }
    });
    handleUpdateObjectives(updatedObjectives);
  };

  const KpiComponent = ({ kpis, objId, krId = null }) => {
    const stateKey = krId ? `kr-${krId}` : `obj-${objId}`;
    const handleInputChange = (field, value) => {
      setNewKpiData({ ...newKpiData, [stateKey]: { ...(newKpiData[stateKey] || {}), [field]: value } });
    };

    return (
      <div className={krId ? 'kr-kpis' : 'kpis-section'}>
        {!krId && <h4 className="kpi-header">شاخص‌های کلیدی عملکرد (KPIs)</h4>}
        {(kpis || []).map(kpi => (
          <div key={kpi.id} className="kpi-item">
            <div className="kpi-title">{kpi.title}</div>
            <div className="kpi-progress-container">
              <div className="kpi-progress-bar"><div className="kpi-progress-fill" style={{width: `${Math.min(100, (kpi.currentValue / kpi.targetValue) * 100)}%`}}></div></div>
              <div className="kpi-values">
                <input type="number" className="kpi-current-input" value={kpi.currentValue} onChange={(e) => handleUpdateKpiValue(objId, krId, kpi.id, e.target.value)} />
                <span>/ {kpi.targetValue}</span>
              </div>
            </div>
          </div>
        ))}
        {/* ✅ بازطراحی فرم افزودن KPI */}
        <form className="light-input-group" onSubmit={(e) => { e.preventDefault(); handleAddKpi(objId, krId); }}>
          <input value={newKpiData[stateKey]?.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} className="small-input" placeholder="عنوان KPI جدید..." />
          <input value={newKpiData[stateKey]?.target || ''} onChange={(e) => handleInputChange('target', e.target.value)} type="number" className="small-input" placeholder="مقدار هدف" style={{flex: '0 1 80px'}}/>
          <button type="submit" className="btn small">+</button>
        </form>
      </div>
    );
  };

  return (
    <div className="okr-container v2-design">
      <AddObjectiveModal isOpen={isModalOpen} onSave={handleAddObjective} onCancel={() => setIsModalOpen(false)} />
      
      <div className="header-card-v2">
        <div style={{display: 'flex', gap: '18px', alignItems: 'center'}}>
          <div className="avatar-v2">{user.name.charAt(0)}</div>
          <div className="header-text-v2">
            <h1>سلام، {user.name}!</h1>
            <p>اهداف خود را اینجا مدیریت کنید</p>
          </div>
        </div>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn minimal" style={{padding: '10px 15px'}}>
          <i className="fa-solid fa-arrow-right"></i> بازگشت
        </button>
      </div>

      <div className="quick-grid">
        <div className={`quick q-blue ${activeTimeframe === 'yearly' ? 'active' : ''}`} onClick={() => setActiveTimeframe('yearly')}><div className="title">سالیانه</div><div className="sub">اهداف بلندمدت</div></div>
        <div className={`quick q-teal ${activeTimeframe === 'quarterly' ? 'active' : ''}`} onClick={() => setActiveTimeframe('quarterly')}><div className="title">فصلی</div><div className="sub">تمرکز سه ماهه</div></div>
        <div className={`quick q-orange ${activeTimeframe === 'monthly' ? 'active' : ''}`} onClick={() => setActiveTimeframe('monthly')}><div className="title">ماهانه</div><div className="sub">اقدامات سریع</div></div>
      </div>

      <div className="main-v2">
        <div className="left-panel-v2">
          <div className="okr-summary"><h3>پیشرفت کلی OKR</h3><div className="okr-small">نمودار پیشرفت اهداف این دوره</div></div>
          <div className="gauge-wrap"><div className="gauge"><svg viewBox="0 0 100 50"><path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#eef3f6" strokeWidth="10"></path><path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#3b82f6" strokeWidth="10" style={{strokeDasharray: `${overallProgress * 1.256}, 125.6`}}></path></svg><div className="pct">{overallProgress}%</div></div></div>
          <div className="actions"><button className="btn" onClick={() => setIsModalOpen(true)}>+ افزودن هدف جدید</button></div>
        </div>

        <div className="right-panel-v2">
          <div className="panel-header"><h2>اهداف ({activeTimeframe})</h2></div>
          <div className="objs">
            {objectives.length > 0 ? objectives.map(obj => (
              <div key={obj.id} className="obj-card">
                <div className="obj-head"><h3>{obj.title}</h3><div className="obj-meta">{obj.owner || 'بدون مسئول'} {obj.due ? `• تا ${new Date(obj.due).toLocaleDateString('fa-IR')}` : ''}</div></div>
                
                {(obj.krs || []).map(kr => (
                  <div key={kr.id}>
                    <div className="kr">
                      <div className="kr-left"><div className="kr-title">{kr.title}</div></div>
                      <div className="kr-actions">
                        <span className="kr-progress-label">{kr.progress || 0}%</span>
                        <input type="range" min="0" max="100" value={kr.progress || 0} onChange={(e) => handleUpdateKrProgress(obj.id, kr.id, parseInt(e.target.value))} />
                      </div>
                    </div>
                    <KpiComponent kpis={kr.kpis} objId={obj.id} krId={kr.id} />
                  </div>
                ))}
                
                {/* ✅ بازطراحی فرم افزودن KR */}
                <form className="light-input-group" onSubmit={(e) => { e.preventDefault(); handleAddKrToObjective(obj.id); }}>
                  <input value={newKrText[obj.id] || ''} onChange={(e) => setNewKrText({...newKrText, [obj.id]: e.target.value})} className="small-input" placeholder="نتیجه کلیدی جدید..." />
                  <button type="submit" className="btn small">+</button>
                </form>

                <KpiComponent kpis={obj.kpis} objId={obj.id} />
              </div>
            )) : <div className="no-data-placeholder">هنوز هدفی برای این بازه زمانی ثبت نشده است.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OKRScreen;