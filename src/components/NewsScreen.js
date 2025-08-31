// src/components/NewsScreen.js

import React, { useState, useEffect, useMemo } from 'react';

function NewsScreen({ onGoToDashboard }) {
  const [news, setNews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Updated categories with Persian names and added 'Economy'
  const categories = useMemo(() => ['All', 'Economy', 'Business', 'Technology', 'Science'], []);
  const categoryMap = useMemo(() => ({
    'All': 'همه اخبار',
    'Economy': 'اقتصاد',
    'Business': 'کسب‌وکار',
    'Technology': 'تکنولوژی',
    'Science': 'علم'
  }), []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5001/api/news');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'خطا در دریافت اخبار.');
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = useMemo(() => {
    if (activeCategory === 'All') {
      return news;
    }
    return news.filter(item => {
      // Safely check if item.category is an array and includes the active category
      // The API returns an array of categories, so we check for includes
      return Array.isArray(item.category) && item.category.some(cat => cat.toLowerCase() === activeCategory.toLowerCase());
    });
  }, [news, activeCategory]);

  const renderNewsCard = (item) => (
    <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-card-link">
      <div key={item.title} className="news-card">
        <img src={item.image_url || 'https://placehold.co/400x200/cccccc/333333?text=No+Image'} alt={item.title} className="news-image" />
        <div className="news-content">
          <span className="news-source">{item.source_id}</span>
          <h4 className="news-title">{item.title}</h4>
          <p className="news-description">{item.description}</p>
        </div>
      </div>
    </a>
  );

  return (
    <div className="news-container glass-card">
      <div className="page-header">
        <h1>آخرین اخبار</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn minimal">
          <i className="fa-solid fa-arrow-right"></i> بازگشت
        </button>
      </div>

      <div className="category-filters">
        {categories.map(category => (
          <button 
            key={category}
            className={`filter-chip ${activeCategory.toLowerCase() === category.toLowerCase() ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {categoryMap[category]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="loading-container">در حال دریافت آخرین اخبار...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="news-grid">
          {filteredNews.map(renderNewsCard)}
        </div>
      )}
    </div>
  );
}

export default NewsScreen;
