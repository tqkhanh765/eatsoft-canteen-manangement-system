import React from 'react';
import { CATEGORIES } from '../constants';
import './MenuToolbar.css';

const SearchIcon = () => (
  <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/**
 * MenuToolbar
 *
 * Props:
 *   search        {string}   – current search text
 *   filterCat     {string}   – selected category ('All' | CATEGORIES[n])
 *   filterAvail   {string}   – selected status ('All' | 'Available' | 'Sold Out')
 *   onSearch      {function} – (value: string) => void
 *   onFilterCat   {function} – (value: string) => void
 *   onFilterAvail {function} – (value: string) => void
 */
const MenuToolbar = ({ search, filterCat, filterAvail, onSearch, onFilterCat, onFilterAvail }) => (
  <div className="menu-toolbar" role="search" aria-label="Menu filters">

    {/* ── Search bar ── */}
    <div className="search-wrap">
      <SearchIcon />
      <input
        id="menu-search"
        className="search-input"
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search items by name"
      />
      {search && (
        <button
          className="search-clear"
          onClick={() => onSearch('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>

    {/* ── Category filter ── */}
    <select
      id="filter-category"
      className="filter-select"
      value={filterCat}
      onChange={(e) => onFilterCat(e.target.value)}
      aria-label="Filter by category"
    >
      <option value="All">All Categories</option>
      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
    </select>

    {/* ── Availability filter ── */}
    <select
      id="filter-availability"
      className="filter-select"
      value={filterAvail}
      onChange={(e) => onFilterAvail(e.target.value)}
      aria-label="Filter by availability status"
    >
      <option value="All">All Status</option>
      <option value="Available">Available</option>
      <option value="Sold Out">Sold Out</option>
    </select>
  </div>
);

export default MenuToolbar;
