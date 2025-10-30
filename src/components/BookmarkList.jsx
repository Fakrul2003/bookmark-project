// src/components/BookmarkList.jsx
import React from "react";
import BookmarkCard from "./BookmarkCard";

function BookmarkList({ bookmarks, toggleArchive }) {
  if (!bookmarks || bookmarks.length === 0) {
    return <p style={{ padding: "20px" }}>No bookmarks found.</p>;
  }

  return (
    <div className="bookmark-list">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          toggleArchive={toggleArchive}
        />
      ))}
    </div>
  );
}

export default BookmarkList;
