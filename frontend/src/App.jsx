import { Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';


const isAuthenticated = () => {
    return !!localStorage.getItem('authToken'); // Check token
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <div>
            <nav>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    {isAuthenticated() && <li><Link to="/dashboard">Dashboard</Link></li>}
                     {/* Add Logout button later */}
                </ul>
            </nav>
            <hr />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                 <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />


                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />


                <Route path="*" element={<div><h2>404 Not Found</h2><Link to="/">Go Home</Link></div>} />
            </Routes>
        </div>
    );
}

export default App;