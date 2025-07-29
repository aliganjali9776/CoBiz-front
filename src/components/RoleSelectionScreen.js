// src/components/RoleSelectionScreen.js

import React from 'react';
import { quizData } from '../QuizData'; // مسیر فایل دیتا
import logo from '../logo.jpeg'; // مسیر فایل لوگو

function RoleSelectionScreen({ onRoleSelect }) {
  return (
    <div className="App">
      <div className="role-selection">
        <img src={logo} alt="لوگوی مدیر یک دقیقه‌ای" className="app-logo" />
        <h1>یک نقش را برای شروع شبیه‌سازی انتخاب کنید</h1>
        <div className="role-buttons">
          {Object.keys(quizData).map((roleKey) => (
            <button key={roleKey} onClick={() => onRoleSelect(roleKey)}>
              {quizData[roleKey].name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoleSelectionScreen;