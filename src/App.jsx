// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";
import MainSection from "./components/MainSection";
import AddBookmarkModal from "./components/AddBookmarkModal";
import EditBookmarkModal from "./components/EditBookmarkModal";

import "./App.css";
import "./css/main.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

function MainLayout({
  bookmarks,
  setBookmarks,
  sortedBookmarks,
  selectedTags,
  setSelectedTags,
  tags,
  setTags,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  isModalOpen,
  setIsModalOpen,
  isSidebarOpen,
  setIsSidebarOpen,
  isDarkMode,
  toggleTheme,
  onAddBookmark,
  onEdit,
  onPin,
  onArchive,
  onUnarchive,
  onDelete,
  onVisit,  // নতুন
  isLoggedIn,
  setIsLoggedIn,
  editingBookmark,
  setEditingBookmark,
  isEditModalOpen,
  setIsEditModalOpen,
  confirmAction,
  setConfirmAction,
  confirmActionHandler,
  currentUser,
  setCurrentUser,
  onLogout,
}) {
  return (
    <>
      <Sidebar
        tags={tags}
        bookmarks={bookmarks}
        selectedTags={selectedTags}
        onTagChange={(tagName) =>
          setSelectedTags((prev) =>
            prev.includes(tagName)
              ? prev.filter((t) => t !== tagName)
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
          onVisit={onVisit}  // পাস
          viewMode={viewMode}
        />
      </div>

      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBookmark={onAddBookmark}
      />

      <EditBookmarkModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBookmark(null);
        }}
        bookmark={editingBookmark}
        onSave={(updatedBookmark) => {
          const updated = bookmarks.map((b) =>
            b.id === updatedBookmark.id ? updatedBookmark : b
          );
          setBookmarks(updated);
          localStorage.setItem("bookmarks", JSON.stringify(updated));
          setIsEditModalOpen(false);
          setEditingBookmark(null);
        }}
      />

      {confirmAction && (
        <div className="modal-overlay" onClick={() => setConfirmAction(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {confirmAction.type === "delete"
                  ? "Delete"
                  : confirmAction.type === "archive"
                  ? "Archive"
                  : "Unarchive"}{" "}
                bookmark
              </h3>
              <button onClick={() => setConfirmAction(null)} className="modal-close-btn">
                ×
              </button>
            </div>
            <p>
              {confirmAction.type === "delete"
                ? "This action cannot be undone. Are you sure?"
                : `Are you sure you want to ${
                    confirmAction.type === "archive" ? "archive" : "unarchive"
                  } this bookmark?`}
            </p>
            <div className="modal-actions">
              <button onClick={() => setConfirmAction(null)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmActionHandler} className="delete-confirm-btn">
                Confirm
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

  const [bookmarks, setBookmarks] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // লোড: শুধু localStorage
useEffect(() => {
  const storedBookmarks = localStorage.getItem("bookmarks");
  const user = localStorage.getItem("currentUser");

  if (storedBookmarks) {
    let loadedBookmarks = JSON.parse(storedBookmarks);

    loadedBookmarks = loadedBookmarks.map(b => {
      let favicon = b.favicon;

      // favicon আছে কিন্তু localhost বা invalid URL → null করুন
      if (favicon) {
        try {
          const urlObj = new URL(b.url);
          const domain = urlObj.hostname;
          if (['localhost', '127.0.0.1'].includes(domain)) {
            favicon = null;
          }
        } catch (e) {
          favicon = null; // invalid URL
        }
      }

      return {
        ...b,
        views: b.views ?? 0,
        lastVisitTime: b.lastVisitTime ?? 0,
        lastVisited: b.lastVisited ?? 'Never',
        dateAdded: b.dateAdded ?? new Date(b.addTime).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short'
        }),
        favicon // আপডেটেড favicon
      };
    });

    setBookmarks(loadedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(loadedBookmarks));

    // ট্যাগ কাউন্ট
    const tagCountMap = {};
    const tagFirstSeen = {};

    loadedBookmarks.forEach(b => {
      if (Array.isArray(b.tags)) {
        b.tags.forEach(tag => {
          tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
          if (!tagFirstSeen[tag]) tagFirstSeen[tag] = b.addTime;
        });
      }
    });

    const recalculatedTags = Object.keys(tagCountMap).map(name => ({
      name,
      count: tagCountMap[name],
      firstSeen: tagFirstSeen[name]
    })).sort((a, b) => a.firstSeen - b.firstSeen);

    setTags(recalculatedTags);
    localStorage.setItem("tags", JSON.stringify(recalculatedTags));
  } else {
    setBookmarks([]);
    setTags([]);
  }

  if (user) {
    setCurrentUser(JSON.parse(user));
    setIsLoggedIn(true);
  }
}, []);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => bookmark.tags.includes(tag));
    const matchesView = viewMode === "all" ? !bookmark.archived : viewMode === "archived" ? bookmark.archived : true;
    return matchesSearch && matchesTags && matchesView;
  });

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.addTime - a.addTime;
  });

  // ভিউ কাউন্ট: ৩ দিন পর পর
  const handleVisit = (bookmark) => {
    const now = Date.now();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const lastVisitTime = bookmark.lastVisitTime || 0;

    if (now - lastVisitTime >= threeDays) {
      const updatedBookmarks = bookmarks.map(b =>
        b.id === bookmark.id
          ? {
              ...b,
              views: (b.views || 0) + 1,
              lastVisitTime: now,
              lastVisited: new Date(now).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short'
              })
            }
          : b
      );

      setBookmarks(updatedBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    }
  };

  // বুকমার্ক অ্যাড
  const handleAddBookmark = (newBookmark) => {
    const finalBookmark = {
      ...newBookmark,
      views: 0,
      lastVisitTime: 0,
      lastVisited: 'Never',
      dateAdded: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    };

    const updatedBookmarks = [...bookmarks, finalBookmark];
    setBookmarks(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));

    const tagCountMap = {};
    const tagFirstSeen = {};

    updatedBookmarks.forEach(b => {
      if (Array.isArray(b.tags)) {
        b.tags.forEach(tag => {
          tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
          if (!tagFirstSeen[tag]) tagFirstSeen[tag] = b.addTime;
        });
      }
    });

    const updatedTags = Object.keys(tagCountMap).map(name => ({
      name,
      count: tagCountMap[name],
      firstSeen: tagFirstSeen[name]
    })).sort((a, b) => a.firstSeen - b.firstSeen);

    setTags(updatedTags);
    localStorage.setItem("tags", JSON.stringify(updatedTags));
  };

  const handleEdit = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsEditModalOpen(true);
  };

  const handlePin = (id) => {
    const updated = bookmarks.map((b) => (b.id === id ? { ...b, pinned: !b.pinned } : b));
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const handleArchive = (id) => setConfirmAction({ type: "archive", id });
  const handleUnarchive = (id) => setConfirmAction({ type: "unarchive", id });
  const handleDelete = (id) => setConfirmAction({ type: "delete", id });

  const confirmActionHandler = () => {
    if (!confirmAction) return;
    let updated = bookmarks;

    if (confirmAction.type === "archive")
      updated = bookmarks.map((b) => (b.id === confirmAction.id ? { ...b, archived: true } : b));
    if (confirmAction.type === "unarchive")
      updated = bookmarks.map((b) => (b.id === confirmAction.id ? { ...b, archived: false } : b));
    if (confirmAction.type === "delete")
      updated = bookmarks.filter((b) => b.id !== confirmAction.id);

    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));

    const tagCountMap = {};
    const tagFirstSeen = {};
    updated.forEach(b => {
      if (Array.isArray(b.tags)) {
        b.tags.forEach(tag => {
          tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
          if (!tagFirstSeen[tag]) tagFirstSeen[tag] = b.addTime;
        });
      }
    });

    const updatedTags = Object.keys(tagCountMap)
      .map(name => ({
        name,
        count: tagCountMap[name],
        firstSeen: tagFirstSeen[name]
      }))
      .sort((a, b) => a.firstSeen - b.firstSeen);

    setTags(updatedTags);
    localStorage.setItem("tags", JSON.stringify(updatedTags));

    setConfirmAction(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className={`bookmark-manager-app ${isDarkMode ? "dark-mode" : ""}`}>
      {!hideLayout ? (
        <MainLayout
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
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
          onVisit={handleVisit}
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