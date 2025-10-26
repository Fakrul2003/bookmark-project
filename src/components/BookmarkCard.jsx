// src/components/BookmarkCard.jsx
import React from 'react';
import { 
  MoreVertical, Eye, Clock, Calendar, Pin, Globe, PinOff,
  ExternalLink, Copy, Edit3, Archive, Trash2
} from 'lucide-react';

function BookmarkCard({ 
  bookmark, 
  isMenuOpen, 
  onToggleMenu,
  menuRef,
  onVisit, onCopy, onPin, onEdit, onArchive, onUnarchive, onDelete,
  isArchivedView
}) {
  const views = 47;
  const lastVisited = "23 Sep";
  const dateAdded = "15 Jan";

  const pinButtonText = bookmark.pinned ? 'Unpin' : 'Pin';
  const PinIcon = bookmark.pinned ? PinOff : Pin;

  return (
    <div className="bookmark-card">
      <div className="card-header">
        <div className="card-title-group">
          {bookmark.favicon ? (
            <img 
              src={bookmark.favicon} 
              alt={`${bookmark.title} favicon`}
              className="site-icon favicon"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
          ) : null}
          <Globe 
            size={16} 
            className="site-icon" 
            style={{ display: bookmark.favicon ? 'none' : 'block' }} 
          />

          <div>
            <h3 className="card-title">{bookmark.title}</h3>
            <p className="card-url">{bookmark.url}</p>
          </div>
        </div>

        <div className="menu-container" ref={menuRef}>
          <button className="card-menu-btn" onClick={onToggleMenu}>
            <MoreVertical size={20} />
          </button>

          {isMenuOpen && (
            <div className="dropdown-menu">
              <button onClick={() => onVisit(bookmark)}>
                <ExternalLink size={16} /> Visit
              </button>
              <button onClick={() => onCopy(bookmark.url)}>
                <Copy size={16} /> Copy URL
              </button>

              <button onClick={() => onPin(bookmark.id)}>
                <PinIcon size={16} /> {pinButtonText}
              </button>

              {/* Archive / Unarchive */}
              <button 
                onClick={() => 
                  bookmark.archived 
                    ? onUnarchive(bookmark.id) 
                    : onArchive(bookmark.id)
                }
              >
                <Archive size={16} /> {bookmark.archived ? 'Unarchive' : 'Archive'}
              </button>

              {/* Edit বা Delete */}
              {isArchivedView ? (
                <button onClick={() => onDelete(bookmark.id)} className="delete-menu-btn">
                  <Trash2 size={16} /> Delete
                </button>
              ) : (
                <button onClick={() => onEdit(bookmark)}>
                  <Edit3 size={16} /> Edit
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="card-description">
        <p className="card-content">{bookmark.description}</p>
        <div className="card-tags">
          {bookmark.tags.map(tag => (
            <span key={tag} className="tag-badge">{tag}</span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <div className="card-info">
          <Eye size={14} /><span>{views}</span>
          <span> • </span>
          <Clock size={14} /><span>{lastVisited}</span>
          <span> • </span>
          <Calendar size={14} /><span>{dateAdded}</span>
        </div>

        <div 
          className="pin" 
          onClick={() => onPin(bookmark.id)}
          style={{ cursor: 'pointer' }}
        >
          <Pin 
            size={28} 
            color={bookmark.pinned ? 'red' : 'gray'} 
            fill={bookmark.pinned ? 'red' : 'none'} 
          />
        </div>
      </div>
    </div>
  );
}

export default BookmarkCard;