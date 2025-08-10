// src/components/PricesScreen.js

import React, { useState, useEffect } from 'react';

function PricesScreen({ onGoToDashboard }) {
  const [prices, setPrices] = useState({ gold: [], currency: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // اطمینان از صحت آدرس بک‌اند
        const response = await fetch('http://localhost:5001/api/prices');
        
        if (!response.ok) {
          // دریافت پیام خطا از بک‌اند در صورت وجود
          const errorData = await response.json();
          throw new Error(errorData.error || `خطای شبکه: ${response.status}`);
        }
        
        const data = await response.json();
        setPrices(data);

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrices();
  }, []);

  // تابع برای فرمت کردن اعداد
  const formatPrice = (price) => {
    if (price === 'N/A') return price;
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const renderPriceRow = (item) => (
    <div key={item.name} className="price-row">
      <span className="item-name">{item.name}</span>
      <span className="item-price">{formatPrice(item.price)}</span>
      <span className={`item-change ${Number(item.change) >= 0 ? 'positive' : 'negative'}`}>
        {item.change}
      </span>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return <div className="loading-container">در حال دریافت آخرین قیمت‌ها...</div>;
    }
    if (error) {
      return <div className="error-message">خطا: {error}</div>;
    }
    return (
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
    );
  };

  return (
    <div className="prices-container glass-card">
      <div className="page-header">
        <h1>قیمت‌های لحظه‌ای بازار</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn minimal">
          <i className="fa-solid fa-arrow-right"></i> بازگشت
        </button>
      </div>
      {renderContent()}
    </div>
  );
}

export default PricesScreen;