import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-heading">Welcome to Scholarship Finder</h1>
      <p className="home-subtext">
        Discover scholarships that match your profile. Filter by GPA, course, location, and more.
      </p>
      <button className="home-button" onClick={() => navigate('/all')}>
        Explore Scholarships
      </button>
    </div>
  );
};

export default Home;
