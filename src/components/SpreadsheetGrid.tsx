import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";

const COLUMNS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const ROWS = Array.from({ length: 50 }, (_, i) => i + 1);

interface CellProps {
  content: string;
  onChange: (value: string) => void;
  onDragStart: () => void;
  onDragEnd: (content: string) => void;
}

const Cell = ({ content, onChange, onDragStart, onDragEnd }: CellProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `cell-${Math.random()}`,
    data: { content },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cell-content border-r border-b px-2 py-1"
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent || "")}
      onDragStart={onDragStart}
      onDragEnd={() => onDragEnd(content)}
    >
      {content}
    </div>
  );
};

export const SpreadsheetGrid = () => {
  const [gridData, setGridData] = useState<{ [key: string]: string }>({});

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const cellKey = `${rowIndex}-${colIndex}`;
    setGridData((prev) => ({ ...prev, [cellKey]: value }));
  };

  const handleDragStart = () => {
    // Handle drag start
  };

  const handleDragEnd = (content: string) => {
    // Handle drag end
  };

  return (
    <div className="grid-container">
      <div className="inline-block">
        <div className="flex">
          <div className="row-header border-r border-b" />
          {COLUMNS.map((col) => (
            <div key={col} className="header-cell border-r border-b text-center py-1 font-medium">
              {col}
            </div>
          ))}
        </div>
        {ROWS.map((row) => (
          <div key={row} className="flex">
            <div className="row-header border-r border-b text-center py-1 font-medium">
              {row}
            </div>
            {COLUMNS.map((_, colIndex) => (
              <Cell
                key={colIndex}
                content={gridData[`${row}-${colIndex}`] || ""}
                onChange={(value) => handleCellChange(row, colIndex, value)}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};