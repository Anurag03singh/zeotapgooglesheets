import { Input } from "@/components/ui/input";

export const FormulaBar = () => {
  return (
    <div className="formula-bar flex items-center px-2 bg-white">
      <div className="text-sm text-muted-foreground w-10">fx</div>
      <Input 
        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Enter formula or value"
      />
    </div>
  );
};