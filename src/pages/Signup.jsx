import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import './Auth.css';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(form));
    alert('Account created successfully!');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo">🔖 Bookmark Manager</h1>
        <h2>Create your account</h2>
        <p>Join us and start saving your favorite links — organized and searchable.</p>

        <form onSubmit={handleSubmit}>
          <label>Full name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

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

          <button type="submit" className="auth-btn">Create account</button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="link">Log in</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
