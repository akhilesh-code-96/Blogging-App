import {Comment as CommentModel} from "../models/comment.model.js"

export default async function updateNestedComments(arr, targetId, newComment) {
  // console.log(arr);
  for (let i = 0; i < arr.length; i++) {
    const comment = arr[i];
    const idToBeFound = comment._id.toString();

    // Check if the current comment is the one we need to update
    if (idToBeFound === targetId) {
      try {
        await CommentModel.findOneAndUpdate(
          { _id: targetId },
          { $push: { subComments: newComment } }
        );
        console.log("Comment updated");
      } catch (error) {
        console.error("Failed to update the comment: ", error);
      }
      break;
    }
    // Recursively check subComments
    updateNestedComments(comment.subComments, targetId, newComment);
  }
}
