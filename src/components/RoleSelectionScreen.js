// src/components/RoleSelectionScreen.js

import React from 'react';

// لیست نقش‌ها همراه با آیکون برای نمایش
// شما می‌توانید آیکون‌ها را از سایت Font Awesome پیدا و جایگزین کنید
const rolesConfig = {
  ceo: { name: 'مدیر عامل', icon: 'fa-solid fa-user-tie' },
  marketing: { name: 'مدیر مارکتینگ', icon: 'fa-solid fa-bullhorn' },
  hr: { name: 'مدیر منابع انسانی', icon: 'fa-solid fa-users' },
  product: { name: 'مدیر محصول', icon: 'fa-solid fa-cubes' },
  sales: { name: 'مدیر فروش', icon: 'fa-solid fa-chart-line' },
};

function RoleSelectionScreen({ onRoleSelect }) {
  return (
    <div className="role-selection quiz-container">
      <h1>یک نقش را انتخاب کنید</h1>
      <p className="page-description">
        سناریوی شبیه‌سازی بر اساس نقش انتخابی شما خواهد بود.
      </p>
      
      <div className="role-selection-grid">
        {Object.keys(rolesConfig).map((roleKey) => (
          <div key={roleKey} className="role-card" onClick={() => onRoleSelect(roleKey)}>
            <div className="role-card-icon">
              <i className={rolesConfig[roleKey].icon}></i>
            </div>
            <h3>{rolesConfig[roleKey].name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoleSelectionScreen;
