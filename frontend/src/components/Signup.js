import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setFeedback({ type: 'error', msg: 'Please fill out all fields.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('signupEmail', data.user.email);
        navigate('/complete-profile');
      } else {
        setFeedback({ type: 'error', msg: data.message || 'Signup failed.' });
      }
    } catch (err) {
      console.error('Signup error:', err);
      setFeedback({ type: 'error', msg: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register with us<span> Scholarships</span></h2>

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
          </div>

          {feedback.msg && (
            <div className={`feedback ${feedback.type}`}>
              {feedback.msg}
            </div>
          )}

          <button type="submit" className="login-btn">Sign Up</button>
        </form>

        <p className="signup-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
