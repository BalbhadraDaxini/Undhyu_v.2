import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://d2a7b3a3-ad7c-4560-bca6-c8874481d6c0.preview.emergentagent.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Products API
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductByHandle = async (handle) => {
  const response = await api.get(`/products/${handle}`);
  return response.data;
};

// Collections API
export const getCollections = async (params = {}) => {
  const response = await api.get('/collections', { params });
  return response.data;
};

export const getCollectionByHandle = async (handle) => {
  const response = await api.get(`/collections/${handle}`);
  return response.data;
};

export const getFeaturedCollections = async () => {
  const response = await api.get('/collections/featured');
  return response.data;
};

// Payment API
export const createRazorpayOrder = async (orderData) => {
  const response = await api.post('/create-razorpay-order', orderData);
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post('/verify-payment', paymentData);
  return response.data;
};

// Orders API
export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;