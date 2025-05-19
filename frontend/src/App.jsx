import { Routes, Route, Link, Navigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import './App.css';

const isAuthenticated = () => {
    console.log("App.jsx: isAuthenticated called. Token:", localStorage.getItem('authToken'));
    return !!localStorage.getItem('authToken');
};

const ProtectedRoute = () => { // Removed 'children' prop as it's not used this way
    console.log("App.jsx: ProtectedRoute rendering/checking");
    let location = useLocation();

    if (!isAuthenticated()) {
        console.log("App.jsx: ProtectedRoute - User NOT authenticated, redirecting to /login from", location.pathname);
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log("App.jsx: ProtectedRoute - User IS authenticated, rendering Outlet for path:", location.pathname);
    return <Outlet />; // <<< --- THIS IS THE CRITICAL CHANGE ---
                       // Outlet is where the matched child route (e.g., DashboardPage) will be rendered.
};

function App() {
    console.log("App.jsx: App component rendering/rerendering"); // Log App component execution
    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content">
                <Routes>
                    {/* ... routes ... */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>
                    {/* ... routes ... */}
                </Routes>
            </main>
        </div>
    );
}
export default App;