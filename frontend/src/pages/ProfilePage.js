import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
     console.log("Token being used:", token); 
     if (!token) return;

    setLoading(true);
    axios
      .get("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
         setUserData(res.data.user);
        setError("");
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="loading">Loading your profile...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-container">
      <ul className="profile-list">
        {[
          { label: "Name", value: userData.name },
          { label: "Email", value: userData.email },
          { label: "GPA", value: userData.gpa || "N/A" },
          { label: "Expected Amount", value: `$${userData.amount || "N/A"}` },
          { label: "Location", value: userData.location || "N/A" },
          { label: "Course of Study", value: userData.course || "N/A" },
        ].map(({ label, value }) => (
          <li key={label}>
            <strong>{label}:</strong>
            <span>{value}</span>
          </li>
        ))}
      </ul>

      <Link to="/mysch" className="btn btn-primary">
        View My Scholarships
      </Link>
    </div>
  );
};

export default ProfilePage;
