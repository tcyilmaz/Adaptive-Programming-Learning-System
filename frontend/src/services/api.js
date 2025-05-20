import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor'ı apiClient tanımlandıktan hemen sonra eklemek iyi bir pratiktir
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Authentication ---
export const register = (userData) => {
  return apiClient.post("/auth/register", userData);
};

export const login = (credentials) => {
  return apiClient.post("/auth/login", credentials);
};

export const getMyProfile = () => {
  return apiClient.get("/auth/me");
};

// --- Courses ---
export const getAllCourses = () => {
  // <<<--- BU FONKSİYONU EKLE
  return apiClient.get("/courses");
};

export const getCourseById = (courseId) => {
  // <<<--- BU FONKSİYONU EKLE
  return apiClient.get(`/courses/${courseId}`);
};

// --- Questions ---
export const getQuestionsByCourse = (courseId) => {
  return apiClient.get(`/courses/${courseId}/questions`);
};

export default apiClient; // apiClient'i de default olarak export etmeye devam et
