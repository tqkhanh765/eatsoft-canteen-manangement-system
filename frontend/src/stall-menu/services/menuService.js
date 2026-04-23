const createDishImage = (title, accent) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bg)" rx="40" />
      <circle cx="610" cy="150" r="96" fill="rgba(255,255,255,0.12)" />
      <circle cx="168" cy="468" r="130" fill="rgba(255,255,255,0.1)" />
      <text x="70" y="460" fill="#ffffff" font-size="64" font-family="Arial, sans-serif" font-weight="700">${title}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const API_BASE_URL = 'http://localhost:8080/api';
const BACKEND_URL = 'http://localhost:8080'; // For images without /api prefix

/**
 * Fetch products from the backend for a specific store
 * @param {number} storeId - The store ID to fetch products for
 * @returns {Promise<Array>} Array of products
 */
const fetchProductsByStore = async (storeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?storeId=${storeId}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Helper to get full image URL
 * @param {string} imageURL - Image URL from database
 * @returns {string} Full image URL
 */
const getFullImageUrl = (imageURL) => {
  if (!imageURL) return createDishImage('No Image', '#4f46e5');
  if (imageURL.startsWith('http')) return imageURL; // Already a full URL
  if (imageURL.startsWith('/')) {
    const fullUrl = `${BACKEND_URL}${imageURL}`;
    console.log('Image URL converted:', imageURL, '->', fullUrl);
    return fullUrl;
  }
  return imageURL;
};

/**
 * Map database product to UI product format
 * @param {Object} dbProduct - Product from database
 * @returns {Object} Product in UI format
 */
const mapProductToUI = (dbProduct) => ({
  id: dbProduct.productId,
  productId: dbProduct.productId,
  name: dbProduct.name,
  description: dbProduct.description || '',
  price: Number(dbProduct.price),
  currency: 'VND',
  isAvailable: dbProduct.isAvailable,
  image: getFullImageUrl(dbProduct.imageURL),
  category: dbProduct.category?.categoryName || 'All',
  soldCount: dbProduct.soldCount || 0,
  prepTime: 10,
  isFeatured: false,
});

/**
 * Fetch store by ID
 * @param {number} storeId - The store ID
 * @returns {Promise<Object>} Store data
 */
const fetchStoreById = async (storeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores/${storeId}`);
    if (!response.ok) throw new Error('Failed to fetch store');
    return await response.json();
  } catch (error) {
    console.error('Error fetching store:', error);
    return null;
  }
};

export const getMenuByStall = async (stall) => {
  // Map frontend stall id to backend storeId
  // For now, assume frontend id = backend storeId
  const storeId = stall?.id || 1;

  // Fetch products from database
  const products = await fetchProductsByStore(storeId);

  // Fetch store data to get isOpen status
  const storeData = await fetchStoreById(storeId);

  // Extract unique categories from products
  const categories = ['All', ...new Set(products.map(p => p.category?.categoryName || 'All'))];

  return {
    categories: categories.filter(Boolean),
    stallName: stall?.name || "Campus stall",
    stallInfo: {
      name: stall?.name || "Campus stall",
      tagline: "Delicious food",
      minimumOrder: "No minimum",
      deliveryTime: stall?.time || "15-20 min",
      openHours: "08:00 A.M. - 14:00 P.M.",
      rating: stall?.rating?.toString() || "4.5",
      reviews: `${stall?.reviews || 0} reviews`,
      isOpen: storeData?.isOpen ?? true,
    },
    offers: [],
    products: products.map(mapProductToUI),
  };
};
