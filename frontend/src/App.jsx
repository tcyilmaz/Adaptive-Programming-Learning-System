// frontend/src/App.jsx
import React from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CoursesListPage from "./pages/CoursesListPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import CourseDetailPage from "./pages/CourseDetailPage";
import QuestionPage from "./pages/QuestionPage"; // QuestionPage importunu ekledim
import "./App.css";

const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  // console.log("isAuthenticated check, token:", token); // Test için
  return !!token;
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const LayoutWithNavbar = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

function App() {
  // console.log("App rendering. Current location:", window.location.pathname);
  return (
    <>
      <Routes>
        {/* Public Routes (Navbar'sız) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Kök yol yönlendirmesi (Navbar'sız yönlendirme) */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Routes with Navbar */}
        <Route element={<LayoutWithNavbar />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses" // Sadece bir tane /courses rotası
            element={
              <ProtectedRoute>
                <CoursesListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute>
                <CourseDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/play" // Soru sayfası için rota
            element={
              <ProtectedRoute>
                <QuestionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          {/* Eğer başka Navbar'lı sayfalar varsa buraya eklenebilir */}
          {/* Örneğin /settings vb. */}
        </Route>

        {/* Catch-all 404 Route (Navbar'lı veya Navbar'sız olabilir, tercihinize göre) */}
        {/* Örnek: Navbar'lı 404 */}
        <Route
          path="*"
          element={
            <LayoutWithNavbar>
              {" "}
              {/* 404'ü de layout içine alabiliriz */}
              <div style={{ textAlign: "center", paddingTop: "50px" }}>
                <h2>404 Sayfa Bulunamadı</h2>
                <Link to="/">Ana Sayfaya Dön</Link>
              </div>
            </LayoutWithNavbar>
          }
        />
        {/* Veya Navbar'sız 404:
        <Route path="*" element={
            <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                <h2>404 Sayfa Bulunamadı</h2>
                <Link to="/">Ana Sayfaya Dön</Link>
            </div>
        } />
        */}
      </Routes>
    </>
  );
}

export default App;
