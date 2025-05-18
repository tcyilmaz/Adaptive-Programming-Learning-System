// frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { Link } from 'react-router-dom'; // If you need links
import './ProfilePage.css'; // We'll create this for styling

function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await apiClient.get('/users/profile'); // Your backend endpoint
                setProfileData(response.data);
            } catch (err) {
                console.error("Failed to fetch profile data:", err.response?.data || err.message);
                setError('Could not load your profile. Please try again later.');
                // Handle specific errors like 401 for token expiry if needed
                // if (err.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []); // Empty dependency array to run once on mount

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading Profile...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>;
    }

    if (!profileData) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>No profile data found.</div>;
    }

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    // Mockup 3 shows "Days Streak" and "HTML/JS" progress bars.
    // We don't have streak or per-language progress data from the backend yet.
    // We'll add placeholders for now and can implement fetching/displaying that later.
    const daysStreak = 0; // Placeholder
    const points = profileData.points || 0; // Use points from profileData

    const htmlProgress = { current: 0, total: 0 }; // Placeholder, e.g. { current: 70, total: 100 }
    const jsProgress = { current: 0, total: 0 };   // Placeholder, e.g. { current: 10, total: 250 }


    return (
        <div className="profile-page-container">
            <div className="profile-header">
                <h2>{profileData.username}'s Profile</h2>
            </div>

            <div className="profile-content">
                <section className="profile-details-card">
                    <h3>Account Details</h3>
                    <p><strong>Email:</strong> {profileData.email}</p>
                    <p><strong>Joined:</strong> {formatDate(profileData.created_at)}</p>
                    {/* Add other details here as they become available */}
                </section>

                <section className="profile-stats-card">
                    <h3>Your Stats</h3>
                    <div className="stat-item">
                        <span className="stat-label">Total Points</span>
                        <span className="stat-value points">{points}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Days Streak</span>
                        <span className="stat-value streak">{daysStreak} 🔥</span> {/* Placeholder */}
                    </div>
                    {/* More stats like "Questions Answered", "Courses Completed" can go here later */}
                </section>

                <section className="profile-progress-card">
                    <h3>Learning Progress</h3>
                    {/* HTML Progress Bar - Placeholder */}
                    <div className="progress-item">
                        <div className="progress-item-header">
                            <span className="language-name">HTML</span>
                            <span className="progress-text">{htmlProgress.current}/{htmlProgress.total}</span>
                        </div>
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar"
                                style={{ width: `${htmlProgress.total > 0 ? (htmlProgress.current / htmlProgress.total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* JavaScript Progress Bar - Placeholder */}
                    <div className="progress-item">
                        <div className="progress-item-header">
                            <span className="language-name">JavaScript</span>
                            <span className="progress-text">{jsProgress.current}/{jsProgress.total}</span>
                        </div>
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar js" // Add a class for different color
                                style={{ width: `${jsProgress.total > 0 ? (jsProgress.current / jsProgress.total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                    {/* Add more languages as needed */}
                </section>
            </div>
        </div>
    );
}

export default ProfilePage;