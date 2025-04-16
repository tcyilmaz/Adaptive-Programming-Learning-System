import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function DashboardPage() {
    const navigate = useNavigate();
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
    }

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div>
            <h2>Dashboard</h2>
            {user ? <p>Welcome, {user.username}!</p> : <p>Welcome!</p>}
            <p>You are logged in.</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default DashboardPage;