import React from 'react';
import './DiscoveryHeader.css';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const DiscoveryHeader = () => {
  return (
    <div className="discovery-header">
      <div className="header-content">
        <div className="header-text">
          <h1>Food Stalls</h1>
          <p>Find your favorite meals around the campus canteen!</p>
        </div>
        <div className="search-box">
          <SearchIcon />
          <input type="text" placeholder="Search for stores or dishes..." />
        </div>
      </div>
    </div>
  );
};

export default DiscoveryHeader;
