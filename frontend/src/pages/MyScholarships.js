import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './MyScholarships.css';
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';

const MyScholarships = () => {
  const { token, loading } = useAuth();
  const [scholarships, setScholarships] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!token) {
      console.warn('No token found, skipping scholarship fetch.');
      setFetching(false);
      return;
    }

    const fetchMyScholarships = async () => {
      try {
        const res = await axios.get('http://localhost:5000/scholarships/myschl', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setScholarships(res.data);
      } catch (err) {
        console.error('Failed to fetch scholarships', err);
      } finally {
        setFetching(false);
      }
    };

    fetchMyScholarships();
  }, [token, loading]);

  if (loading || fetching) return <p className="loading-text">🎓 Loading your scholarships...</p>;

  return (
    <div className="my-sch-container">
      <h2>Scholarships for You</h2>
      {scholarships.length === 0 ? (
        <p className="no-data">🚫 No scholarships matched your profile yet. Keep your profile updated!</p>
      ) : (
        <div className="scholarship-cards">
          {scholarships.map((sch) => (
            <div className="card" key={sch._id}>
              <h3 className="card-title">{sch.title}</h3>
              <div className="card-detail"><FaCalendarAlt /> Deadline: <span>{sch.deadline || 'N/A'}</span></div>
              <div className="card-detail"><FaGraduationCap /> GPA Required: <span>{sch.gpa ?? 'Any'}</span></div>
              <div className="card-detail"><FaMoneyBillWave /> Amount: <span>{sch.amount || 'N/A'}</span></div>
              <div className="card-detail"><FaMapMarkerAlt /> Location: <span>{sch.location || 'Flexible'}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyScholarships;
