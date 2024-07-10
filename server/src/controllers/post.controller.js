import PostModel from "../models/post.model.js";
import UserModel from "../models/user.model.js";
import {
  Comment as CommentModel,
  SubComment as SubCommentModel,
} from "../models/comment.model.js";
import updateNestedComments from "../utils/nestedComments.js";

export default class PostController {
  async getPost(req, res) {
    try {
      const post = await PostModel.find();
      res.status(200).json({ allPosts: post });
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while retrieving posts.", error });
    }
  }

  async newPost(req, res) {
    const { input, email } = req.body;
    const user = await UserModel.findOne({ email });
    try {
      const record = new PostModel({
        category: input.category,
        title: input.title,
        description: input.description,
        name: `${user.firstname} ${user.lastname}`,
        role: user.role,
        imageUrl: user.imageUrl,
        email: user.email,
      });

      await record.save();
      res.status(200).json({ message: "Post created successfully" });
    } catch (error) {
      res
        .status(501)
        .json({ error: "Failed to create a new post", details: error.message });
    }
  }

  async updateBlog(req, res) {
    const { uid, input } = req.body;
    try {
      await PostModel.updateOne(
        { _id: uid },
        {
          $set: {
            title: input.title,
            description: input.description,
            category: input.category,
          },
        }
      );
      res.status(200).json({ message: "Blog post updated successfully" });
    } catch (error) {
      console.error("Failed to update the blog post with error: ", error);
    }
  }

  async deleteBlog(req, res) {
    const { uid } = req.body;
    try {
      await PostModel.deleteOne({ _id: uid });
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(501).json({ message: "Failed to delete the post" });
    }
  }

  async accountPost(req, res) {
    const { email } = req.body;
    try {
      const posts = await PostModel.find({ email });
      res.status(200).json({ blogs: posts });
    } catch (error) {
      res.status(401).json({ message: "Failed to fetch the posts" });
    }
  }

  async updateLikes(req, res) {
    const { postId, userId } = req.body;
    // console.log(userId);
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      // console.log(post);
      if (post.likedBy.includes(userId)) {
        return res
          .status(400)
          .json({ message: "You have already liked this post" });
      }

      post.likes += 1;
      post.likedBy.push(userId);
      await post.save();
      res.status(200).json({ message: "Likes updated successfully" });
    } catch (error) {
      res.status(501).json({ message: "Failed update the likes" });
    }
  }

  async updateComments(req, res) {
    const { postId, userId, commentInput } = req.body;
    try {
      const record = new CommentModel({
        comment: commentInput,
        userId: userId,
        postId: postId,
      });
      record.save();
      res.status(200).json({ message: "Comment updated successfully" });
    } catch (error) {
      res.status(501).json({ message: "Failed to update the comment" });
      console.error(error);
    }
    // console.log(req.body);
  }

  async getComments(req, res) {
    try {
      const getComments = await CommentModel.find();
      res.status(200).json({ getComments });
    } catch (error) {
      res.status(404).json({ message: "Failed to fetch the comments" });
    }
  }

  async updateReplies(req, res) {
    const { commentId, userId, fetchReply } = req.body;
    // console.log(req.body);

    try {
      const newSubComment = new SubCommentModel({
        comment: fetchReply,
        userId,
        subComments: [], // Initialize with an empty array for nested sub-comments
      });

      const result = await newSubComment.save();

      const allComments = await CommentModel.find();
      const updated = await updateNestedComments(allComments, commentId, result);

      if (updated) {
        await Promise.all(
          allComments.map((comment) =>
            CommentModel.findByIdAndUpdate(comment._id, comment)
          )
        );
      }
      res.status(200).json({ allComments });
    } catch (error) {
      console.error("Failed to update comment:", error);
      res.status(500).json({ message: "Failed to update comment", error });
    }
  }
}
