import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Login from './components/Login';
import Signup from './components/Signup';
import CompleteProfile from './pages/CompleteProfile';
import Home from './pages/Home';
import AllScholarships from './pages/AllScholarships';
import ProfilePage from './pages/ProfilePage';
import MyScholarships from './pages/MyScholarships';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const hideNavbar = ['/login', '/signup', '/complete-profile'].includes(pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

const PrivateRoutes = () => (
  <>
    <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
    <Route path="/all" element={<PrivateRoute><AllScholarships /></PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
    <Route path="/mysch" element={<PrivateRoute><MyScholarships /></PrivateRoute>} />
  </>
);

const AppRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      {PrivateRoutes()}
      <Route path="*" element={<h2>404 - Page Not Found</h2>} />
    </Routes>
  </Layout>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
