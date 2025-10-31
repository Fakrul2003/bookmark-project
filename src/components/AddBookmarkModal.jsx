// src/components/AddBookmarkModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

function AddBookmarkModal({ isOpen, onClose, onAddBookmark }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    let faviconUrl = null;

    // ফেভিকন শুধু বৈধ ডোমেইনে, localhost বাদ
    try {
      const domain = new URL(finalUrl).hostname;
      if (!['localhost', '127.0.0.1'].includes(domain)) {
        faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      }
    } catch (error) {
      // ইউআরএল ভ্যালিড না হলে কিছু করবেন না
      console.warn('Invalid URL for favicon:', finalUrl);
    }

    const newBookmark = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      url: finalUrl,
      favicon: faviconUrl, // null হলে Globe দেখাবে
      tags: tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      pinned: false,
      archived: false,
      addTime: Date.now(),
      views: 0,
      lastVisitTime: 0,
      lastVisited: 'Never',
      dateAdded: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      }) // e.g., "31 Oct"
    };

    onAddBookmark(newBookmark);

    // রিসেট
    setTitle('');
    setDescription('');
    setUrl('');
    setTagsInput('');
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add a bookmark</h3>
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
        </div>

        <p className="modal-subtitle">
          Save a link with details to keep your collection organized.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. React Docs"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={400}
              rows={3}
              placeholder="Brief description..."
              required
            />
            <small className="char-count">{description.length}/400</small>
          </div>

          <div className="form-group">
            <label htmlFor="url">Website URL *</label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="react.dev"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="react, frontend, docs"
            />
            <small style={{ color: '#666', fontSize: '0.75rem' }}>
              Separate tags with commas
            </small>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="add-btn">
              Add Bookmark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBookmarkModal;