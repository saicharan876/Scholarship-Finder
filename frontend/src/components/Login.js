import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setFeedback({ type: 'error', msg: 'Please enter both email and password.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        setFeedback({ type: 'success', msg: 'Login successful! Redirecting...' });
        setTimeout(() => navigate('/'), 1500);
      } else {
        setFeedback({ type: 'error', msg: data.message || 'Login failed.' });
      }
    } catch (err) {
      console.error('Login error:', err);
      setFeedback({ type: 'error', msg: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to Search Your 
          <span> Dream Scholarship</span>
          </h2>

        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {feedback.msg && (
            <div className={`feedback ${feedback.type}`}>
              {feedback.msg}
            </div>
          )}

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="signup-text">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
