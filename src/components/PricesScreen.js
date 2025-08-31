// src/components/PricesScreen.js

import React, { useState, useEffect } from 'react';

function PricesScreen({ onGoToDashboard }) {
  const [prices, setPrices] = useState({ gold: [], currency: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/prices'); // اتصال به بک‌اند خودمان
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'خطا در دریافت داده‌ها');
        }
        setPrices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrices();
  }, []);

  // تابع برای فرمت کردن قیمت با جداکننده هزارگان و اضافه کردن واحد
  const formatPrice = (price, unit) => {
    if (price === 'N/A') return 'نامشخص';
    return `${new Intl.NumberFormat('fa-IR').format(price)} (${unit})`;
  };

  // تابع برای فرمت کردن تغییرات با علامت درصد
  const formatChange = (change) => {
    if (change === 'N/A') return 'نامشخص';
    const num = Number(change);
    if (num > 0) return `+${num.toFixed(2)}%`;
    return `${num.toFixed(2)}%`;
  };

  const renderPriceRow = (item) => (
    <div key={item.name} className="price-row">
      <span className="item-name">{item.name}</span>
      <span className="item-price">{formatPrice(item.price, item.unit)}</span>
      <span className={`item-change ${Number(item.change) >= 0 ? 'positive' : 'negative'}`}>
        {formatChange(item.change)}
      </span>
    </div>
  );

  return (
    <div className="prices-container glass-card">
      <div className="page-header">
        <h1>قیمت‌های لحظه‌ای بازار</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn minimal">
          <i className="fa-solid fa-arrow-right"></i> بازگشت
        </button>
      </div>
      
      {isLoading ? (
        <div className="loading-container">در حال دریافت آخرین قیمت‌ها...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="price-cards-grid">
          <div className="price-card">
            <div className="price-card-header gold">
              <i className="fa-solid fa-coins"></i>
              <h3>طلا و سکه</h3>
            </div>
            <div className="price-card-body">
              {prices.gold.map(renderPriceRow)}
            </div>
          </div>
          <div className="price-card">
            <div className="price-card-header currency">
              <i className="fa-solid fa-dollar-sign"></i>
              <h3>ارز</h3>
            </div>
            <div className="price-card-body">
              {prices.currency.map(renderPriceRow)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PricesScreen;
