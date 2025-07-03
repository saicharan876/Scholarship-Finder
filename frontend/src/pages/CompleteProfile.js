import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Signup.css';
import { useAuth } from '../context/AuthContext';



const CompleteProfile = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [location, setLocation] = useState('');
  const [gpa, setGpa] = useState('');
  const [course, setCourse] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const locationOptions = [
    "Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas",
    "Armed Forces Americas", "Armed Forces Europe", "Armed Forces Pacific",
    "California", "Colorado", "Connecticut", "Delaware",
    "Federated States of Micronesia", "Florida", "Georgia", "Guam",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Marshall Islands",
    "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
    "Northern Mariana Islands", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Puerto Rico", "Rhode Island",
    "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
    "Vermont", "Virgin Islands, U.S.", "Virginia",
    "Washington", "Washington DC", "West Virginia", "Wisconsin", "Wyoming"
  ];

  useEffect(() => {
    const email = localStorage.getItem('signupEmail');
    if (!email) {
      navigate('/signup');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

      let gpaValue;
      if (gpa === "Below 1") {
        gpaValue = 0.5; 
      } else {
        gpaValue = parseFloat(gpa.split('-')[0]);
      }

    const token = localStorage.getItem('token');

    if (!location || !gpa || !course || !amount) {
      setError('Please fill all required fields.');
      return;
    }

    if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4) {
      setError('Please enter a valid GPA between 0 and 4');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ location, gpa: gpaValue, course, amount}),
      });

        const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('signupEmail');
        login(token);
        navigate('/');
      } else {
        setError(data.message || 'Profile update failed.');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Something went wrong. Please try again.');
    }
  };


  return (
    <div className="login-container">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course of Study</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)} required>
            <option value="">Select course</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Medicine">Medicine</option>
            <option value="Business">Business</option>
            <option value="Arts">Arts</option>
          </select>
        </div>

        <div className="form-group">
          <label>GPA (out of 4)</label>
          <input
            type="number"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            min="0"
            max="4"
            step="0.1"
            placeholder="Enter your exact GPA"
            required
          />
          <small className="input-hint">Scale of 4.0</small>
        </div>

        <div className="form-group">
          <label>Expected Scholarship Amount(USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            placeholder="Please enter expected amount"
            required
          />
          <small className="input-hint"></small>
        </div>

        <div className="form-group">
          <label>Location</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select your location</option>
            {locationOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-btn">Submit</button>
      </form>
    </div>
  );
};

export default CompleteProfile;



  

    

      

  