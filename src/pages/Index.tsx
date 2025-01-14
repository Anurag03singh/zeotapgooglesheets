import { DndContext } from "@dnd-kit/core";
import { Toolbar } from "@/components/Toolbar";
import { FormulaBar } from "@/components/FormulaBar";
import { SheetTitle } from "@/components/SheetTitle";
import { SpreadsheetGrid } from "@/components/SpreadsheetGrid";

const Index = () => {
  return (
    <DndContext>
      <div className="min-h-screen flex flex-col">
        <SheetTitle />
        <Toolbar />
        <FormulaBar />
        <SpreadsheetGrid />
      </div>
    </DndContext>
  );
};

export default Index;