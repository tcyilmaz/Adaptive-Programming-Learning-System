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
    // userData should be { username, email, password }
    return apiClient.post('/auth/register', userData);
};

export const login = (credentials) => {
    // credentials should be { email, password }
    return apiClient.post('/auth/login', credentials);
};

// --- Add other API functions later (questions, profile, etc.) ---

// --- Interceptor to add JWT token to requests (Important!) ---
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Or sessionStorage
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
// might need to add VITE_API_BASE_URL=http://localhost:3001/api to a .env file in your frontend directory for Vite to pick it up