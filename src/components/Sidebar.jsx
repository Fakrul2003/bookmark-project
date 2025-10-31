// src/components/Sidebar.jsx
import React from 'react';
import { Bookmark, Home, Archive, X } from 'lucide-react';

function Sidebar({ 
  tags = [], 
  bookmarks = [], 
  selectedTags = [], 
  onTagChange = () => {}, 
  isOpen = false, 
  onClose = () => {},
  viewMode = 'all', 
  setViewMode = () => {} 
}) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      )}

      {/* === ফিক্সড হেডার === */}
      <div className="sidebar-header">
        <nav className="sidebar-nav">
          <div className="nav-brand">
            <Bookmark className="brand-icon" size={20} />
            <h1>Bookmark Manager</h1>
          </div>

          <div 
            className={`nav-item ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
            style={{ cursor: 'pointer' }}
          >
            <Home size={18} />
            <span>Home</span>
          </div>

          <div 
            className={`nav-item ${viewMode === 'archived' ? 'active' : ''}`}
            onClick={() => setViewMode('archived')}
            style={{ cursor: 'pointer' }}
          >
            <Archive size={18} />
            <span>Archived</span>
            
           
          </div>
           <h3>TAGS</h3>
        </nav>
      </div>

      {/* === স্ক্রলযোগ্য ট্যাগ লিস্ট === */}
      <div className="tags-section-wrapper">
        <div className="tags-section">
          

          {tags.length === 0 && (
            <p style={{ padding: '0 20px', color: '#6b7280' }}>No tags yet.</p>
          )}

          {tags.map((tag, index) => {
            const orderNumber = index + 1;

            return (
              <div key={tag.name} className="tag-item">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.name)}
                    onChange={() => onTagChange(tag.name)}
                  />
                  <span className="tag-name">{tag.name}</span>
                </label>
                <span className="tag-count">{orderNumber}</span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;