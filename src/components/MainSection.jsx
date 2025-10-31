// src/components/MainSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowDownAZ, Check } from 'lucide-react';
import BookmarkCard from './BookmarkCard';

function MainSection({ 
  bookmarks, 
  onEdit, 
  onPin, 
  onArchive, 
  onUnarchive, 
  onDelete, 
  onVisit,
  viewMode 
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recently-added');
  const menuRefs = useRef({});
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      let shouldClose = true;
      Object.values(menuRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target)) shouldClose = false;
      });
      if (sortRef.current && sortRef.current.contains(event.target)) shouldClose = false;
      if (shouldClose) {
        setOpenMenuId(null);
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = (url) => {
    const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    navigator.clipboard.writeText(finalUrl);
  };

  const getSortedBookmarks = () => {
    let sorted = [...bookmarks];

    switch (sortBy) {
      case 'recently-added':
        sorted.sort((a, b) => b.addTime - a.addTime);
        break;
      case 'recently-visited':
        sorted.sort((a, b) => (b.lastVisitTime || 0) - (a.lastVisitTime || 0));
        break;
      case 'most-visited':
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        break;
    }

    return sorted.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  };

  const sortedBookmarks = getSortedBookmarks();

  const sortOptions = [
    { id: 'recently-added', label: 'Recently added' },
    { id: 'recently-visited', label: 'Recently visited' },
    { id: 'most-visited', label: 'Most visited' },
  ];

  return (
    <main className="main-section">
      <div className="main-header">
        <h2>
          {viewMode === 'archived' ? 'Archived' : 'All'} bookmarks ({bookmarks.length})
        </h2>

        <div className="sort-container" ref={sortRef}>
          <button className="sort-btn" onClick={() => setIsSortOpen(!isSortOpen)}>
            <ArrowDownAZ size={18} />
            Sort by
          </button>

          {isSortOpen && (
            <div className="sort-dropdown">
              {sortOptions.map(option => (
                <button
                  key={option.id}
                  className={`sort-option ${sortBy === option.id ? 'active' : ''}`}
                  onClick={() => {
                    setSortBy(option.id);
                    setIsSortOpen(false);
                  }}
                >
                  {option.label}
                  {sortBy === option.id && <Check size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bookmark-grid">
        {sortedBookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            isMenuOpen={openMenuId === bookmark.id}
            onToggleMenu={() => setOpenMenuId(openMenuId === bookmark.id ? null : bookmark.id)}
            menuRef={(el) => (menuRefs.current[bookmark.id] = el)}
            onVisit={onVisit}
            onCopy={handleCopy}
            onPin={onPin}
            onEdit={onEdit}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
            onDelete={onDelete}
            isArchivedView={viewMode === 'archived'}
          />
        ))}
        {bookmarks.length === 0 && (
          <p className="no-results">No bookmarks found.</p>
        )}
      </div>
    </main>
  );
}

export default MainSection;