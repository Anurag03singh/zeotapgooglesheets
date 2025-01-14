import { CellData } from "./cellUtils";

export interface HistoryAction {
  type: 'CELL_UPDATE' | 'FORMAT_UPDATE' | 'COMMENT_ADD' | 'COMMENT_DELETE';
  cellKey: string;
  previousValue?: CellData;
  newValue?: CellData;
  comment?: string;
}

export class HistoryManager {
  private undoStack: HistoryAction[] = [];
  private redoStack: HistoryAction[] = [];

  pushAction(action: HistoryAction) {
    this.undoStack.push(action);
    this.redoStack = []; // Clear redo stack when new action is performed
  }

  undo(): HistoryAction | undefined {
    const action = this.undoStack.pop();
    if (action) {
      this.redoStack.push(action);
    }
    return action;
  }

  redo(): HistoryAction | undefined {
    const action = this.redoStack.pop();
    if (action) {
      this.undoStack.push(action);
    }
    return action;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}

export const historyManager = new HistoryManager();