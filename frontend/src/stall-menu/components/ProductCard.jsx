import React from "react";

const ProductCard = ({ product, onClick }) => {
  const priceLabel =
    product.currency === "VND"
      ? `${Math.round(product.price).toLocaleString("vi-VN")}VND`
      : `GBP ${product.price.toFixed(2)}`;

  return (
    <button className="product-card" onClick={onClick} type="button">
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <ul className="product-detail-list">
          {product.details?.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>

        <div className="product-footer">
          <p className="product-price">{priceLabel}</p>
          <span
            className={`availability-badge ${product.isAvailable === false ? "sold-out" : ""}`}
          >
            {product.isAvailable === false ? "Sold out" : `+ ${product.prepTime || 10} min`}
          </span>
        </div>
      </div>

      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        {product.isFeatured && <span className="product-badge">-20%</span>}
        <span className="product-card-add">+</span>
      </div>
    </button>
  );
};

export default ProductCard;
