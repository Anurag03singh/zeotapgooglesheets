import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormulaSuggestions } from "./FormulaSuggestions";

export const FormulaBar = () => {
  const [value, setValue] = useState("");

  const handleFormulaSelect = (formula: string) => {
    setValue(formula);
  };

  return (
    <div className="formula-bar flex items-center px-2 bg-white relative">
      <div className="text-sm text-muted-foreground w-10">fx</div>
      <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Enter formula or value"
      />
      <FormulaSuggestions 
        searchTerm={value} 
        onSelect={handleFormulaSelect}
      />
    </div>
  );
};