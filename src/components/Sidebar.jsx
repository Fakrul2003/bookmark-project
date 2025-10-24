import React from 'react';
import { Bookmark, Home, Archive, X } from 'lucide-react'; // X আইকন যোগ করা হয়েছে

function Sidebar({ tags, selectedTags, onTagChange, isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
     
             {/* Close Button (only visible on mobile when open) */}
        {isOpen && (
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      )}
      {/* Primary Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-brand">
          <Bookmark className="brand-icon" size={20} />
          <h1>Bookmark Manager</h1>
        </div>

        <div className="nav-item active">
          <Home size={18} />
          <span>Home</span>
        </div>
        <div className="nav-item">
          <Archive size={18} />
          <span>Archived</span>
        </div>
      </nav>

      {/* Tags Section with Checkboxes */}
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