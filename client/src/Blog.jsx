import axios from "axios";
import { useState, useEffect, useRef } from "react";
import NewPost from "./components/NewPost.jsx";
import CommentsParent from "./components/Comments.jsx";
import "./comment.css";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = window.localStorage.getItem("email");
  const userId = window.localStorage.getItem("userId");
  const [showCommentInput, setShowCommentInput] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [fetchedComments, setFetchedComments] = useState([]);
  const [refreshComments, setRefreshComments] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [loading]);


  useEffect(() => {
    // Fetch comments for each post when component mounts
    fetchComments();
  }, [refreshComments]);

  const handleRefreshComments = () => {
    setRefreshComments((prev) => !prev);
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/posts`);
      setPosts(response.data.allPosts);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleLikes = async (postId, currentLikes) => {
    try {
      const updatedLikes = currentLikes + 1;
      await axios.post(
        `${BASE_URL}/api/update-likes`,
        { postId, userId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // Update the local state to reflect the new like count
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, likes: updatedLikes } : post
        )
      );
    } catch (error) {
      console.error("Failed to update likes:", error);
    }
  };

  const handleNewPost = async (formData) => {
    try {
      await axios.post(`${BASE_URL}/api/new-blog`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setLoading(true);
    } catch (error) {
      console.error("Failed to create new post:", error);
    }
  };

  const handleCommentToggle = (postId) => {
    setShowCommentInput((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const saveComment = async (postId) => {
    try {
      await axios.post(`${BASE_URL}/api/post-comment`, {
        postId,
        userId,
        commentInput,
      });
      handleCommentToggle(postId);
      setCommentInput("");
      fetchComments();
    } catch (error) {
      console.error("Failed to post the comment", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/get-comment/`);
      fetchPosts();
      setFetchedComments(response.data.modifiedComments);
    } catch (error) {
      console.error("Failed to get comments:", error);
    }
  };

  return (
    <>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="bg-gray-50 py-16 sm:py-24 px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
                <div className="grid grid-cols-1 gap-y-4">
                  <div className="pt-2 pb-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-2 mx-2 leading-normal">Akhilesh Srivastav</h4>
                    <img
                      src="https://images.pexels.com/photos/6468238/pexels-photo-6468238.jpeg"
                      alt="Trending"
                      className="rounded-lg w-full h-auto"
                    />
                    <div className="flex space-x-4 mt-4 mx-4">
                      {/* Like Button */}
                      <button
                        className="flex items-center text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                          />
                        </svg>
                        <span></span>
                        <span className="ml-1 text-sm">Like</span>
                      </button>
                      {/* Comment Button */}
                      <button
                        className="flex items-center text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M21 12.03a9.429 9.429 0 01-1.468 5.332c-.466.627-1.061 1.264-1.768 1.938-2.07 2.046-5.032 2.913-8.008 2.93-2.976.017-5.938-.887-8.008-2.93-.707-.674-1.302-1.311-1.768-1.938A9.429 9.429 0 013 12.03c0-2.24.845-4.4 2.366-6.11A11.13 11.13 0 0112 3.093a11.13 11.13 0 016.634 2.827A8.951 8.951 0 0121 12.03z"
                          />
                        </svg>
                        <span className="ml-1 text-sm">Comment</span>
                      </button>
                      {/* Share Button */}
                      <button className="flex items-center text-gray-500 hover:text-gray-700">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 10l4.553 2.276a2 2 0 010 3.448L15 18m-6-8l-4.553 2.276a2 2 0 000 3.448L9 18m0-12l6 6"
                          />
                        </svg>
                        <span className="ml-1 text-sm">Share</span>
                      </button>
                    </div>
                  </div>
                  <hr />
                  <div className="pt-2 pb-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-2 mx-2 leading-normal">Suhana Sharma</h4>
                    <img
                      src="https://images.pexels.com/photos/159291/beer-machine-alcohol-brewery-159291.jpeg"
                      alt="Trending"
                      className="rounded-lg w-full h-auto"
                    />
                    <div className="flex space-x-4 mt-4 mx-4">
                      {/* Like Button */}
                      <button
                        className="flex items-center text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                          />
                        </svg>
                        <span></span>
                        <span className="ml-1 text-sm">Like</span>
                      </button>
                      {/* Comment Button */}
                      <button
                        className="flex items-center text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M21 12.03a9.429 9.429 0 01-1.468 5.332c-.466.627-1.061 1.264-1.768 1.938-2.07 2.046-5.032 2.913-8.008 2.93-2.976.017-5.938-.887-8.008-2.93-.707-.674-1.302-1.311-1.768-1.938A9.429 9.429 0 013 12.03c0-2.24.845-4.4 2.366-6.11A11.13 11.13 0 0112 3.093a11.13 11.13 0 016.634 2.827A8.951 8.951 0 0121 12.03z"
                          />
                        </svg>
                        <span className="ml-1 text-sm">Comment</span>
                      </button>
                      {/* Share Button */}
                      <button className="flex items-center text-gray-500 hover:text-gray-700">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 10l4.553 2.276a2 2 0 010 3.448L15 18m-6-8l-4.553 2.276a2 2 0 000 3.448L9 18m0-12l6 6"
                          />
                        </svg>
                        <span className="ml-1 text-sm">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
            </div>
            <div className="col-span-1">
              {isAuthenticated && <NewPost onSubmit={handleNewPost} />}
              <div className="mt-10 grid grid-cols-1 gap-y-8">
                {posts.map((post, index) => (
                  <article
                    key={index}
                    className="bg-white shadow-md rounded-lg p-6"
                  >
                    <div className="flex items-center">
                      <img
                        src={post.imageUrl}
                        alt=""
                        className="h-10 w-10 rounded-full bg-gray-50"
                      />
                      <div className="ml-4">
                        <p id="commentName" className="font-semibold text-gray-900 m-0 leading-normal">{post.name}</p>
                        <p className="text-sm text-gray-600">{post.role}</p>
                      </div>
                      {/* Will add something later */}
                    </div>
                    <div className="mt-4 flex items-center gap-x-4 text-xs">
                      <time
                        dateTime={new Date(post.updatedAt).toISOString()}
                        className="text-gray-500"
                      >
                        {new Date(post.updatedAt).toLocaleDateString("en-us", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <p className="relative z-10 rounded-full bg-blue-100 px-3 py-1.5 font-medium text-blue-700 hover:bg-blue-200">
                        {post.category}
                      </p>
                    </div>
                    <div className="text-start mt-4">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {post.description}
                      </p>
                    </div>
                    <div className="mt-4 p-4 border-t border-gray-200">
                      <div className="flex space-x-4">
                        {/* Like Button */}
                        <button
                          onClick={() => handleLikes(post._id, post.likes)}
                          className="flex items-center text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                            />
                          </svg>
                          <span>{post.likes}</span>
                          <span className="ml-1 text-sm">Like</span>
                        </button>
                        {/* Comment Button */}
                        <button
                          className="flex items-center text-gray-500 hover:text-gray-700"
                          onClick={() => handleCommentToggle(post._id)}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 10h.01M12 10h.01M16 10h.01M21 12.03a9.429 9.429 0 01-1.468 5.332c-.466.627-1.061 1.264-1.768 1.938-2.07 2.046-5.032 2.913-8.008 2.93-2.976.017-5.938-.887-8.008-2.93-.707-.674-1.302-1.311-1.768-1.938A9.429 9.429 0 013 12.03c0-2.24.845-4.4 2.366-6.11A11.13 11.13 0 0112 3.093a11.13 11.13 0 016.634 2.827A8.951 8.951 0 0121 12.03z"
                            />
                          </svg>
                          <span className="ml-1 text-sm">Comment</span>
                        </button>
                        {/* Share Button */}
                        <button className="flex items-center text-gray-500 hover:text-gray-700">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 10l4.553 2.276a2 2 0 010 3.448L15 18m-6-8l-4.553 2.276a2 2 0 000 3.448L9 18m0-12l6 6"
                            />
                          </svg>
                          <span className="ml-1 text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                    {showCommentInput[post._id] && (
                      <div className="p-4 border-t border-gray-200">
                        <textarea
                          onChange={(e) => setCommentInput(e.target.value)}
                          value={commentInput}
                          className="w-full h-20 px-3 py-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="Write a comment..."
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => saveComment(post._id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none me-1"
                          >
                            Post Comment
                          </button>
                          <button
                            onClick={() => handleCommentToggle(post._id)}
                            className="px-4 py-2 text-black rounded-lg hover:bg-blue-100 outline outline-1 outline-blue-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                      <CommentsParent
                        comments={fetchedComments}
                        postId={post._id}
                        onRefreshComments={handleRefreshComments}
                      />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
