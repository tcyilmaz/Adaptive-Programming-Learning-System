// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

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

        // Basic frontend validation (add more as needed)
        if (password.length < 6) { // Example minimum length
             setError('Password must be at least 6 characters long.');
             setLoading(false);
             return;
        }

        try {
            await register({ username, email, password });
            setSuccess('Registration successful! You can now log in.');
            // Optionally redirect to login after a delay or provide a link
             setTimeout(() => navigate('/login'), 2000); // Redirect after 2s

        } catch (err) {
            console.error("Registration failed:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Registeration</h2> {/* Match mockup */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                 <div>
                    <label htmlFor="username">Name</label> {/* Match mockup */}
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'CREATE AN ACCOUNT'} {/* Match mockup */}
                </button>
                 {/* Add link to Login page */}
            </form>
        </div>
    );
}

export default RegisterPage;