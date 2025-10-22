import React, { useState } from 'react';
import { X } from 'lucide-react';

function AddBookmarkModal({ isOpen, onClose, onAddBookmark, tags, updateTags }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newBookmark = {
      id: Date.now(),
      title,
      description,
      url,
      tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag), // ইনপুট থেকে ট্যাগ
      bookmarked: true,
    };
    
    onAddBookmark(newBookmark);
    // updateTags(tagsInput); // এটি বন্ধ করা হয়েছে, কারণ handleAddBookmark এর মাধ্যমেই হবে

    setTitle('');
    setDescription('');
    setUrl('');
    setTagsInput('');
    
    onClose();
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              maxLength={280} 
              required
            />
            <small className="char-count">{description.length}/280</small>
          </div>

          <div className="form-group">
            <label htmlFor="url">Website URL *</label>
            <input 
              id="url" 
              type="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="https://" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input 
              id="tags" 
              type="text" 
              value={tagsInput} 
              onChange={handleTagsChange} 
              placeholder="e.g. Design, Learning, Tools" 
            />
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