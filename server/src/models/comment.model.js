import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    comment: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    firstname: {type: String},
    lastname: {type: String},
    imageUrl: {type: String},
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    referenceId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export { Comment };
