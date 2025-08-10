// src/components/ReviewDetailScreen.js

import React from 'react';
import { reviewsData } from '../data/reviewsData'; // داده‌های نمونه

// کامپوننت برای نمایش ستاره‌های امتیاز
const RatingStars = ({ score }) => {
  const fullStars = Math.floor(score);
  const halfStar = score % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="rating-star">★</span>)}
      {halfStar && <span key="half" className="rating-star">★</span>} {/* In a real app, you'd use a half-star icon */}
      {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="rating-star opacity-50">★</span>)}
    </div>
  );
};

function ReviewDetailScreen({ review, onGoBack }) {
  if (!review) return <div>نقد مورد نظر یافت نشد.</div>;

  return (
    <div className="review-detail-container glass-card">
      <header className="review-header">
        <img src={review.logoUrl} alt={`لوگوی ${review.productName}`} className="product-logo" />
        <div className="header-info">
          <h1>{review.productName}</h1>
          <p className="product-summary">{review.summary}</p>
          <div className="rating-wrapper">
            <RatingStars score={review.overallScore} />
            <span className="font-bold">{review.overallScore}</span>
            <span className="text-xs text-indigo-300">({review.votes} رأی)</span>
          </div>
        </div>
        <button onClick={onGoBack} className="back-button minimal">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
      </header>

      <main className="review-content">
        <section className="glass-card rounded-2xl overflow-hidden">
          <img src={review.videoUrl} alt="ویدیوی بررسی" className="w-full h-full object-cover" />
        </section>

        <section className="glass-card rounded-2xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="pros-cons-title text-green-400"><i className="fa-solid fa-check-circle"></i> نکات مثبت</h3>
              <ul className="pros-cons-list">
                {review.pros.map((pro, i) => <li key={i}><span>✓</span>{pro}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="pros-cons-title text-red-400"><i className="fa-solid fa-times-circle"></i> نکات منفی</h3>
              <ul className="pros-cons-list">
                {review.cons.map((con, i) => <li key={i}><span>✗</span>{con}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-lg mb-4">جدول مقایسه ویژگی‌ها</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead className="border-b border-white/20">
                <tr>
                  <th className="py-2 px-3 text-right">ویژگی</th>
                  <th className="py-2 px-3">{review.productName}</th>
                  <th className="py-2 px-3 text-indigo-300">پیام گستر</th>
                </tr>
              </thead>
              <tbody>
                {review.features.map((item, i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td className="py-3 px-3 text-right">{item.feature}</td>
                    <td className={`py-3 px-3 font-bold ${item.didar === '✓' ? 'text-green-400' : 'text-red-400'}`}>{item.didar}</td>
                    <td className={`py-3 px-3 font-bold ${item.payamgostar === '✓' ? 'text-green-400' : 'text-red-400'}`}>{item.payamgostar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-lg mb-3">بررسی کامل</h3>
          <div className="text-indigo-200 leading-relaxed space-y-4 text-justify">
            <p>{review.fullReview}</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ReviewDetailScreen;