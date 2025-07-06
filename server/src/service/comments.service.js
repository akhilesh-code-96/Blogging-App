export default class CommentsService {

    modifyComment(comments) {
        const commentMap = {};
        let rootComments = [];
  
        // Step 1: Map comments by ID and initialize replies
        comments.forEach(comment => {
            comment.replies = [];
            commentMap[comment._id] = comment;
        });
    
        // Step 2: Nest replies under their parent
        comments.forEach(comment => {
            if (comment.referenceId) {
                const parent = commentMap[comment.referenceId];
                if (parent) {
                    parent.replies.push(comment);
                } else {
                    console.warn("Parent not found for:", comment._id);
                }
            }
        });
        
        // 3. Remove those who has referenceIds
        rootComments = comments.filter(comment => !comment.referenceId)

        return rootComments;
    }
  }
  