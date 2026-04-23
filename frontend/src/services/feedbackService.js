const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Get all feedbacks
 */
export const getAllFeedbacks = async () => {
  const response = await fetch(`${API_URL}/feedbacks`);
  if (!response.ok) throw new Error('Failed to fetch feedbacks');
  return response.json();
};

/**
 * Get feedback by ID
 */
export const getFeedbackById = async (id) => {
  const response = await fetch(`${API_URL}/feedbacks/${id}`);
  if (!response.ok) throw new Error('Failed to fetch feedback');
  return response.json();
};

/**
 * Create feedback for an order item
 * @param {Object} data - { orderItemId, rating, comment }
 */
export const createFeedback = async (data) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/feedbacks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create feedback');
  }
  return response.json();
};

/**
 * Update feedback
 * @param {number} id - Feedback ID
 * @param {Object} data - { rating, comment }
 */
export const updateFeedback = async (id, data) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/feedbacks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update feedback');
  }
  return response.json();
};

/**
 * Delete feedback
 */
export const deleteFeedback = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/feedbacks/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
  if (!response.ok) throw new Error('Failed to delete feedback');
  return response.json();
};
