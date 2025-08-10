// src/components/ReviewHomeScreen.js
import React, { useState, useEffect } from 'react';

function ReviewHomeScreen({ onGoToDashboard }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      // در آینده این آدرس به بک‌اند واقعی متصل می‌شود
      // فعلا از داده نمونه استفاده می‌کنیم
      const mockData = [
        { _id: 'CRM', items: [{productName: 'دیدار'}] },
        { _id: 'حسابداری', items: [{productName: 'هلو'}] },
        { _id: 'باشگاه مشتریان', items: [{productName: 'اورست'}] },
      ];
      setCategories(mockData);
      setIsLoading(false);
    };
    fetchReviews();
  }, []);

  if (isLoading) { return <div className="loading-container">در حال بارگذاری...</div>; }

  return (
    <div className="review-home-container glass-card">
      <div className="page-header">
        <h1>نقد و بررسی ابزارها</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn minimal">
          <i className="fa-solid fa-arrow-right"></i> بازگشت
        </button>
      </div>
      <p className="page-description">بهترین ابزارهای کسب‌وکار را بر اساس نقد تخصصی ما انتخاب کنید.</p>
      <div className="category-grid">
        {categories.map(cat => (
          <div key={cat._id} className="category-card glass-card">
            <h3>{cat._id}</h3>
            <p>{cat.items.length} ابزار بررسی شده</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ReviewHomeScreen;