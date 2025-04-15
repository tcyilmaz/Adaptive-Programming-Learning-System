// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { login } from '../services/api';
import './LoginPage.css'; // --- IMPORT THE CSS FILE ---

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await login({ email, password });
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // --- ADD A CONTAINER DIV ---
        <div className="login-container">
            <h2>Log In</h2> {/* Keep the title */}

            {/* --- Display error message --- */}
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                {/* --- Group Label and Input --- */}
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email" // Add placeholder text
                    />
                </div>

                 {/* --- Group Label and Input --- */}
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password" // Add placeholder text
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging In...' : 'LOG IN'}
                </button>
            </form>

             {/* --- Link to Register Page --- */}
            <p className="switch-auth-link">
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default LoginPage;