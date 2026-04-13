import React from "react";

const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-tabs" role="tablist" aria-label="Menu categories">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-tab ${selectedCategory === category ? "active" : ""}`}
          onClick={() => onSelectCategory(category)}
          type="button"
          role="tab"
          aria-selected={selectedCategory === category}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
