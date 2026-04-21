import React from 'react';
import '../../styles/StallManagement.css';

const StarIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#FBBF24" : "#D1D5DB"}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const StallFeedback = () => {
  const ratings = [
    { stars: 5, count: 623, percent: 80 },
    { stars: 4, count: 171, percent: 50 },
    { stars: 3, count: 58, percent: 30 },
    { stars: 2, count: 21, percent: 20 },
    { stars: 1, count: 123, percent: 40 },
  ];

  const reviews = [
    {
      id: 1,
      user: 'Trương Quốc Khánh',
      date: '09-04-2026',
      rating: 4,
      comment: 'The food is not as good as I expected !',
      photos: ['/dishes/burger.png', '/dishes/burger.png', '/dishes/burger.png'],
      response: 'Thanh you very much !'
    },
    {
      id: 2,
      user: 'Trương Quốc Khánh',
      date: '06-04-2026',
      rating: 4,
      comment: 'The food is not as good as I expected !',
      photos: ['/dishes/burger.png', '/dishes/burger.png', '/dishes/burger.png'],
      response: null
    }
  ];

  return (
    <div className="stall-feedback">
      <div className="feedback-summary">
        <div className="overall-rating">
          <div className="rating-label">Overall:</div>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} filled={s <= 4} />)}
          </div>
          <div className="rating-score">4.1</div>
          <div className="rating-total">Total: 1000 reviews</div>
        </div>
        <div className="rating-bars">
          {ratings.map(r => (
            <div key={r.stars} className="rating-bar-row">
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${r.percent}%` }}></div>
              </div>
              <span className="bar-count">{r.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="user-info">
                <div className="user-avatar"></div>
                <div className="user-text">
                  <div className="user-name">{review.user}</div>
                  <div className="review-date">{review.date}</div>
                </div>
              </div>
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} filled={s <= review.rating} />)}
              </div>
            </div>
            <div className="review-comment">{review.comment}</div>
            <div className="review-photos">
              {review.photos.map((photo, i) => (
                <img key={i} src={photo} alt="review" className="review-photo" />
              ))}
            </div>
            {review.response && (
              <div className="vendor-response">
                <span className="response-label">Response from Vendor</span>
                <p>{review.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StallFeedback;
