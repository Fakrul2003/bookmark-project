// src/components/MainSection.jsx
import React from 'react';
import { ArrowDownAZ } from 'lucide-react';
import BookmarkCard from './BookmarkCard';

function MainSection({ bookmarks }) {
  return (
    <main className="main-section">
      <div className="main-header">
        <h2>All bookmarks ({bookmarks.length})</h2>
        <button className="sort-btn">
          <ArrowDownAZ size={18} />
          Sort by
        </button>
      </div>

      {/* Bookmark Grid */}
      <div className="bookmark-grid">
        {bookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
        {bookmarks.length === 0 && <p className="no-results">No bookmarks found matching the filters.</p>}
      </div>
    </main>
  );
}

export default MainSection;