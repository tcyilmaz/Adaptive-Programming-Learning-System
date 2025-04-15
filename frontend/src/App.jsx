// frontend/src/App.jsx
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // Create this simple page
import './App.css';

// Helper to check if user is authenticated
const isAuthenticated = () => {
    return !!localStorage.getItem('authToken'); // Check if token exists
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This is useful if they are redirected from a deep link.
        return <Navigate to="/login" replace />;
    }
    return children;
};


function App() {
    // Basic layout, add Navbar later
    return (
        <div>
            <nav> {/* Very basic navigation */}
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    {isAuthenticated() && <li><Link to="/dashboard">Dashboard</Link></li>}
                     {/* Add Logout button later */}
                </ul>
            </nav>
            <hr />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                 {/* Redirect root path */}
                 <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />


                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                {/* Add other routes here */}

                 {/* Catch-all or 404 Not Found Route */}
                <Route path="*" element={<div><h2>404 Not Found</h2><Link to="/">Go Home</Link></div>} />
            </Routes>
        </div>
    );
}

export default App;