// src/components/AddBookmarkModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

function AddBookmarkModal({ isOpen, onClose, onAddBookmark, tags }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // URL সঠিক করুন
    const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const domain = new URL(finalUrl).hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    const newBookmark = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      url: finalUrl,
      favicon: faviconUrl,
      tags: tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      pinned: false,        // ডিফল্ট: আনপিন
      addTime: Date.now(),  // অর্ডারিংয়ের জন্য
    };

    // ট্যাগ আপডেট (যদি নতুন ট্যাগ থাকে)
    const newTags = newBookmark.tags.filter(tag => !tags.some(t => t.name === tag));
    if (newTags.length > 0 && tags) {
      // ট্যাগ কাউন্ট আপডেট করুন (App.jsx এর মতো)
      // এখানে সিম্পলি পাস করা হলো, App.jsx এ হ্যান্ডেল হবে
    }

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
              placeholder=""
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
              placeholder=""
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
              placeholder=""
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
              placeholder=""
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