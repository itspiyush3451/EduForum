// Simple utility functions for notice operations
export const filterNotices = (notices, searchTerm, filterType) => {
  let filtered = [...notices];

  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(
      (notice) =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filter by type
  if (filterType === "important") {
    filtered = filtered.filter((notice) => notice.important);
  } else if (filterType === "regular") {
    filtered = filtered.filter((notice) => !notice.important);
  }

  return filtered;
};

export const sortNotices = (notices, sortBy) => {
  const sorted = [...notices];

  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
};

export const downloadFile = async (noticeId, filename) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3000/api/notices/download/${noticeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};
