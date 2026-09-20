import axios from 'axios';

const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000/api'
    : 'https://satquery-backend.onrender.com/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (username, email, password, password2) => {
  const response = await api.post('/auth/register/', {
    username, email, password, password2,
  });
  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await api.post('/auth/login/', { username, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me/');
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const askAIQuery = async (location, query) => {
  const response = await api.post('/ai-query/', {
    lat: location.lat,
    lng: location.lng,
    query: query,
    location_name: location.name || 'Selected Location',
  });
  return response.data;
};

export const createAnalysis = async (data, files) => {
  const formData = new FormData();
  formData.append('title', data.title || '');
  formData.append('description', data.description || '');
  formData.append('analysis_type', data.analysis_type || 'single');
  formData.append('query', data.query || '');
  
  if (data.start_date) formData.append('start_date', data.start_date);
  if (data.end_date) formData.append('end_date', data.end_date);
  
  if (files && files.length > 0) {
    files.forEach((file) => formData.append('images', file));
  }
  
  const response = await api.post('/analysis-requests/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getMyAnalyses = async () => {
  const response = await api.get('/analysis-requests/');
  return response.data;
};

export const getAnalysisById = async (id) => {
  const response = await api.get(`/analysis-requests/${id}/`);
  return response.data;
};

export default api;