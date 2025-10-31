import React, { useState, useRef } from "react";
import BookmarkCard from "./BookmarkCard";

function BookmarkList({
  bookmarks,
  onVisit,
  onCopy,
  onPin,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
  viewMode
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef();

  const handleToggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bookmark-list">
      {bookmarks.length === 0 ? (
        <p>No bookmarks found.</p>
      ) : (
        bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            isMenuOpen={openMenuId === bookmark.id}
            onToggleMenu={() => handleToggleMenu(bookmark.id)}
            menuRef={menuRef}
            onVisit={onVisit}
            onCopy={onCopy}
            onPin={onPin}
            onEdit={onEdit}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
            onDelete={onDelete}
            isArchivedView={viewMode === "archived"}
          />
        ))
      )}
    </div>
  );
}

export default BookmarkList;
