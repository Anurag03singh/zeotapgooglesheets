interface CellProps {
  content: CellData;
  onChange: (value: string) => void;
  onDragStart: () => void;
  onDragEnd: (content: string) => void;
  format: CellData['format'];
  isSelected: boolean;
  onSelect: (event: React.MouseEvent) => void;
}

export const Cell = ({ 
  content, 
  onChange, 
  onDragStart, 
  onDragEnd, 
  format,
  isSelected,
  onSelect 
}: CellProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `cell-${Math.random()}`,
    data: { content },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "cell-content border-r border-b px-2 py-1 min-h-[30px]",
        format?.bold && "font-bold",
        format?.italic && "italic",
        isSelected && "bg-blue-100 outline outline-2 outline-blue-500",
      )}
      style={{
        fontSize: format?.fontSize ? `${format.fontSize}px` : undefined,
        color: format?.color,
      }}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent || "")}
      onDragStart={onDragStart}
      onDragEnd={() => onDragEnd(content.content)}
      onClick={onSelect}
    >
      {content.computedValue || content.content}
    </div>
  );
};