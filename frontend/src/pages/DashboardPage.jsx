// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './DashboardPage.css'; // Dashboard için CSS dosyası oluşturalım
import { getMyProfile } from '../services/api';

function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // Kullanıcı bilgilerini tutacak state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Token'ı localStorage'dan alıyoruz (apiClient interceptor'ı zaten kullanacak)
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/login'); // Token yoksa login'e yönlendir
                    return;
                }

                // Kullanıcının kendi bilgilerini çekmek için /api/users/me (veya /api/auth/me)
                // Bu endpoint'i backend'de oluşturduğunuzu varsayıyorum.
                // Adı /api/auth/profile veya benzeri de olabilir.
                const response = await getMyProfile(); // Güncellenmiş çağrı
                setUser(response.data.user || response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setError('Kullanıcı bilgileri yüklenemedi.');
                setLoading(false);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    // Token geçersiz veya süresi dolmuşsa logout yap ve login'e yönlendir
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user'); // Eski kullanıcı verisini de temizle
                    navigate('/login');
                }
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user'); // Genel user bilgisini de temizleyebiliriz
        navigate('/login');
    };

    if (loading) {
        return <div className="dashboard-container"><p>Yükleniyor...</p></div>;
    }

    if (error) {
        return <div className="dashboard-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="dashboard-container">
            {user ? (
                <h1>Welcome, {user.username || user.name || 'user'}</h1>
            ) : (
                <h1>Dashboard</h1>
            )}

            <p>Ready to continue learning?</p>

            <div className="dashboard-actions">
                <Link to="/courses" className="dashboard-button">
                    My Courses
                </Link>
                <Link to="/profile" className="dashboard-button">
                    My Profile
                </Link>
                {/* İleride buraya kullanıcının son çalıştığı kursa devam et butonu eklenebilir */}
            </div>

            <button onClick={handleLogout} className="logout-button">
                Log Out
            </button>
        </div>
    );
}

export default DashboardPage;