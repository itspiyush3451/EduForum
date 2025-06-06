import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../services/postService";
import { jwtDecode } from "jwt-decode";
import { useComments } from "../context/CommentContext";
import { FaComment, FaRegComment } from "react-icons/fa";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userDepartmentId, setUserDepartmentId] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const navigate = useNavigate();
  const { comments, fetchComments } = useComments();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (token) {
          try {
            const decoded = jwtDecode(token);
            setUserDepartmentId(decoded.departmentId);
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }

        const response = await postService.getAllPosts();
        const postsData = Array.isArray(response) ? response : [];
        setPosts(postsData);
        
        // Fetch comments for all posts
        for (const post of postsData) {
          await fetchComments(post.postid);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [fetchComments]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await postService.getAllDepartments();
        setDepartments(response);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleCreatePost = () => {
    navigate("/posts/create");
  };

  const filteredPosts = (posts || []).filter((post) => {
    // Department filter
    if (departmentFilter !== "all" && post.departmentid !== parseInt(departmentFilter)) {
      return false;
    }

    // Content filter with multiple fields
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const searchableFields = [
        post.title,
        post.content,
        post.author?.username,
        post.department?.name
      ].filter(Boolean); // Remove undefined/null values

      return searchableFields.some(field => 
        field.toLowerCase().includes(searchLower)
      );
    }

    // Date filter
    if (dateFilter) {
      const postDate = new Date(post.timestamp);
      const today = new Date();
      const diffDays = Math.ceil((today - postDate) / (1000 * 60 * 60 * 24));
      
      switch(dateFilter) {
        case "today":
          return diffDays <= 1;
        case "week":
          return diffDays <= 7;
        case "month":
          return diffDays <= 30;
        default:
          return true;
      }
    }

    return true;
  });

  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  const toggleComments = async (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    // Always fetch comments when expanding
    await fetchComments(postId);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">All Posts</h1>
        <button
          onClick={handleCreatePost}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Create Post
        </button>
      </div>

      {/* Filter controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search by title, content, or author..."
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <select
              id="department"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.departmentid} value={dept.departmentid}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-48">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <select
              id="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateFilter || ""}
              onChange={(e) => setDateFilter(e.target.value || null)}
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : sortedPosts.length > 0 ? (
        <div className="space-y-6">
          {sortedPosts.map((post) => (
            <div
              key={post.postid}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h2 
                    className="text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer"
                    onClick={() => handlePostClick(post.postid)}
                  >
                    {post.title}
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {departments.find(dept => dept.departmentid === post.departmentid)?.name || "Department"}
                  </span>
                </div>

                <p className="text-gray-600 mt-2 line-clamp-3">{post.content}</p>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {post.authorName?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {post.user?.username || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        @{post.user?.username?.toLowerCase() || 'anonymous'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {new Date(post.timestamp).toLocaleDateString()}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComments(post.postid);
                      }}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {expandedComments[post.postid] ? (
                        <FaComment className="text-blue-600" />
                      ) : (
                        <FaRegComment />
                      )}
                      <span className="text-sm font-medium">
                        {comments[post.postid]?.length || 0} 
                      </span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {expandedComments[post.postid] && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {comments[post.postid]?.length > 0 ? (
                        comments[post.postid].map((comment) => (
                          <div key={comment.commentid} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-800">
                                    {comment.user?.username?.[0]?.toUpperCase() || 'A'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {comment.user?.username || 'Anonymous'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(comment.timestamp).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <p className="mt-2 text-gray-700 text-sm">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <FaRegComment className="mx-auto text-2xl mb-2" />
                          <p className="text-sm">No comments yet. Be the first to comment!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-16 h-16 mx-auto text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            No posts found
          </h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or filter criteria
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreatePost}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md inline-flex items-center transition-colors shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Create a new post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPosts;