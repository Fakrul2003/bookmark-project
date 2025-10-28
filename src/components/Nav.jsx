// src/components/Nav.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Menu, Sun, Moon, Monitor, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Nav({ 
  searchTerm, setSearchTerm, 
  onAddClick, toggleSidebar, 
  isDarkMode, toggleTheme, 
  isLoggedIn, setIsLoggedIn,
  currentUser, setCurrentUser, onLogout 
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAuth = (path) => {
    setIsProfileOpen(false);
    navigate(path);
  };

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

        <div className="user-profile-container" ref={profileRef}>
          <button 
            className="user-profile-btn" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {currentUser ? (
              <img 
                src={currentUser.profileImage} 
                alt={currentUser.name || 'User'}
                className="profile-avatar-img"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=0d9488&color=fff&size=100`;
                }}
              />
            ) : (
              <User size={29} />
            )}
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar">
                  {currentUser?.profileImage ? (
                    <img src={currentUser.profileImage} alt={currentUser.name} />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div>
                  {currentUser ? (
                    <>
                      <h4>{currentUser.name}</h4>
                      <p>{currentUser.email}</p>
                    </>
                  ) : (
                    <>
                      <h4>Guest User</h4>
                      <p>Not logged in</p>
                    </>
                  )}
                </div>
              </div>

              <div className="profile-menu">
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

                {currentUser ? (
                  <button className="logout-btn" onClick={onLogout}>
                    <span>Logout</span>
                  </button>
                ) : (
                  <div className="auth-buttons">
                    <button className="auth-btn login" onClick={() => handleAuth('/login')}>
                      <LogIn size={16} />
                      <span>Login</span>
                    </button>
                    <button className="auth-btn signup" onClick={() => handleAuth('/signup')}>
                      <UserPlus size={16} />
                      <span>Sign up</span>
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