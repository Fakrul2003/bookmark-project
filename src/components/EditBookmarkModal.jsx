// src/components/EditBookmarkModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function EditBookmarkModal({ isOpen, onClose, bookmark, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // মডাল ওপেন হলে বুকমার্কের ডেটা লোড করুন
  useEffect(() => {
    if (bookmark && isOpen) {
      setTitle(bookmark.title || '');
      setDescription(bookmark.description || '');
      setUrl(bookmark.url || '');
      setTagsInput(bookmark.tags?.join(', ') || '');
    }
  }, [bookmark, isOpen]);

  if (!isOpen || !bookmark) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // URL সঠিক করুন
    const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const domain = new URL(finalUrl).hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    const updatedBookmark = {
      ...bookmark,
      title,
      description,
      url: finalUrl,
      favicon: faviconUrl,
      tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    onSave(updatedBookmark);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit bookmark</h3>
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
        </div>

        <p className="modal-subtitle">
          Update your saved link details — change the title, description, URL, or tags anytime.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-title">Title *</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-description">Description *</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={280}
              required
              rows={3}
            />
            <small className="char-count">{description.length}/280</small>
          </div>

          <div className="form-group">
            <label htmlFor="edit-url">Website URL *</label>
            <input
              id="edit-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-tags">Tags *</label>
            <input
              id="edit-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Design, Learning, Tools"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Bookmark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBookmarkModal;