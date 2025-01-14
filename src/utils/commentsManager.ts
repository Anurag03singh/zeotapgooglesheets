interface CellComment {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
}

export class CommentsManager {
  private comments: Map<string, CellComment[]> = new Map();

  addComment(cellKey: string, content: string, author: string = 'User') {
    const comment: CellComment = {
      id: crypto.randomUUID(),
      content,
      timestamp: new Date(),
      author
    };

    const cellComments = this.comments.get(cellKey) || [];
    cellComments.push(comment);
    this.comments.set(cellKey, cellComments);
    return comment;
  }

  getComments(cellKey: string): CellComment[] {
    return this.comments.get(cellKey) || [];
  }

  deleteComment(cellKey: string, commentId: string) {
    const cellComments = this.comments.get(cellKey) || [];
    const updatedComments = cellComments.filter(comment => comment.id !== commentId);
    this.comments.set(cellKey, updatedComments);
  }
}

export const commentsManager = new CommentsManager();