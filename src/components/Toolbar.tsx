import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export const Toolbar = () => {
  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <Button variant="ghost" size="icon" className="w-8 h-8">
        <Bold className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="w-8 h-8">
        <Italic className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="w-8 h-8">
        <Underline className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button variant="ghost" size="icon" className="w-8 h-8">
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="w-8 h-8">
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="w-8 h-8">
        <AlignRight className="w-4 h-4" />
      </Button>
    </div>
  );
};