import React, { useEffect, useState } from 'react';
import './AllScholarships.css';

const AllScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/scholarships/all')
      .then((res) => res.json())
      .then((data) => {
        setScholarships(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching scholarships:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="center-text">Loading scholarships...</p>;

  if (scholarships.length === 0) {
    return <p className="center-text">No scholarships available at the moment.</p>;
  }

  return (
    <div className="list-container">
      <h2>All Scholarships</h2>
      <ul className="scholarship-list">
        {scholarships.map((sch) => (
          <li key={sch._id} className="scholarship-item">
            <div className="scholarship-header">
              <h3>{sch.title}</h3>
              <a href={sch.url} target="_blank" rel="noopener noreferrer" className="apply-button">
                Apply Now
              </a>
            </div>
            <p><strong>Amount:</strong> {sch.amount || 'N/A'}</p>
            <p><strong>Deadline:</strong> {sch.deadline || 'N/A'}</p>
            <p><strong>Required GPA:</strong> {sch.gpa ?? 'Any'}</p>
            <p className="description">{sch.description?.slice(0, 200)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllScholarships;
