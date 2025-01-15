import { useDraggable } from "@dnd-kit/core";
import { useState, useCallback, useEffect } from "react";
import { CellData, updateDependentCells } from "@/utils/cellUtils";
import { cn } from "@/lib/utils";
import { historyManager } from "@/utils/historyManager";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Save, Upload } from "lucide-react";

const COLUMNS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const ROWS = Array.from({ length: 50 }, (_, i) => i + 1);

interface CellProps {
  content: CellData;
  onChange: (value: string) => void;
  onDragStart: () => void;
  onDragEnd: (content: string) => void;
  format: CellData['format'];
  isSelected: boolean;
  onSelect: () => void;
}

const Cell = ({ 
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

export const SpreadsheetGrid = () => {
  const [gridData, setGridData] = useState<{ [key: string]: CellData }>({});
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    Object.fromEntries(COLUMNS.map(col => [col, 120]))
  );
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCellChange = useCallback((rowIndex: number, colIndex: number, value: string) => {
    const cellKey = `${COLUMNS[colIndex]}${rowIndex}`;
    const newCellData: CellData = {
      content: value,
      format: gridData[cellKey]?.format || {},
      computedValue: value.startsWith('=') ? undefined : value,
    };

    historyManager.pushAction({
      type: 'CELL_UPDATE',
      cellKey,
      previousValue: gridData[cellKey],
      newValue: newCellData,
    });

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

  const handleSaveSpreadsheet = () => {
    const spreadsheetData = {
      gridData,
      columnWidths,
    };
    const blob = new Blob([JSON.stringify(spreadsheetData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Spreadsheet Saved",
      description: "Your spreadsheet has been downloaded as JSON",
    });
  };

  const handleLoadSpreadsheet = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { gridData: loadedGridData, columnWidths: loadedColumnWidths } = JSON.parse(content);
        setGridData(loadedGridData);
        setColumnWidths(loadedColumnWidths);
        
        toast({
          title: "Spreadsheet Loaded",
          description: "Your spreadsheet has been successfully loaded",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load spreadsheet file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedCell) return;

    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'c':
          e.preventDefault();
          const copiedData = gridData[selectedCell]?.content || '';
          setClipboard(copiedData);
          toast({
            title: "Copied",
            description: "Cell content copied to clipboard",
          });
          break;
        case 'v':
          e.preventDefault();
          if (clipboard !== null) {
            const [col, ...rowDigits] = selectedCell.split('');
            const row = parseInt(rowDigits.join(''));
            const colIndex = COLUMNS.indexOf(col);
            handleCellChange(row, colIndex, clipboard);
            toast({
              title: "Pasted",
              description: "Content pasted from clipboard",
            });
          }
          break;
        case 'z':
          e.preventDefault();
          const undoAction = historyManager.undo();
          if (undoAction) {
            setGridData(prev => ({
              ...prev,
              [undoAction.cellKey]: undoAction.previousValue || { content: '', format: {}, computedValue: '' }
            }));
            toast({
              title: "Undo",
              description: "Last action undone",
            });
          }
          break;
        case 'y':
          e.preventDefault();
          const redoAction = historyManager.redo();
          if (redoAction) {
            setGridData(prev => ({
              ...prev,
              [redoAction.cellKey]: redoAction.newValue || { content: '', format: {}, computedValue: '' }
            }));
            toast({
              title: "Redo",
              description: "Action redone",
            });
          }
          break;
      }
    }
  }, [selectedCell, clipboard, gridData, handleCellChange, toast]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveSpreadsheet}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Spreadsheet
        </Button>
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleLoadSpreadsheet}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Load Spreadsheet
          </Button>
        </div>
      </div>
      <div className="grid-container">
        <div className="inline-block">
          <div className="flex">
            <div className="row-header w-10 border-r border-b bg-gray-50" />
            {COLUMNS.map((col, index) => (
            <div
              key={col}
              className="header-cell border-r border-b text-center py-1 font-medium bg-gray-50 relative"
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
            <div className="row-header w-10 border-r border-b text-center py-1 font-medium bg-gray-50">
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
                  isSelected={selectedCell === cellKey}
                  onSelect={() => setSelectedCell(cellKey)}
                />
              );
            })}
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};
