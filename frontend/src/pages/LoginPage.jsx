import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import ReCAPTCHA from "react-google-recaptcha";

import './LoginPage.css';

const RECAPTCHA_SITE_KEY ='6LfN8UQrAAAAAP5dLKmNx8_iME6YHxGp5n8tNIDb';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const navigate = useNavigate();
    const recaptchaRef = useRef();

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!recaptchaToken) { 
            setError('Please complete the reCAPTCHA verification.');
            return;
        }

        setLoading(true);

        try {
            const credentials = {
                email,
                password,
                recaptchaToken: recaptchaToken
            };
            const response = await login( credentials );
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Login failed. Please check email/password.');
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setRecaptchaToken(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Log In</h2>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
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
                        placeholder="Enter your password"
                    />
                </div>
                     {RECAPTCHA_SITE_KEY ? (
                    <div className="form-group recaptcha-container">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={handleRecaptchaChange}
                            onExpired={() => {
                                console.log("reCAPTCHA expired");
                                setRecaptchaToken(null);
                            }}
                            onError={() => {
                                console.error("reCAPTCHA error");
                                setError("reCAPTCHA could not be loaded. Please try again.");
                                setRecaptchaToken(null);
                            }}
                        />
                    </div>
                ) : (
                    <p className="error-message">reCAPTCHA site key is missing. Registration is disabled.</p>
                )}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging In...' : 'LOG IN'}
                </button>
            </form>

            <p className="switch-auth-link">
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default LoginPage;