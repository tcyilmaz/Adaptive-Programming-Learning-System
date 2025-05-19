// frontend/src/App.jsx
import React from "react"; // React importu gerekli olabilir
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
import CoursesListPage from "./pages/CoursesListPage"; // Eğer oluşturduysanız
import ProfilePage from "./pages/ProfilePage"; // Eğer oluşturduysanız
import Navbar from "./components/Navbar"; // Navbar'ınız varsa
// Diğer importlar...
import "./App.css";

// Helper to check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem("authToken"); // Check if token exists
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This is useful if they are redirected from a deep link.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// Layout component that includes Navbar
// Bu, Navbar'ı her sayfada göstermek için kullanışlı bir yöntem
const LayoutWithNavbar = () => {
  return (
    <>
      <Navbar /> {/* Navbar'ı burada çağırın */}
      <main className="main-content">
        {" "}
        {/* Ana içeriği sarmak için */}
        <Outlet /> {/* <Route> içindeki element burada render edilecek */}
      </main>
    </>
  );
};

function App() {
  console.log(
    "App component rendering/rerendering. Current location:",
    window.location.pathname
  ); // Rota kontrolü için log
  return (
    <>
      {" "}
      {/* <BrowserRouter> main.jsx içinde olmalı */}
      {/* Navbar'ı her sayfada göstermek yerine LayoutWithNavbar kullanabiliriz */}
      {/* <Navbar /> // Bu satırı kaldırıp LayoutWithNavbar'ı kullanacağız */}
      <Routes>
        {/* Public Routes - Navbar'sız olabilir veya farklı bir layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Routes with Navbar */}
        <Route element={<LayoutWithNavbar />}>
          {" "}
          {/* Navbar'lı layout'u saran route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses" // Tüm kursları listeleme sayfası
            element={
              <ProtectedRoute>
                <CoursesListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile" // Kullanıcı profili sayfası
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          {/* Diğer Navbar'lı ve korumalı rotalar buraya eklenebilir */}
          {/* Örneğin: <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} /> */}
          {/* Kök yol için yönlendirme */}
          {/* Bu, Navbar'lı layout içinde olmalı ki Navbar görünsün */}
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
        </Route>{" "}
        {/* LayoutWithNavbar kapanışı */}
        {/* Catch-all veya 404 Not Found Route */}
        {/* Bu, herhangi bir layout dışında veya kendi basit layout'u içinde olabilir */}
        <Route
          path="*"
          element={
            <div>
              <Navbar /> {/* 404'te de Navbar görünsün istenirse */}
              <h2>404 Sayfa Bulunamadı</h2>
              <Link to="/">Ana Sayfaya Dön</Link>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
