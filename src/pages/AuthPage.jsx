// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bookmark } from 'lucide-react';

function AuthPage({ onLoginSuccess }) {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        onLoginSuccess(user);
      } else {
        setErrors({ email: 'Invalid email or password' });
      }
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(u => u.email === formData.email)) {
        setErrors({ email: 'Email already exists' });
        return;
      }

      // প্রোফাইল ছবি জেনারেট
      const profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=0d9488&color=fff&size=128&bold=true`;

      const newUser = {
        id: Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        profileImage // এটি যোগ করা হয়েছে
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Bookmark size={32} color="#0d9488" />
          <h1>Bookmark Manager</h1>
        </div>

        <h2>{isLogin ? 'Log in to your account' : 'Create your account'}</h2>
        <p className="auth-subtitle">
          {isLogin 
            ? 'Welcome back! Please enter your details.' 
            : 'Join us and start saving your favorite links – organized, searchable, and always within reach.'
          }
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Full name <span className="required">*</span></label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
          )}

          <div className="form-group">
            <label>Email address <span className="required">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password <span className="required">*</span></label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isLogin ? 'Enter your password' : 'Create a password'}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button 
            type="button" 
            className="auth-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ fullName: '', email: '', password: '' });
              setErrors({});
            }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;