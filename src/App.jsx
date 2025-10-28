// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Nav from './components/Nav';
import Sidebar from './components/Sidebar';
import MainSection from './components/MainSection';
import AddBookmarkModal from './components/AddBookmarkModal';
import EditBookmarkModal from './components/EditBookmarkModal';

import './App.css';
import './css/main.css';

import Login from './pages/Login';
import Signup from './pages/Signup';

const initialBookmarks = [
  {
    id: 1,
    title: 'Frontend Mentor',
    url: 'frontendmentor.io',
    description: 'Improve your front-end coding skills by building real projects.',
    tags: ['Design', 'Practice', 'Learning'],
    pinned: false,
    archived: false,
    addTime: Date.now() - 300000,
  },
  {
    id: 2,
    title: 'MDN Web Docs',
    url: 'developer.mozilla.org',
    description: 'The MDN Web Docs site provides information about Open Web technologies.',
    tags: ['HTML', 'CSS', 'Reference'],
    pinned: false,
    archived: false,
    addTime: Date.now() - 200000,
  },
  {
    id: 3,
    title: 'CSS Tricks',
    url: 'css-tricks.com',
    description: 'A blog about CSS and web design.',
    tags: ['Design', 'CSS'],
    pinned: false,
    archived: false,
    addTime: Date.now() - 100000,
  },
];

const initialTags = [
  { name: 'AI', count: 1 },
  { name: 'Community', count: 5 },
  { name: 'CSS', count: 6 },
  { name: 'Design', count: 6 },
  { name: 'Framework', count: 2 },
  { name: 'HTML', count: 2 },
  { name: 'JavaScript', count: 3 },
  { name: 'Learning', count: 6 },
  { name: 'Reference', count: 4 },
];

// Main Layout
function MainLayout({ 
  bookmarks, sortedBookmarks, selectedTags, setSelectedTags, 
  tags, setTags, viewMode, setViewMode,
  searchTerm, setSearchTerm, 
  isModalOpen, setIsModalOpen, 
  isSidebarOpen, setIsSidebarOpen, 
  isDarkMode, toggleTheme, 
  onAddBookmark, onEdit, onPin, onArchive, onUnarchive, onDelete,
  isLoggedIn, setIsLoggedIn, 
  editingBookmark, setEditingBookmark, isEditModalOpen, setIsEditModalOpen,
  confirmAction, setConfirmAction, confirmActionHandler,
  currentUser, setCurrentUser, onLogout
}) {
  return (
    <>
      <Sidebar
        tags={tags}
        selectedTags={selectedTags}
        onTagChange={(tagName) =>
          setSelectedTags(prev =>
            prev.includes(tagName)
              ? prev.filter(t => t !== tagName)
              : [...prev, tagName]
          )
        }
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="main-content-area">
        <Nav
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddClick={() => setIsModalOpen(true)}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          onLogout={onLogout}
        />

        <MainSection
          bookmarks={sortedBookmarks}
          onEdit={onEdit}
          onPin={onPin}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
          onDelete={onDelete}
          viewMode={viewMode}
        />
      </div>

      {/* Modals */}
      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBookmark={onAddBookmark}
        tags={tags}
      />

      <EditBookmarkModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingBookmark(null); }}
        bookmark={editingBookmark}
        onSave={(updatedBookmark) => {
          setBookmarks(prev => prev.map(b => b.id === updatedBookmark.id ? updatedBookmark : b));
          setIsEditModalOpen(false);
          setEditingBookmark(null);
        }}
      />

      {/* Confirm Modal */}
      {confirmAction && (
        <div className="modal-overlay" onClick={() => setConfirmAction(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {confirmAction.type === 'delete' ? 'Delete' : 
                 confirmAction.type === 'archive' ? 'Archive' : 'Unarchive'} bookmark
              </h3>
              <button onClick={() => setConfirmAction(null)} className="modal-close-btn">X</button>
            </div>
            <p>
              {confirmAction.type === 'delete' 
                ? 'This action cannot be undone. Are you sure you want to permanently delete this bookmark?'
                : `Are you sure you want to ${confirmAction.type === 'archive' ? 'archive' : 'unarchive'} this bookmark?`
              }
            </p>
            <div className="modal-actions">
              <button onClick={() => setConfirmAction(null)} className="cancel-btn">Cancel</button>
              <button 
                onClick={confirmActionHandler} 
                className={confirmAction.type === 'delete' ? 'delete-confirm-btn' : 'archive-confirm-btn'}
              >
                {confirmAction.type === 'delete' ? 'Delete' : 
                 confirmAction.type === 'archive' ? 'Archive' : 'Unarchive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AppContent() {
  const location = useLocation();

  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tags, setTags] = useState(initialTags);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // যোগ করা হয়েছে

  // রিফ্রেশে ইউজার লোড
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    console.log('App.jsx: currentUser loaded:', user ? JSON.parse(user) : null);
    if (user) {
      const parsed = JSON.parse(user);
      setCurrentUser(parsed);
      setIsLoggedIn(true);
    }
  }, []);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => bookmark.tags.includes(tag));
    const matchesView = 
      viewMode === 'all' ? !bookmark.archived : 
      viewMode === 'archived' ? bookmark.archived : true;
    return matchesSearch && matchesTags && matchesView;
  });

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.addTime - b.addTime;
  });

  const handleAddBookmark = (newBookmark) => {
    const bookmarkWithTime = { ...newBookmark, pinned: false, archived: false, addTime: Date.now() };
    setBookmarks(prev => [...prev, bookmarkWithTime]);
  };

  const handleEdit = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsEditModalOpen(true);
  };

  const handlePin = (id) => {
    setBookmarks(prev =>
      prev.map(b => b.id === id ? { ...b, pinned: !b.pinned } : b)
    );
  };

  const handleArchive = (id) => setConfirmAction({ type: 'archive', id });
  const handleUnarchive = (id) => setConfirmAction({ type: 'unarchive', id });
  const handleDelete = (id) => setConfirmAction({ type: 'delete', id });

  const confirmActionHandler = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'archive')
      setBookmarks(prev => prev.map(b => b.id === confirmAction.id ? { ...b, archived: true } : b));
    else if (confirmAction.type === 'unarchive')
      setBookmarks(prev => prev.map(b => b.id === confirmAction.id ? { ...b, archived: false } : b));
    else if (confirmAction.type === 'delete')
      setBookmarks(prev => prev.filter(b => b.id !== confirmAction.id));
    setConfirmAction(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const hideLayout = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className={`bookmark-manager-app ${isDarkMode ? 'dark-mode' : ''}`}>
      {!hideLayout ? (
        <MainLayout
          bookmarks={bookmarks}
          sortedBookmarks={sortedBookmarks}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          tags={tags}
          setTags={setTags}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onAddBookmark={handleAddBookmark}
          onEdit={handleEdit}
          onPin={handlePin}
          onArchive={handleArchive}
          onUnarchive={handleUnarchive}
          onDelete={handleDelete}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          editingBookmark={editingBookmark}
          setEditingBookmark={setEditingBookmark}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          confirmAction={confirmAction}
          setConfirmAction={setConfirmAction}
          confirmActionHandler={confirmActionHandler}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          onLogout={handleLogout}
        />
      ) : (
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />} />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />} />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;