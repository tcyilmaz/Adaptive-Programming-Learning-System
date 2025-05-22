import React, { useState, useRef  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import ReCAPTCHA from "react-google-recaptcha";
import './RegisterPage.css';

const RECAPTCHA_SITE_KEY ='6LfN8UQrAAAAAP5dLKmNx8_iME6YHxGp5n8tNIDb';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        setSuccess('');
        setLoading(true);

        if (!recaptchaToken) { 
            setError('Please complete the reCAPTCHA verification.');
            setLoading(false);
            return;
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);

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
         setLoading(true);
        try {
            const userData = {
                username,
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                recaptchaToken: recaptchaToken,
            };
            await register(userData);
            setSuccess('Registration successful! You will be redirected to login page.');
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            console.error("Registration failed:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setRecaptchaToken(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Registeration</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
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
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Registering...' : 'CREATE AN ACCOUNT'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <p className="switch-auth-link">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default RegisterPage;