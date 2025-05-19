// frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../services/api"; // api.js dosyamız
import "./ProfilePage.css"; // Profil sayfası için CSS dosyası

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // İleride düzenleme modu için state'ler eklenebilir
  // const [isEditing, setIsEditing] = useState(false);
  // const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getMyProfile(); // veya /users/me
        console.log("API Response Data:", response.data);
        setProfile(response.data.user); // Backend'den dönen yanıta göre
        // setFormData(response.data.user); // Düzenleme için başlangıç verisi
      } catch (err) {
        setError("Failed to fetch profile.");
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // İleride profil güncelleme fonksiyonu eklenecek
  // const handleInputChange = (e) => { /* ... */ };
  // const handleSubmit = async (e) => { /* ... */ };

  if (loading) {
    return (
      <div className="profile-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <p>No profile information available.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-details">
        <div className="profile-item">
          <span className="profile-label">Username:</span>
          <span className="profile-value">{profile.username}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">E-mail:</span>
          <span className="profile-value">{profile.email}</span>
        </div>
        {profile.first_name && (
          <div className="profile-item">
            <span className="profile-label">Name:</span>
            <span className="profile-value">{profile.first_name}</span>
          </div>
        )}
        {profile.last_name && (
          <div className="profile-item">
            <span className="profile-label">Last Name:</span>
            <span className="profile-value">{profile.last_name}</span>
          </div>
        )}
        <div className="profile-item">
          <span className="profile-label">Date Account Created:</span>
          <span className="profile-value">
            {new Date(profile.created_at).toLocaleDateString()}
          </span>
        </div>
        {/* SDD'deki diğer alanları buraya ekleyebilirsiniz */}
      </div>

      {/* İleride Düzenleme Butonu ve Formu
            <button onClick={() => setIsEditing(!isEditing)} className="edit-profile-button">
                {isEditing ? 'Vazgeç' : 'Profili Düzenle'}
            </button>

            {isEditing && (
                <form onSubmit={handleSubmit} className="profile-edit-form">
                    // Form inputları buraya gelecek
                    <button type="submit">Değişiklikleri Kaydet</button>
                </form>
            )}
            */}
    </div>
  );
}

export default ProfilePage;
