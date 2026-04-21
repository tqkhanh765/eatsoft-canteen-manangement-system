import React from 'react';
import '../../styles/StallManagement.css';

const StallOverview = ({ stall }) => {
  const dishes = Array(8).fill({
    name: 'Burgers & Fast food',
    restaurants: '21 Restaurants',
    image: '/dishes/burger.png'
  });

  return (
    <div className="stall-overview">
      <div className="overview-grid">
        <div className="overview-item">
          <h3>Stall name:</h3>
          <p>{stall.name}</p>
        </div>
        <div className="overview-item">
          <h3>Sell:</h3>
          <p>Food</p>
        </div>
        <div className="overview-item">
          <h3>Stall number:</h3>
          <p>01</p>
        </div>
      </div>

      <div className="description-section">
        <h3>Description:</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque 
          faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi 
          pretium tellus duis convallis. Tempus leo eu aenean sed diam urna 
          tempor. Pulvinar vivamus fringilla lacus nec metus bibendum 
          egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. 
          Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora 
          torquent per conubia nostra inceptos himenaeos.
        </p>
      </div>

      <div className="dishes-list">
        <h3>List of dishes:</h3>
        <div className="dishes-grid">
          {dishes.map((dish, index) => (
            <div key={index} className="dish-card">
              <img src={dish.image} alt={dish.name} className="dish-img" />
              <div className="dish-info">
                <div className="dish-name">{dish.name}</div>
                <div className="dish-restaurants">{dish.restaurants}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StallOverview;
