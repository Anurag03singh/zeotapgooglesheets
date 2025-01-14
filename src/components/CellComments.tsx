import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { MessageCircle, Trash2 } from "lucide-react";
import { commentsManager } from "@/utils/commentsManager";
import { useState } from "react";
import { Input } from "./ui/input";

interface CellCommentsProps {
  cellKey: string;
}

export const CellComments = ({ cellKey }: CellCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(() => commentsManager.getComments(cellKey));

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    commentsManager.addComment(cellKey, newComment);
    setComments(commentsManager.getComments(cellKey));
    setNewComment("");
  };

  const handleDeleteComment = (commentId: string) => {
    commentsManager.deleteComment(cellKey, commentId);
    setComments(commentsManager.getComments(cellKey));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="font-medium">Comments</h3>
      </div>
      
      <div className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button onClick={handleAddComment}>Add</Button>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="text-sm">{comment.content}</p>
                <p className="text-xs text-muted-foreground">
                  {comment.author} - {new Date(comment.timestamp).toLocaleString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteComment(comment.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};