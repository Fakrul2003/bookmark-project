// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup({ setIsLoggedIn, setCurrentUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', profileImage: '' });
  const [imagePreview, setImagePreview] = useState(null);

  // 🖼️ ইউজার ইমেজ আপলোড হ্যান্ডলিং
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profileImage: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🧩 ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      alert('All fields are required!');
      return;
    }

    // নতুন ইউজার ডাটা তৈরি
    const userData = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      profileImage:
        form.profileImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=0d9488&color=fff&size=100`,
    };

    // ✅ সব ইউজারদের অ্যারে হিসেবে সংরক্ষণ (মাল্টিপল ইউজার সাপোর্ট)
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    allUsers.push(userData);
    localStorage.setItem('users', JSON.stringify(allUsers));

    // কারেন্ট ইউজার সেট করা
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentUser(userData);
    setIsLoggedIn(true);

    alert('Account created successfully!');
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo">Bookmark Manager</h1>
        <h2>Create your account</h2>
        <p>Join us and start saving your favorite links — organized and searchable.</p>

        <form onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="image-upload">
            <label htmlFor="image" className="image-label">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span>Upload Photo</span>
                </div>
              )}
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

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
