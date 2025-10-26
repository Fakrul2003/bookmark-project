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
  viewMode 
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recently-added'); // default
  const menuRefs = useRef({});
  const sortRef = useRef(null);

  // বাইরে ক্লিকে মেনু বন্ধ
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

  const handleVisit = (bookmark) => {
    const url = /^https?:\/\//i.test(bookmark.url) ? bookmark.url : `https://${bookmark.url}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = (url) => {
    const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    navigator.clipboard.writeText(finalUrl)
      .then(() => alert('URL copied to clipboard!'))
      .catch(() => alert('Failed to copy URL'));
  };

  // সর্টিং লজিক
  const getSortedBookmarks = () => {
    let sorted = [...bookmarks];

    switch (sortBy) {
      case 'recently-added':
        sorted.sort((a, b) => b.addTime - a.addTime);
        break;
      case 'recently-visited':
        // ধরে নিচ্ছি lastVisited আছে (যদি না থাকে, fallback)
        sorted.sort((a, b) => {
          const timeA = a.lastVisited || 0;
          const timeB = b.lastVisited || 0;
          return timeB - timeA;
        });
        break;
      case 'most-visited':
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        break;
    }

    // Pin উপরে
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

        {/* সর্ট বাটন + ড্রপডাউন */}
        <div className="sort-container" ref={sortRef}>
          <button 
            className="sort-btn" 
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
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
            onVisit={handleVisit}
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