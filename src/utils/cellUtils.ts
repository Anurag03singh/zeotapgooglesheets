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
};

const evaluateFormula = (formula: string, getCellValue: (ref: string) => string | number): number => {
  // Remove the = sign and evaluate the formula
  const expression = formula.substring(1);
  
  // Replace cell references (e.g., A1, B2) with their values
  const evaluatedExpression = expression.replace(/[A-Z]\d+/g, (match) => {
    const value = getCellValue(match);
    return typeof value === 'number' ? value.toString() : '0';
  });

  try {
    // Using Function instead of eval for better security
    return new Function(`return ${evaluatedExpression}`)();
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return 0;
  }
};

export const updateDependentCells = (
  cellKey: string,
  newValue: string,
  gridData: { [key: string]: CellData },
  setGridData: (data: { [key: string]: CellData }) => void
) => {
  const updatedGrid = { ...gridData };
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
      computedValue,
    };
  });

  setGridData(updatedGrid);
};