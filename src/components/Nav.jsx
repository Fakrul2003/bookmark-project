// src/components/Nav.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Menu, Sun, Moon, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Nav({ 
  searchTerm, 
  setSearchTerm, 
  onAddClick, 
  toggleSidebar,
  isDarkMode,
  toggleTheme,
  isLoggedIn,
  setIsLoggedIn
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    navigate('/login');
  };

  const handleLogin = () => navigate('/login');
  const handleSignup = () => navigate('/signup');

  return (
    <header className="nav-bar">
      <button className="menu-toggle-btn" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      
      <div className="nav-search">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="m-nav-r">
        <button className="add-bookmark-btn" onClick={onAddClick}>
          + Add Bookmark
        </button>

        {/* প্রোফাইল + থিম টগল */}
        <div className="user-profile-container" ref={profileRef}>
          <button 
            className="user-profile-btn" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <User size={29} />
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar">
                  <User size={40} />
                </div>
                <div>
                  <h4>{isLoggedIn ? 'Emily Carter' : 'Guest User'}</h4>
                  <p>{isLoggedIn ? 'emily101@email.com' : 'Please login to continue'}</p>
                </div>
              </div>

              <div className="profile-menu">
                {/* থিম টগল অংশ সবসময় থাকবে */}
                <button className="theme-toggle-item" onClick={toggleTheme}>
                  <div className="theme-label">
                    <Monitor size={18} />
                    <span>Theme</span>
                  </div>
                  <div className={`theme-switch ${isDarkMode ? 'dark' : ''}`}>
                    <Sun size={16} className="icon sun" />
                    <Moon size={16} className="icon moon" />
                    <div className="slider"></div>
                  </div>
                </button>

                {/* লগইন অবস্থা অনুযায়ী বাটন পরিবর্তন */}
                {isLoggedIn ? (
                  <button className="logout-btn" onClick={handleLogout}>
                    <span>Logout</span>
                  </button>
                ) : (
                  <div className="auth-buttons">
                    <button className="login-btn" onClick={handleLogin}>
                      <span>Login</span>
                    </button>
                    <button className="signup-btn" onClick={handleSignup}>
                      <span>Signup</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Nav;
