import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import NoticeList from "./NoticeList";
import NoticeFilters from "./NoticeFilters";
import {
  filterNotices,
  sortNotices,
  downloadFile,
} from "../../utils/noticeUtils";

const NoticeContainer = () => {
  const [notices, setNotices] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simple state management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isTeacher = user?.role === "Teacher";

  // Fetch notices
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/notices", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotices(data.notices || []);
        setUserNames(data.userNames || {});
      } else {
        setError("Failed to fetch notices");
      }
    } catch (err) {
      setError("Error fetching notices: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (noticeId) => {
    navigate(`/notices/edit/${noticeId}`);
  };

  const handleDelete = async (noticeId) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/notices/${noticeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          fetchNotices(); // Refresh notices
        }
      } catch (err) {
        console.error("Error deleting notice:", err);
      }
    }
  };

  const handleDownload = (noticeId, filename) => {
    downloadFile(noticeId, filename);
  };

  // Filter and sort notices
  const filteredNotices = filterNotices(notices, searchTerm, filterType);
  const sortedNotices = sortNotices(filteredNotices, sortBy);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1
          className={`text-3xl font-bold mb-8 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Notices
        </h1>

        <NoticeFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isDarkMode={isDarkMode}
        />

        <NoticeList
          notices={sortedNotices}
          userNames={userNames}
          isTeacher={isTeacher}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownload={handleDownload}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default NoticeContainer;
