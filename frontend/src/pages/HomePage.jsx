import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
    const isAuthenticated = !!localStorage.getItem('authToken');

    return (
        <div className="homepage-container">
            <header className="homepage-header">
                <h1>Welcome Back</h1>
            </header>

            <section className="homepage-cta">
                {isAuthenticated ? (
                    <>
                        <p>Continue where you left from</p>
                        <Link to="/dashboard" className="cta-button">Go to Dashboard</Link>
                    </>
                ) : (
                    <>
                        <p>Get started</p>
                        <div>
                            <Link to="/register" className="cta-button register">Register</Link>
                            <Link to="/login" className="cta-button login">Login</Link>
                        </div>
                    </>
                )}
            </section>

            <section className="homepage-features">
                <h2>About</h2>
                <ul>
                    <li>Adaptive Learning based on Spaced Repetition</li>
                </ul>
            </section>
        </div>
    );
}

export default HomePage;