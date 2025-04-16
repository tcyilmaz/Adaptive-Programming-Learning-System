// frontend/src/services/api.js
import axios from 'axios';

// Define the base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Authentication Endpoints ---

export const register = (userData) => {
    // userData = { username, email, password }
    return apiClient.post('/auth/register', userData);
};

export const login = (credentials) => {
    // credentials = { email, password }
    return apiClient.post('/auth/login', credentials);
};

//other API functions

//Interceptor to add JWT token requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;