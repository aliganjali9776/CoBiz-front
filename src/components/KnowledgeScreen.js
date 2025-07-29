// src/components/KnowledgeScreen.js

import React, { useState, useEffect, useMemo } from 'react';

const BACKEND_URL = 'https://cobiz.onrender.com';

const ArticleCard = ({ article }) => {
  return (
    <div className="article-card">
      <span className="article-format">{article.format}</span>
      <h3>{article.title}</h3>
      <p className="article-summary">{article.summary}</p>
      <div className="article-tags">
        {(article.tags || []).map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>
    </div>
  );
};

function KnowledgeScreen({ onGoToDashboard }) {
  const [knowledgeData, setKnowledgeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFormat, setActiveFormat] = useState('All'); 
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/articles`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setKnowledgeData(data);
        } else {
          setKnowledgeData([]);
        }
      } catch (error) {
        console.error("خطا در دریافت مقالات از سرور:", error);
        setKnowledgeData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const formats = useMemo(() => 
    ['All', ...new Set(knowledgeData.map(item => item.format))]
  , [knowledgeData]);
  const categories = useMemo(() => 
    ['All', ...new Set(knowledgeData.map(item => item.category))]
  , [knowledgeData]);

  const filteredArticles = useMemo(() => {
    return knowledgeData.filter(article => {
      const matchesFormat = activeFormat === 'All' || article.format === activeFormat;
      const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            article.summary.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFormat && matchesCategory && matchesSearch;
    });
  }, [activeFormat, activeCategory, searchTerm, knowledgeData]);

  const formatIcons = {
    'خلاصه کتاب': 'fa-solid fa-book-open-reader',
    'چک‌لیست': 'fa-solid fa-list-check',
    'چارچوب': 'fa-solid fa-sitemap',
    'مقاله علمی': 'fa-solid fa-atom',
  };

  if (isLoading) {
    return <div className="loading-container">در حال بارگذاری مقالات...</div>;
  }

  return (
    <div className="knowledge-container">
      <div className="page-header">
        <h1>کتابخانه دانش مدیریتی</h1>
        <button onClick={onGoToDashboard} className="back-to-dashboard-btn">
          <i className="fa-solid fa-arrow-right"></i> بازگشت به منوی اصلی
        </button>
      </div>
      <div className="format-cards-grid">
        {formats.map(format => (
          <div key={format} className={`format-card ${activeFormat === format ? 'active' : ''}`} onClick={() => setActiveFormat(format)}>
            {format !== 'All' && <i className={formatIcons[format]}></i>}
            <span>{format === 'All' ? 'همه مطالب' : format}</span>
          </div>
        ))}
      </div>
      <div className="knowledge-filters secondary">
        <div className="category-filter">
          <label htmlFor="category-select">فیلتر موضوع:</label>
          <select id="category-select" value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'همه موضوعات' : cat}
              </option>
            ))}
          </select>
        </div>
        <div className="search-bar">
          <i className="fa-solid fa-search"></i>
          <input type="text" placeholder="جستجو در مقالات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="articles-grid">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => <ArticleCard key={article._id || article.id} article={article} />)
        ) : (
          <p className="no-results">مطلبی مطابق با فیلتر شما یافت نشد.</p>
        )}
      </div>
    </div>
  );
}

export default KnowledgeScreen;