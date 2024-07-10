import mongoose from "mongoose";

const subCommentSchema = mongoose.Schema(
  {
    comment: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subComments: [
      {
        comment: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        subComments: { type: Array },
      },
    ],
  },
  { timestamps: true }
);

const commentSchema = mongoose.Schema(
  {
    comment: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    subComments: [subCommentSchema],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
const SubComment = mongoose.model("SubComment", subCommentSchema);
export { Comment, SubComment };
