// frontend/src/pages/DashboardPage.jsx
import React from 'react'; // Make sure React is imported if using JSX features explicitly
import { useNavigate, Link } from 'react-router-dom'; // Import Link if you add navigation links

function DashboardPage() {
    const navigate = useNavigate();
    // Attempt to get user info, handle potential null if not logged in properly
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        // Optionally handle this error, maybe redirect to login
    }

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <div>
            <h2>Dashboard</h2>
            {/* Conditionally render welcome message */}
            {user ? <p>Welcome, {user.username}!</p> : <p>Welcome!</p>}
            <p>You are logged in.</p>
            <button onClick={handleLogout}>Logout</button>
            {/* Add profile links, learning content access here */}
            {/* Example Link: <Link to="/profile">My Profile</Link> */}
        </div>
    );
}

export default DashboardPage;