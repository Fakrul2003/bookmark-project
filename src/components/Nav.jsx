import React from 'react';
import { Bookmark, Search, User, Menu } from 'lucide-react';

function Nav({ searchTerm, setSearchTerm, onAddClick, toggleSidebar }) { // toggleSidebar প্রপস রিসিভ করা হয়েছে
  return (
    <header className="nav-bar">
      {/* নতুন মেনু আইকন */}
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

      <button className="add-bookmark-btn" onClick={onAddClick}>
        + Add Bookmark
      </button>

      <div className="user-profile">
        <User size={29} />
      </div>
    </header>
  );
}

export default Nav;