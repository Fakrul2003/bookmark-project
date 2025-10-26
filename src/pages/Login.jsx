import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import './Auth.css';

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser && savedUser.email === form.email && savedUser.password === form.password) {
      localStorage.setItem('loggedInUser', savedUser.email);
      setIsLoggedIn(true);
      navigate('/');
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo">🔖 Bookmark Manager</h1>
        <h2>Welcome back</h2>
        <p>Log in to continue saving and managing your favorite links.</p>

        <form onSubmit={handleLogin}>
          <label>Email address *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label>Password *</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit" className="auth-btn">Log in</button>
        </form>

        <p className="auth-footer">
          Don’t have an account?{' '}
          <span onClick={() => navigate('/signup')} className="link">Create one</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
