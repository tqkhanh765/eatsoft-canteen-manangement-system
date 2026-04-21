import React, { useState } from 'react';
import '../../styles/StallManagement.css';

/* ── helpers ─────────────────────────────────── */

const StarIcon = ({ filled, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#FBBF24' : '#D1D5DB'}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const UserCircleIcon = () => (
  <svg width="46" height="46" viewBox="0 0 24 24" fill="#9CA3AF">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </svg>
);

const BACKEND_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:8080';

const resolveImage = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BACKEND_URL}${url}`;
};

const formatDate = (isoStr) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

/* ── aggregation ─────────────────────────────── */

/**
 * Given a flat array of feedback objects (each with .rating 1-5),
 * compute:
 *  - counts[5], counts[4], ..., counts[1]
 *  - total
 *  - average (1 decimal, 0 if no reviews)
 */
const computeStats = (feedbacks) => {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  feedbacks.forEach((f) => {
    const r = Math.round(f.rating);
    if (r >= 1 && r <= 5) {
      counts[r] += 1;
      sum += r;
    }
  });

  const total = feedbacks.length;
  const average = total > 0 ? (sum / total).toFixed(1) : '0.0';
  return { counts, total, average };
};

/* ── component ───────────────────────────────── */

const StallFeedback = ({ feedbacks = [] }) => {
  const [activeFilter, setActiveFilter] = useState(0); // 0 = All

  const { counts, total, average } = computeStats(feedbacks);
  const avgNum = parseFloat(average);
  const filledStars = Math.round(avgNum);
  const maxCount = Math.max(...Object.values(counts), 1);

  // Bar rows shown 5 → 1
  const barRows = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    percent: Math.round((counts[star] / maxCount) * 100),
  }));

  // Apply filter
  const visibleFeedbacks = activeFilter === 0
    ? feedbacks
    : feedbacks.filter((f) => Math.round(f.rating) === activeFilter);

  return (
    <div className="stall-feedback">
      {/* ── Rating Summary Card ───────────── */}
      <div className="feedback-summary-card">

        {/* Left column */}
        <div className="feedback-overall-col">
          <div className="feedback-overall-label">Overall:</div>

          {/* 5-star row */}
          <div className="feedback-overall-stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon key={s} filled={s <= filledStars} size={22} />
            ))}
          </div>

          {/* Big score + single gold star */}
          <div className="feedback-overall-score">
            <span className="score-number">{average}</span>
            <StarIcon filled size={36} />
          </div>

          <div className="feedback-overall-total">
            Total: {total} review{total !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Right column – bar chart */}
        <div className="feedback-bars-col">
          {barRows.map(({ star, count, percent }) => (
            <div key={star} className="feedback-bar-row">
              <div className="feedback-bar-track">
                <div
                  className="feedback-bar-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="feedback-bar-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Rating Filter Bar ─────────────── */}
      <div className="rating-filter-bar">
        <button
          className={`rating-filter-btn ${activeFilter === 0 ? 'active' : ''}`}
          onClick={() => setActiveFilter(0)}
        >
          All
          <span className="filter-count">{total}</span>
        </button>
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            className={`rating-filter-btn ${activeFilter === star ? 'active' : ''}`}
            onClick={() => setActiveFilter(activeFilter === star ? 0 : star)}
          >
            {star} <StarIcon filled={activeFilter === star} size={14} />
            <span className="filter-count">{counts[star]}</span>
          </button>
        ))}
      </div>

      {/* ── Individual Reviews ─────────────── */}
      {visibleFeedbacks.length === 0 ? (
        <div className="no-feedback-msg">
          {feedbacks.length === 0
            ? 'No reviews for this stall yet.'
            : `No ${activeFilter}★ reviews found.`}
        </div>
      ) : (
        <div className="reviews-wrapper">
          {visibleFeedbacks.map((feedback, idx) => {
            const userName =
              feedback.orderItem?.order?.user?.userName || 'Anonymous';
            const date = formatDate(feedback.createdAt);
            const rating = feedback.rating || 0;
            const comment = feedback.comment || '';
            const productImg = feedback.orderItem?.product?.imageURL
              ? resolveImage(feedback.orderItem.product.imageURL)
              : null;

            return (
              <div
                key={feedback.feedbackId}
                className={`review-item ${idx < visibleFeedbacks.length - 1 ? 'review-item--border' : ''}`}
              >
                {/* Header: avatar + name/date + stars */}
                <div className="review-top-row">
                  <div className="review-user-block">
                    <div className="review-avatar">
                      <UserCircleIcon />
                    </div>
                    <div className="review-user-text">
                      <div className="review-user-name">{userName}</div>
                      <div className="review-user-date">{date}</div>
                    </div>
                  </div>
                  <div className="review-star-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon key={s} filled={s <= rating} size={20} />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                {comment && (
                  <p className="review-comment-text">{comment}</p>
                )}

                {/* Product thumbnail (if available) */}
                {productImg && (
                  <div className="review-photos-row">
                    <img
                      src={productImg}
                      alt="product"
                      className="review-thumb"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StallFeedback;
