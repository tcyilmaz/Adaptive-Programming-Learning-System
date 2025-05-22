import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyProfile } from "../services/api";
import "./DashboardPage.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await getMyProfile();
        setUser(response.data.user || response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to fetch user data.");
        setLoading(false);
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {user ? (
        <h1>Welcome, {user.username || user.name || "user"}</h1>
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
      </div>
    </div>
  );
}

export default DashboardPage;
