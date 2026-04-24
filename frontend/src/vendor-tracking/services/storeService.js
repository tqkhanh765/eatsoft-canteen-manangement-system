import API from './API';

/**
 * Toggle store open/close status
 * PATCH /stores/:id/toggle
 */
export const toggleStoreStatus = async (storeId) => {
  try {
    const response = await API.patch(`/stores/${storeId}/toggle`);
    return response.data;
  } catch (error) {
    console.error('Failed to toggle store status:', error);
    throw error;
  }
};

/**
 * Get store by ID
 * GET /stores/:id
 */
export const getStoreById = async (storeId) => {
  try {
    const response = await API.get(`/stores/${storeId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch store:', error);
    throw error;
  }
};
