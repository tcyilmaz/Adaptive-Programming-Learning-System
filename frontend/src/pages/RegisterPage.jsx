import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { register } from '../services/api';
import './RegisterPage.css';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-={};':"|,.<>?]+/.test(password);

        if (password.length < 8) {
             setError('Password must be at least 8 characters long.');
             setLoading(false);
             return;
        }

        if (!hasUppercase || !hasLowercase || !hasSpecialChar) {
            setError('Password must contain at least one uppercase letter, one lowercase letter, and one special character.');
            setLoading(false);
            return;
        }



        try {
            await register({ username, email, password });
            setSuccess('Registration successful! You can now log in.');
             setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            console.error("Registration failed:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Registeration</h2>


            <form onSubmit={handleSubmit}>
                 <div className="form-group">
                    <label htmlFor="username">Name</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your Password"
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'CREATE AN ACCOUNT'}
                </button>
            </form>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <p className="switch-auth-link">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default RegisterPage;