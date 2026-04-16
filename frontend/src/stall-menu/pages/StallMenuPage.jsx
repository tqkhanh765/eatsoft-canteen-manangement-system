import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuHeader from "../components/MenuHeader";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import { getMenuByStall } from "../services/menuService";
import { STORES } from "../../food-stalls/data/stores";
import "../styles/stallMenu.css";

const StallMenuPage = () => {
  const { stallId } = useParams();
  const navigate = useNavigate();
  const stall = STORES.find(store => store.id === parseInt(stallId));
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [stallInfo, setStallInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);

      try {
        const data = await getMenuByStall(stall);
        setCategories(data.categories || ["All"]);
        setProducts(data.products || []);
        setOffers(data.offers || []);
        setStallInfo(data.stallInfo || null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [stall]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  const stats = useMemo(() => {
    const availableCount = products.filter((product) => product.isAvailable !== false).length;

    return {
      total: products.length,
      available: availableCount,
      rating: stallInfo?.rating || "3.4",
      reviews: stallInfo?.reviews || "1,360 reviews",
    };
  }, [products, stallInfo]);

  const activeSectionTitle = selectedCategory === "All" ? "Burgers" : selectedCategory;

  const handleBack = () => {
    navigate('/stalls');
  };

  return (
    <div className="stall-menu-page">
      <MenuHeader stall={stall} stallInfo={stallInfo} stats={stats} onBack={handleBack} />

      <section className="stall-menu-content">
        <div className="stall-menu-toolbar">
          <div>
            <h2 className="toolbar-title">
              Offers from {stall?.name || stallInfo?.name || "Big U"}
            </h2>
          </div>

          <div className="stall-menu-actions">
            <button className="toolbar-action-btn" type="button">
              Filter
            </button>
            <label className="stall-search">
              <span className="stall-search-icon">o</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search from menu..."
                aria-label="Search from menu"
              />
            </label>
          </div>
        </div>

        <div className="offer-grid">
          {offers.map((offer) => (
            <article className="offer-card" key={offer.id}>
              <img className="offer-card-image" src={offer.image} alt={offer.title} />
              <span className="offer-card-discount">{offer.discount}</span>
              <div className="offer-card-overlay">
                <p className="offer-card-label">{offer.label}</p>
                <h3>{offer.title}</h3>
              </div>
              <button className="offer-card-plus" type="button" aria-label={`View ${offer.title}`}>
                +
              </button>
            </article>
          ))}
        </div>

        <div className="menu-section-header">
          <div>
            <p className="toolbar-label">Menu section</p>
            <h2 className="menu-section-title">{activeSectionTitle}</h2>
          </div>
          <p className="toolbar-summary">
            {isLoading
              ? "Loading menu..."
              : `${filteredProducts.length} items - ${stats.available} available`}
          </p>
        </div>

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="menu-empty-state">
              <h3>No items match this filter</h3>
              <p>Try another category or search term to browse the full stall menu.</p>
            </div>
          )}
        </div>
      </section>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default StallMenuPage;
