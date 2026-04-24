import React from 'react';
import '../../styles/StallManagement.css';

const BACKEND_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:8080';

const PLACEHOLDER_IMG = `${BACKEND_URL}/images/Chinese fried rice.png`;

/**
 * Resolves a product imageURL from the DB into a full URL.
 * The seed stores paths like "/images/Chinese fried rice.png".
 * The backend serves them at http://localhost:8080/images/...
 */
const resolveImage = (imageURL) => {
  if (!imageURL) return PLACEHOLDER_IMG;
  // Already a full URL (http / https)
  if (imageURL.startsWith('http')) return imageURL;
  // Relative path starting with /images/
  return `${BACKEND_URL}${imageURL}`;
};

const formatVND = (price) => {
  if (price == null) return '—';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
};

const StallOverview = ({ stall, products }) => {
  return (
    <div className="stall-overview">
      {/* Meta row */}
      <div className="overview-meta-row">
        <span className="overview-meta-item">
          <strong>Stall name:</strong> {stall?.name || '—'}
        </span>
        <span className="overview-meta-item">
          <strong>Sell:</strong> {stall?.sell || 'Food'}
        </span>
        <span className="overview-meta-item">
          <strong>Stall number:</strong> {stall?.stallNumber || '—'}
        </span>
      </div>

      {/* Description */}
      <div className="overview-description">
        <h3>Description:</h3>
        <p>
          {stall?.description ||
            'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.'}
        </p>
      </div>

      {/* Dishes */}
      <div className="overview-dishes">
        <h3>List of dishes:</h3>

        {products && products.length > 0 ? (
          <div className="dishes-grid">
            {products.map((product) => (
              <div key={product.productId} className="dish-card">
                <div className="dish-img-wrapper">
                  <img
                    src={resolveImage(product.imageURL)}
                    alt={product.name}
                    className="dish-img"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                  />
                </div>
                <div className="dish-info">
                  <div className="dish-name">{product.name}</div>
                  <div className="dish-price">{formatVND(product.price)}</div>
                  {product.category?.categoryName && (
                    <div className="dish-category">{product.category.categoryName}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-dishes-msg">No dishes available for this stall.</div>
        )}
      </div>
    </div>
  );
};

export default StallOverview;
