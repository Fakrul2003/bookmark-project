// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn, setCurrentUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();

    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const matchedUser = allUsers.find(
      (user) => user.email === form.email.trim() && user.password === form.password
    );

    if (matchedUser) {
      localStorage.setItem('currentUser', JSON.stringify(matchedUser));
      setCurrentUser(matchedUser);
      setIsLoggedIn(true);
      alert(`Welcome back, ${matchedUser.name}!`);
      navigate('/');
    } else {
      alert('Invalid email or password!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo">Bookmark Manager</h1>
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
