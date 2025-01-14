import { useDraggable } from "@dnd-kit/core";
import { useState, useCallback } from "react";
import { CellData, updateDependentCells } from "@/utils/cellUtils";
import { cn } from "@/lib/utils";

const COLUMNS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const ROWS = Array.from({ length: 50 }, (_, i) => i + 1);

interface CellProps {
  content: CellData;
  onChange: (value: string) => void;
  onDragStart: () => void;
  onDragEnd: (content: string) => void;
  format: CellData['format'];
}

const Cell = ({ content, onChange, onDragStart, onDragEnd, format }: CellProps) => {
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
        "cell-content border-r border-b px-2 py-1",
        format?.bold && "font-bold",
        format?.italic && "italic"
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
    >
      {content.computedValue || content.content}
    </div>
  );
};

export const SpreadsheetGrid = () => {
  const [gridData, setGridData] = useState<{ [key: string]: CellData }>({});
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    Object.fromEntries(COLUMNS.map(col => [col, 120]))
  );

  const handleCellChange = useCallback((rowIndex: number, colIndex: number, value: string) => {
    const cellKey = `${COLUMNS[colIndex]}${rowIndex}`;
    const newCellData: CellData = {
      content: value,
      format: gridData[cellKey]?.format || {},
      computedValue: value.startsWith('=') ? undefined : value,
    };

    setGridData(prev => {
      const newData = { ...prev, [cellKey]: newCellData };
      if (value.startsWith('=')) {
        updateDependentCells(cellKey, value, newData, setGridData);
      }
      return newData;
    });
  }, [gridData]);

  const handleColumnResize = useCallback((colIndex: number, newWidth: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [COLUMNS[colIndex]]: Math.max(60, newWidth),
    }));
  }, []);

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
          {COLUMNS.map((col, index) => (
            <div
              key={col}
              className="header-cell border-r border-b text-center py-1 font-medium relative"
              style={{ width: columnWidths[col] }}
            >
              {col}
              <div
                className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary"
                onMouseDown={(e) => {
                  const startX = e.clientX;
                  const startWidth = columnWidths[col];
                  
                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const delta = moveEvent.clientX - startX;
                    handleColumnResize(index, startWidth + delta);
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            </div>
          ))}
        </div>
        {ROWS.map((row) => (
          <div key={row} className="flex">
            <div className="row-header border-r border-b text-center py-1 font-medium">
              {row}
            </div>
            {COLUMNS.map((_, colIndex) => {
              const cellKey = `${COLUMNS[colIndex]}${row}`;
              return (
                <Cell
                  key={colIndex}
                  content={gridData[cellKey] || { content: "", format: {}, computedValue: "" }}
                  onChange={(value) => handleCellChange(row, colIndex, value)}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  format={gridData[cellKey]?.format || {}}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};