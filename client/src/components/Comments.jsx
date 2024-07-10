import React, { useEffect, useState } from "react";
import axios from "axios";

function CommentsParent({ comments = [], postId, onRefreshComments }) {
  const [showReply, setShowReply] = useState({});
  const [reply, setReply] = useState("");
  const userId = window.localStorage.getItem("userId");
  const [usersInfo, setUsersInfo] = useState([]);
  const [prevComment, setPrevComment] = useState([]);

  const handleReplyClick = (id) => {
    setShowReply((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchUsersInfo = async () => {
      // Extract unique user IDs efficiently
      const uniqueUserIds = new Set(comments.map((comment) => comment.userId));
      console.log("Array", uniqueUserIds);
      try {
        const usersInfoResponse = await axios.post(
          "/api/get-users-info",
          { userId: Array.from(uniqueUserIds) },
          { headers: { "Content-Type": "application/json" } }
        );
        setUsersInfo(usersInfoResponse.data.user);
      } catch (error) {
        console.error("Failed to fetch users info:", error);
      }
    };

    setPrevComment(comments);
    // Only fetch user info when comments change
    if (comments.length > prevComment.length) {
      fetchUsersInfo();
    }
  }, [comments]);

  const saveReply = async (commentId, fetchReply) => {
    try {
      await axios.post(
        "/api/post-reply",
        { commentId, userId, fetchReply },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setReply("");
      setShowReply((prev) => ({ ...prev, [commentId]: false }));
      onRefreshComments();
    } catch (error) {
      console.error("Failed to send reply: ", error);
    }
  };

  useEffect(() => {
    console.log(reply);
  }, [reply]);

  return comments.length > 0 ? (
    <div className="ml-4 border-l-2 border-gray-200 pl-4">
      {comments.map(
        (comment, index) =>
          comment.postId === postId && (
            <div
              key={comment._id}
              className="mb-4 p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-start">
                <img
                  src={usersInfo[index]?.imageUrl}
                  alt="User"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h6 className="font-bold">
                      {`${usersInfo[index]?.firstname} ${usersInfo[index]?.lastname}`}
                    </h6>
                    <span className="text-sm text-gray-600">
                      {new Date(comment.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 mb-2 text-sm">{comment.comment}</p>
                  <button
                    className="text-blue-600 text-sm"
                    onClick={() => handleReplyClick(comment._id)}
                  >
                    {showReply[comment._id] ? "Hide Reply" : "Reply"}
                  </button>
                  {showReply[comment._id] && (
                    <div className="mt-2">
                      <textarea
                        className="w-full p-2 border rounded-md"
                        placeholder="Write a reply..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        rows={3}
                      />
                      <div className="mt-1 flex justify-end">
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
                          onClick={() => saveReply(comment._id, reply)}
                        >
                          Reply
                        </button>
                        <button
                          className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md"
                          onClick={() => handleReplyClick(comment._id)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {comment.subComments && comment.subComments.length > 0 && (
                    <CommentsParent
                      comments={comment.subComments}
                      onRefreshComments={onRefreshComments}
                    />
                  )}
                </div>
              </div>
            </div>
          )
      )}
    </div>
  ) : null;
}

export default CommentsParent;
