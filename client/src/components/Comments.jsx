import React, { useState } from "react";
import axios from "axios";
import {
  CommentText,
  CommentMetadata,
  CommentGroup,
  CommentContent,
  CommentAvatar,
  CommentActions,
  CommentAction,
  CommentAuthor,
  Comment,
} from 'semantic-ui-react'
const BASE_URL = import.meta.env.VITE_BASE_URL;

function CommentsParent({ comments = [], postId, onRefreshComments }) {
  const [showReply, setShowReply] = useState({});
  const [reply, setReply] = useState("");
  const userId = window.localStorage.getItem("userId");

  const handleReplyClick = (id) => {
    setShowReply((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const saveReply = async (commentId, fetchReply) => {
    try {
      await axios.post(
        BASE_URL + "/api/post-reply",
        { commentId, postId, userId, fetchReply },
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

  const dateFormatter = (updatedDate) => {
    const date = new Date(updatedDate);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;

  }

  return comments.length > 0 ? (
    <CommentGroup threaded>
      {comments.map(
        (comment) =>
          comment.postId === postId && (
            <Comment>
              <CommentAvatar as='a' src={comment.imageUrl} />
              <CommentContent>
                <CommentAuthor as='a'>{`${comment.firstname} ${comment.lastname}`}</CommentAuthor>
                <CommentMetadata>
                  <div>{dateFormatter(comment.updatedAt)}</div>
                </CommentMetadata>
                <CommentText>{comment.comment}</CommentText>
                <CommentActions>
                  <CommentAction onClick={() => handleReplyClick(comment._id)}>
                    {showReply[comment._id] ? "Hide" : "Reply"}
                    </CommentAction>
                </CommentActions>
              </CommentContent>
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
                <CommentsParent
                  comments={comment.replies}
                  postId={comment.postId}
                  onRefreshComments={onRefreshComments}
                />
            </Comment>
          )
      )}
    </CommentGroup>
  ) : null;
}

export default CommentsParent;
