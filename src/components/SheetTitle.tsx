import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const SheetTitle = () => {
  const [title, setTitle] = useState("My Sheet");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex items-center gap-4 p-2">
      {isEditing ? (
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
          className="w-48"
          autoFocus
        />
      ) : (
        <h1
          onClick={() => setIsEditing(true)}
          className={cn("sheet-title text-xl font-semibold cursor-pointer text-primary")}
        >
          {title}
        </h1>
      )}
    </div>
  );
};