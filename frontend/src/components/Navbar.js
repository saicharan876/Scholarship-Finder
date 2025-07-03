import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">🎓 ScholarMatch</Link>
      </div>

      <ul className="navbar__links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/all' ? 'active' : ''}>
          <Link to="/all">All Scholarships</Link>
        </li>
        <li className={location.pathname === '/mysch' ? 'active' : ''}>
          <Link to="/mysch">My Scholarships</Link>
        </li>
        {user && (
          <li className={location.pathname === '/profile' ? 'active' : ''}>
            <Link to="/profile">My Profile</Link>
          </li>
        )}
      </ul>

      <div className="navbar__auth">
        {user ? (
          <>
            <span className="navbar__welcome">Hi, {userName}</span>
            <button onClick={handleLogout} className="btn logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn login">Login</Link>
            <Link to="/signup" className="btn signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
