// src/components/BookmarkCard.jsx
import React, { useState, useEffect } from 'react';
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
  const pinButtonText = bookmark.pinned ? 'Unpin' : 'Pin';
  const PinIcon = bookmark.pinned ? PinOff : Pin;

  const [showCopied, setShowCopied] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  // রিসেট favicon error when bookmark changes
  useEffect(() => {
    setFaviconError(false);
  }, [bookmark.id, bookmark.favicon]);

  const handleCopyUrl = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(bookmark.url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1500);
  };

  // ফেভিকন শুধু তখনই দেখাবে যদি URL সঠিক হয়
  const shouldShowFavicon = bookmark.favicon && !faviconError;

  return (
    <div className="bookmark-card">
      <div className="card-header">
        <div className="card-title-group">
          {/* ফেভিকন: শুধু সঠিক হলে */}
          {shouldShowFavicon && (
            <img 
              src={bookmark.favicon} 
              alt={`${bookmark.title} favicon`}
              className="site-icon favicon"
              onError={() => setFaviconError(true)}
            />
          )}

          {/* ডিফল্ট Globe আইকন */}
          <Globe 
            size={16} 
            className="site-icon" 
            style={{ display: shouldShowFavicon ? 'none' : 'block' }} 
          />

          <div style={{ position: 'relative' }}>
            <h3 className="card-title">{bookmark.title}</h3>
            <p 
              className="card-url clickable-url" 
              onClick={handleCopyUrl}
              title="Click to copy URL"
            >
              {bookmark.url}
            </p>
            {showCopied && (
              <div className="copy-tooltip">Copied!</div>
            )}
          </div>
        </div>

        <div className="menu-container" ref={menuRef}>
          <button className="card-menu-btn" onClick={onToggleMenu}>
            <MoreVertical size={20} />
          </button>

          {isMenuOpen && (
            <div className="dropdown-menu">
              {/* Visit */}
              <button onClick={() => {
                onVisit(bookmark);
                onToggleMenu();
                const finalUrl = /^https?:\/\//i.test(bookmark.url) ? bookmark.url : `https://${bookmark.url}`;
                window.open(finalUrl, '_blank', 'noopener,noreferrer');
              }}>
                <ExternalLink size={16} /> Visit
              </button>

              {/* Copy URL */}
              <button onClick={() => {
                onCopy(bookmark.url);
                onToggleMenu();
              }}>
                <Copy size={16} /> Copy URL
              </button>

              {/* Pin/Unpin: শুধু Home পেজে */}
              {!isArchivedView && (
                <button onClick={() => {
                  onPin(bookmark.id);
                  onToggleMenu();
                }}>
                  <PinIcon size={16} /> {pinButtonText}
                </button>
              )}

              {/* Archive/Unarchive */}
              <button onClick={() => {
                bookmark.archived ? onUnarchive(bookmark.id) : onArchive(bookmark.id);
                onToggleMenu();
              }}>
                <Archive size={16} /> {bookmark.archived ? 'Unarchive' : 'Archive'}
              </button>

              {/* Edit or Delete */}
              {isArchivedView ? (
                <button onClick={() => {
                  onDelete(bookmark.id);
                  onToggleMenu();
                }} className="delete-menu-btn">
                  <Trash2 size={16} /> Delete
                </button>
              ) : (
                <button onClick={() => {
                  onEdit(bookmark);
                  onToggleMenu();
                }}>
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

      {/* CARD FOOTER */}
      <div className="card-footer">
        <div className="card-info">
          <div 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px'
            }}
            onClick={() => onVisit(bookmark)}
            title="Click to count as a view (once every 3 days)"
          >
            <Eye size={14} />
            <span>{bookmark.views || 0}</span>
          </div>

          
          <Clock size={14} /><span>{bookmark.lastVisited || 'Never'}</span>
          <Calendar size={14} /><span>{bookmark.dateAdded || 'Unknown'}</span>
        </div>

        {/* Pin আইকন বা Archived লেখা */}
        {isArchivedView ? (
          <span 
            style={{ 
              color: '#6b7280', 
              fontWeight: '500', 
              fontSize: '0.875rem' 
            }}
          >
            Archived
          </span>
        ) : bookmark.pinned ? (
          <div 
            className="pin" 
            style={{ cursor: 'pointer' }}
            title="Unpin"
          >
            <Pin 
              size={28}  
              color="#ef4444"
              fill="#ef4444"
              strokeWidth={2.5}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default BookmarkCard;