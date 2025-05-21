import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const register = (userData) => {
  return apiClient.post("/auth/register", userData);
};

export const login = (credentials) => {
  return apiClient.post("/auth/login", credentials);
};

export const getMyProfile = () => {
  return apiClient.get("/auth/me");
};

export const getAllCourses = () => {
  return apiClient.get("/courses");
};

export const getCourseById = (courseId) => {
  return apiClient.get(`/courses/${courseId}`);
};

export const getQuestionsByCourse = (courseId) => {
  return apiClient.get(`/courses/${courseId}/questions`);
};

export const submitAnswer = (questionId, answer) => {
    return apiClient.post(`/questions/${questionId}/submit_answer`, { answer });
};

export default apiClient;
