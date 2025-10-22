// src/components/BookmarkCard.jsx
import React from 'react';
import { MoreVertical, Calendar, Bookmark, Globe } from 'lucide-react';

function BookmarkCard({ bookmark }) {
  // এখানে বুকমার্ক ডেটা ব্যবহার করে কার্ড ডিজাইন করা হয়েছে
  const dateAdded = "20 Feb"; // উদাহরণস্বরূপ 
  const lastVisited = "23 Sep"; // উদাহরণস্বরূপ

  return (
    <div className="bookmark-card">
      <div className="card-header">
        <div className="card-title-group">
          <Globe size={16} className="site-icon" /> {/* সাইটের আইকন */}
          <div>
            <h3 className="card-title">{bookmark.title}</h3>
            <p className="card-url">{bookmark.url}</p>
          </div>
        </div>
        <button className="card-menu-btn">
          <MoreVertical size={20} />
        </button>
      </div>

      <p className="card-description">{bookmark.description}</p>

      <div className="card-tags">
        {bookmark.tags.map((tag) => (
          <span key={tag} className="tag-badge">
            {tag}
          </span>
        ))}
      </div>

      <div className="card-footer">
        <div className="card-info">
          <Calendar size={14} />
          <span>{lastVisited}</span>
          <span>&nbsp;•&nbsp;</span>
          <Calendar size={14} />
          <span>{dateAdded}</span>
        </div>
        <button className="card-bookmark-btn">
          <Bookmark size={18} fill={bookmark.bookmarked ? 'red' : 'none'} color={bookmark.bookmarked ? 'red' : 'gray'} />
        </button>
      </div>
    </div>
  );
}

export default BookmarkCard;