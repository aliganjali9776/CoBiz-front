// src/components/NewsScreen.js

import React, { useState, useMemo } from 'react';
import { newsData } from '../data/newsData';

function NewsScreen({ onGoToDashboard }) {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = useMemo(() => 
    ['All', ...new Set(newsData.map(item => item.category))]
  , []);

  const filteredNews = useMemo(() => {
    if (activeCategory === 'All') {
      return newsData;
    }
    return newsData.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="news-container glass-card">
      <div className="page-header">
        <h1>آخرین اخبار کسب‌وکار</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn minimal">
          <i className="fa-solid fa-arrow-right"></i> بازگشت
        </button>
      </div>
      
      <div className="category-filters">
        {categories.map(category => (
          <button 
            key={category}
            className={`filter-chip ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category === 'All' ? 'همه اخبار' : category}
          </button>
        ))}
      </div>

      <div className="news-list">
        {filteredNews.map(item => (
          <div key={item.id} className="news-card glass-card">
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <div className="news-card-footer">
              <span>منبع: {item.source}</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsScreen;