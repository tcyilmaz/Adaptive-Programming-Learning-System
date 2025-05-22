import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../services/api";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getMyProfile();
        console.log("API Response Data:", response.data);
        setProfile(response.data.user);
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
        <div className="profile-item">
          <span className="profile-label">First Name:</span>
          <span className="profile-value">{profile.first_name}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Last Name:</span>
          <span className="profile-value">{profile.last_name}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Date Account Created:</span>
          <span className="profile-value">
            {new Date(profile.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
