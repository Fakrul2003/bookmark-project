// src/components/Sidebar.jsx
import React from 'react';
import { Bookmark, Home, Archive, X } from 'lucide-react';

function Sidebar({ 
  tags, 
  selectedTags, 
  onTagChange, 
  isOpen, 
  onClose,
  viewMode, 
  setViewMode 
}) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      )}

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
      </nav>

      <div className="tags-section">
        <h3>TAGS</h3>
        {tags.map((tag) => (
          <div key={tag.name} className="tag-item">
            <label>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.name)}
                onChange={() => onTagChange(tag.name)}
              />
              <span className="tag-name">{tag.name}</span>
            </label>
            <span className="tag-count">{tag.count}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;