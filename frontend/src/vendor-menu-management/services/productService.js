import api from './api';

/**
 * Map backend product data to frontend format
 * Backend: { productId, name, description, price, imageURL, isAvailable, storeId, category }
 * Frontend: { id, name, desc, price, image, available, type, storeId }
 */
const mapProductToFrontend = (product) => ({
  id: product.productId,
  name: product.name,
  desc: product.description || '',
  price: Number(product.price),
  image: product.imageURL || 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=300&fit=crop',
  available: product.isAvailable,
  type: product.category?.categoryName || 'Food',
  storeId: product.storeId,
  categoryId: product.categoryId,
});

/**
 * Map frontend form data to backend format
 * Frontend: { name, desc, price, image, type }
 * Backend: { name, description, price, imageURL, categoryId }
 */
const mapProductToBackend = (formData, storeId, categoryId) => ({
  name: formData.name,
  description: formData.desc,
  price: Number(formData.price),
  imageURL: formData.image,
  isAvailable: formData.available ?? true,
  storeId: Number(storeId),
  categoryId: categoryId ? Number(categoryId) : 1, // Default to first category if not specified
});

const productService = {
  /**
   * Get all products for a specific store
   * @param {number} storeId - The store ID
   * @returns {Promise<Array>} Array of products in frontend format
   */
  async getProductsByStore(storeId) {
    const response = await api.get('/products', {
      params: { storeId },
    });
    return response.data.map(mapProductToFrontend);
  },

  /**
   * Get a single product by ID
   * @param {number} productId - The product ID
   * @returns {Promise<Object>} Product in frontend format
   */
  async getProductById(productId) {
    const response = await api.get(`/products/${productId}`);
    return mapProductToFrontend(response.data);
  },

  /**
   * Create a new product
   * @param {Object} formData - The product form data
   * @param {number} storeId - The store ID
   * @param {number} categoryId - The category ID
   * @returns {Promise<Object>} Created product in frontend format
   */
  async createProduct(formData, storeId, categoryId = 1) {
    const data = mapProductToBackend(formData, storeId, categoryId);
    const response = await api.post('/products', data);
    return mapProductToFrontend(response.data);
  },

  /**
   * Update an existing product
   * @param {number} productId - The product ID
   * @param {Object} formData - The product form data
   * @param {number} categoryId - The category ID
   * @returns {Promise<Object>} Updated product in frontend format
   */
  async updateProduct(productId, formData, categoryId) {
    const data = {
      name: formData.name,
      description: formData.desc,
      price: Number(formData.price),
      imageURL: formData.image,
      isAvailable: formData.available,
      ...(categoryId && { categoryId: Number(categoryId) }),
    };
    const response = await api.put(`/products/${productId}`, data);
    return mapProductToFrontend(response.data);
  },

  /**
   * Delete a product
   * @param {number} productId - The product ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteProduct(productId) {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  /**
   * Toggle product availability (sold out / available)
   * @param {number} productId - The product ID
   * @param {boolean} isAvailable - New availability status
   * @returns {Promise<Object>} Updated product in frontend format
   */
  async toggleAvailability(productId, isAvailable) {
    // Use the PATCH endpoint for marking sold out, or PUT for general updates
    if (isAvailable) {
      // If making available, we need to use PUT since there's no specific "mark available" endpoint
      const response = await api.patch(`/products/${productId}`, {
        isAvailable: true,
      });
      return mapProductToFrontend(response.data);
    } else {
      // Mark as sold out (unavailable)
      const response = await api.patch(`/products/${productId}/sold-out`);
      return mapProductToFrontend(response.data);
    }
  },

  /**
   * Update product availability status
   * @param {number} productId - The product ID
   * @param {boolean} isAvailable - New availability status
   * @returns {Promise<Object>} Updated product in frontend format
   */
  async updateAvailability(productId, isAvailable) {
    const response = await api.put(`/products/${productId}`, {
      isAvailable,
    });
    return mapProductToFrontend(response.data);
  },
};

export default productService;
