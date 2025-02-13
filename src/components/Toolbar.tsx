import { Button } from "@/components/ui/button";
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  Plus, Minus, Undo, Redo, MoreHorizontal, MessageCircle 
} from "lucide-react";
import { useCallback } from "react";
import { historyManager } from "@/utils/historyManager";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ToolbarProps {
  onFormat?: (format: { type: string; value: any }) => void;
  onAddRow?: () => void;
  onDeleteRow?: () => void;
  onAddColumn?: () => void;
  onDeleteColumn?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onViewComments?: () => void;
}

export const Toolbar = ({ 
  onFormat, 
  onAddRow, 
  onDeleteRow, 
  onAddColumn, 
  onDeleteColumn,
  onUndo,
  onRedo,
  onViewComments 
}: ToolbarProps) => {
  const handleFormat = useCallback((type: string, value: any) => {
    onFormat?.({ type, value });
  }, [onFormat]);

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={onUndo}
        disabled={!historyManager.canUndo()}
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={onRedo}
        disabled={!historyManager.canRedo()}
      >
        <Redo className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => handleFormat("bold", true)}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => handleFormat("italic", true)}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => handleFormat("underline", true)}
      >
        <Underline className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => handleFormat("align", "left")}
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => handleFormat("align", "center")}
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => handleFormat("align", "right")}
      >
        <AlignRight className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={onAddRow}
      >
        <Plus className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={onDeleteRow}
      >
        <Minus className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={onViewComments}
      >
        <MessageCircle className="w-4 h-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onViewComments}>
            View Comments
          </DropdownMenuItem>
          <DropdownMenuItem>
            Create Filter
          </DropdownMenuItem>
          <DropdownMenuItem>
            Details
          </DropdownMenuItem>
          <DropdownMenuItem>
            Help
          </DropdownMenuItem>
          <DropdownMenuItem>
            Feedback
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
