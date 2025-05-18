// frontend/src/App.jsx
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LearningPage from './pages/LearningPage';
import './App.css';

const isAuthenticated = () => !!localStorage.getItem('authToken');

const ProtectedRoute = ({ children }) => {
    let location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};


function App() {
    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/learn/:courseId" element={<LearningPage />} />
                    </Route>
                    <Route path="*" element={<div><h2>404 Not Found</h2><Link to="/">Go Home</Link></div>} />
                </Routes>
            </main>
        </div>
    );
}
export default App;