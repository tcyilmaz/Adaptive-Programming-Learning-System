// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import './RegisterPage.css';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState(''); // YENİ: first_name için state
    const [lastName, setLastName] = useState('');   // YENİ: last_name için state
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Parola kontrolleri
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password); // Özel karakter listesi güncellendi

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
        // İsim ve soyisim için de basit bir kontrol eklenebilir (opsiyonel)
        // if (!firstName.trim() || !lastName.trim()) {
        //     setError('Please enter your first and last name.');
        //     setLoading(false);
        //     return;
        // }

        try {
            // API'ye gönderilecek veri objesi
            const userData = {
                username,
                email,
                password,
                first_name: firstName, // first_name gönderiliyor
                last_name: lastName    // last_name gönderiliyor
            };
            await register(userData);
            setSuccess('Registration successful! You will be redirected to login page.');
            setTimeout(() => navigate('/login'), 2500); // Yönlendirme süresi biraz artırıldı
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
                    <label htmlFor="firstName">First Name</label> {/* YENİ ALAN */}
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        // required // İsteğe bağlı olarak zorunlu yapılabilir
                        placeholder="Enter your first name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label> {/* YENİ ALAN */}
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        // required // İsteğe bağlı olarak zorunlu yapılabilir
                        placeholder="Enter your last name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label> {/* "Name" yerine "Username" daha doğru */}
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
                <button type="submit" className="submit-button" disabled={loading}> {/* submit-button class'ı eklendi (CSS için) */}
                    {loading ? 'Registering...' : 'CREATE AN ACCOUNT'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>} {/* Hata mesajı için class eklendi */}
            {success && <p className="success-message">{success}</p>} {/* Başarı mesajı için class eklendi */}

            <p className="switch-auth-link">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default RegisterPage;