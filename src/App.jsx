import React, { useState } from 'react';
import Nav from './components/Nav';
import Sidebar from './components/Sidebar';
import MainSection from './components/MainSection';
import './App.css';
import './css/main.css';
import AddBookmarkModal from './components/AddBookmarkModal';

const initialBookmarks = [
  {
    id: 1,
    title: 'Frontend Mentor',
    url: 'frontendmentor.io',
    description: 'Improve your front-end coding skills by building real projects.',
    tags: ['Design', 'Practice', 'Learning'],
    bookmarked: true,
  },
  {
    id: 2,
    title: 'MDN Web Docs',
    url: 'developer.mozilla.org',
    description: 'The MDN Web Docs site provides information about Open Web technologies.',
    tags: ['HTML', 'CSS', 'Reference'],
    bookmarked: true,
  },
  {
    id: 3,
    title: 'CSS Tricks',
    url: 'css-tricks.com',
    description: 'A blog about CSS and web design.',
    tags: ['Design', 'CSS'],
    bookmarked: true,
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

function App() {
  const [bookmarks, setBookmarks] = React.useState(initialBookmarks);
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tags, setTags] = useState(initialTags);

  const handleTagChange = (tagName) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagName)
        ? prevTags.filter((tag) => tag !== tagName)
        : [...prevTags, tagName]
    );
  };

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase());
    // OR লজিক: যেকোনো একটি ট্যাগ মিললে দেখাবে
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => bookmark.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleAddBookmark = (newBookmark) => {
    const newTagsFromBookmark = newBookmark.tags.filter(tag => !tags.some(t => t.name === tag));
    if (newTagsFromBookmark.length > 0) {
      setTags(prevTags => [
        ...prevTags,
        ...newTagsFromBookmark.map(tag => ({ name: tag, count: prevTags.find(t => t.name === tag)?.count + 1 || 1 })),
      ]);
    }
    setBookmarks([newBookmark, ...bookmarks]);
  };

  const updateTags = (newTagsInput) => {
    const tagsArray = newTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    const uniqueNewTags = tagsArray.filter(tag => !tags.some(t => t.name === tag));
    if (uniqueNewTags.length > 0) {
      setTags(prevTags => [
        ...prevTags,
        ...uniqueNewTags.map(tag => ({ name: tag, count: 1 })),
      ]);
    }
  };

  return (
    <div className="bookmark-manager-app">
      <Sidebar 
        tags={tags}
        selectedTags={selectedTags}
        onTagChange={handleTagChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="main-content-area">
        <Nav
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddClick={() => setIsModalOpen(true)}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <MainSection bookmarks={filteredBookmarks} />
      </div>
      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBookmark={handleAddBookmark}
        tags={tags}
        updateTags={updateTags}
      />
    </div>
  );
}

export default App;