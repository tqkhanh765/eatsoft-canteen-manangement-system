import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuHeader from "../components/MenuHeader";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import { getMenuByStall } from "../services/menuService";
import { STORES } from "../../food-stalls/data/stores";
import "../styles/stallMenu.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const StallMenuPage = ({ onLoginClick }) => {
  const { stallId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [stallInfo, setStallInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showClosedModal, setShowClosedModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);

      try {
        // Fetch stall info first
        const storeResponse = await fetch(`${API_BASE_URL}/stores/${stallId}`);
        if (!storeResponse.ok) throw new Error('Failed to fetch stall info');
        const storeData = await storeResponse.json();
        setStallInfo(storeData);

        const data = await getMenuByStall(storeData);
        setCategories(data.categories || ["All"]);
        setProducts(data.products || []);
        setOffers(data.offers || []);
        
        // Show modal if store is closed
        if (storeData.isOpen === false) {
          setShowClosedModal(true);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [stallId]);

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
      rating: stallInfo?.rating || "0.0",
      reviews: stallInfo?.reviews || "0",
    };
  }, [products, stallInfo]);

  const activeSectionTitle = useMemo(() => {
    return selectedCategory === "All" ? "Our Menu" : selectedCategory;
  }, [selectedCategory]);

  const handleBack = () => {
    navigate('/stalls');
  };

  return (
    <div className="stall-menu-page">
      <MenuHeader stall={stallInfo} stallInfo={stallInfo} stats={stats} onBack={handleBack} />

      <section className="stall-menu-content">
        <div className="stall-menu-toolbar">
          <div>
            <h2 className="toolbar-title">
              Offers from {stallInfo?.storeName || "Big U"}
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
              onClick={() => stallInfo?.isOpen !== false && setSelectedProduct(product)}
              disabled={stallInfo?.isOpen === false}
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
          storeId={stallInfo?.storeId}
          onLoginClick={onLoginClick}
        />
      )}

      {showClosedModal && (
        <div className="store-closed-modal-overlay">
          <div className="store-closed-modal-content">
            <div className="store-closed-icon">🔒</div>
            <h2>Store Closed</h2>
            <p>This store is currently not accepting orders. Please check back later.</p>
            <button 
              className="store-closed-btn"
              onClick={() => {
                setShowClosedModal(false);
                navigate('/stalls');
              }}
            >
              Back to Stalls
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StallMenuPage;
