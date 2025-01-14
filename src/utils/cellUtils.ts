type CellDependency = {
  cell: string;
  dependencies: string[];
  value: string;
};

type CellFormat = {
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  color?: string;
};

export type CellData = {
  content: string;
  format: CellFormat;
  computedValue?: string | number;
  dataType?: 'number' | 'text' | 'date' | 'error';
};

// Helper function to get cell value (either computed or raw)
const getCellValue = (cellData: CellData | undefined): number | string => {
  if (!cellData) return 0;
  if (cellData.dataType === 'number') {
    return Number(cellData.computedValue || cellData.content) || 0;
  }
  return cellData.computedValue || cellData.content;
};

// Function to validate and parse cell range (e.g., "A1:B5")
const parseCellRange = (range: string): string[] => {
  const [start, end] = range.split(':');
  if (!start || !end) return [start];

  const startCol = start.match(/[A-Z]+/)?.[0];
  const startRow = parseInt(start.match(/\d+/)?.[0] || '0');
  const endCol = end.match(/[A-Z]+/)?.[0];
  const endRow = parseInt(end.match(/\d+/)?.[0] || '0');

  if (!startCol || !endCol) return [start];

  const cells: string[] = [];
  for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
    for (let row = startRow; row <= endRow; row++) {
      cells.push(`${String.fromCharCode(col)}${row}`);
    }
  }
  return cells;
};

// Spreadsheet Functions
const spreadsheetFunctions: {
  [key: string]: (range: string, getData: (ref: string) => CellData | undefined, ...args: string[]) => number | string;
} = {
  SUM: (range: string, getData: (ref: string) => CellData | undefined): number => {
    const cells = parseCellRange(range);
    return cells.reduce((sum, cell) => {
      const value = Number(getCellValue(getData(cell)));
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
  },

  AVERAGE: (range: string, getData: (ref: string) => CellData | undefined): number => {
    const cells = parseCellRange(range);
    const sum = spreadsheetFunctions.SUM(range, getData);
    return sum / cells.length;
  },

  MAX: (range: string, getData: (ref: string) => CellData | undefined): number => {
    const cells = parseCellRange(range);
    return Math.max(...cells.map(cell => Number(getCellValue(getData(cell))) || -Infinity));
  },

  MIN: (range: string, getData: (ref: string) => CellData | undefined): number => {
    const cells = parseCellRange(range);
    return Math.min(...cells.map(cell => Number(getCellValue(getData(cell))) || Infinity));
  },

  COUNT: (range: string, getData: (ref: string) => CellData | undefined): number => {
    const cells = parseCellRange(range);
    return cells.filter(cell => {
      const value = getCellValue(getData(cell));
      return typeof value === 'number' && !isNaN(value);
    }).length;
  },

  TRIM: (value: string): string => value.trim(),
  
  UPPER: (value: string): string => value.toUpperCase(),
  
  LOWER: (value: string): string => value.toLowerCase(),
  
  REMOVE_DUPLICATES: (range: string, getData: (ref: string) => CellData | undefined): string => {
    const cells = parseCellRange(range);
    const values = cells.map(cell => getCellValue(getData(cell)));
    return [...new Set(values)].join(', ');
  },

  FIND_AND_REPLACE: (text: string, find: string, replace: string): string => {
    return text.replace(new RegExp(find, 'g'), replace);
  }
};

const evaluateFormula = (formula: string, getCellValue: (ref: string) => string | number): number | string => {
  // Remove the = sign
  const expression = formula.substring(1).toUpperCase();
  
  // Check for built-in functions
  for (const [funcName, func] of Object.entries(spreadsheetFunctions)) {
    if (expression.startsWith(funcName + '(')) {
      const params = expression
        .slice(funcName.length + 1, -1)
        .split(',')
        .map(param => param.trim());
      
      try {
        return func(params[0], (ref) => ({ 
          content: String(getCellValue(ref)),
          format: {},
          dataType: 'number',
          computedValue: String(getCellValue(ref))
        }));
      } catch (error) {
        return '#ERROR!';
      }
    }
  }

  // Handle basic arithmetic expressions
  try {
    const evaluatedExpression = expression.replace(/[A-Z]\d+/g, (match) => {
      const value = getCellValue(match);
      return typeof value === 'number' ? value.toString() : '0';
    });
    return new Function(`return ${evaluatedExpression}`)();
  } catch (error) {
    return '#ERROR!';
  }
};

export const validateCellValue = (value: string): { isValid: boolean; dataType: 'number' | 'text' | 'date' | 'error' } => {
  if (value.startsWith('=')) {
    return { isValid: true, dataType: 'text' };
  }

  // Check if it's a number
  if (!isNaN(Number(value)) && value.trim() !== '') {
    return { isValid: true, dataType: 'number' };
  }

  // Check if it's a date
  const date = new Date(value);
  if (date instanceof Date && !isNaN(date.getTime())) {
    return { isValid: true, dataType: 'date' };
  }

  // If none of the above, treat as text
  return { isValid: true, dataType: 'text' };
};

export const updateDependentCells = (
  cellKey: string,
  newValue: string,
  gridData: { [key: string]: CellData },
  setGridData: (data: { [key: string]: CellData }) => void
) => {
  const updatedGrid = { ...gridData };
  const validation = validateCellValue(newValue);

  // Update the current cell
  updatedGrid[cellKey] = {
    ...updatedGrid[cellKey],
    content: newValue,
    dataType: validation.dataType,
    computedValue: validation.dataType === 'number' ? Number(newValue) : newValue
  };

  // Update dependent cells
  const dependentCells = Object.entries(gridData).filter(([_, cell]) => 
    cell.content.startsWith('=') && cell.content.includes(cellKey)
  );

  dependentCells.forEach(([key, cell]) => {
    const computedValue = evaluateFormula(cell.content, (ref) => {
      const cellValue = updatedGrid[ref]?.computedValue;
      return typeof cellValue === 'number' ? cellValue : 0;
    });

    updatedGrid[key] = {
      ...cell,
      computedValue
    };
  });

  setGridData(updatedGrid);
};