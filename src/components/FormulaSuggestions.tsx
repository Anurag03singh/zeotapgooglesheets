import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const FORMULA_SUGGESTIONS = [
  { name: 'SUM', description: 'Add up values' },
  { name: 'AVERAGE', description: 'Calculate average of values' },
  { name: 'MAX', description: 'Find maximum value' },
  { name: 'MIN', description: 'Find minimum value' },
  { name: 'COUNT', description: 'Count non-empty cells' },
  { name: 'TRIM', description: 'Remove extra spaces' },
  { name: 'UPPER', description: 'Convert to uppercase' },
  { name: 'LOWER', description: 'Convert to lowercase' },
];

interface FormulaSuggestionsProps {
  searchTerm: string;
  onSelect: (formula: string) => void;
}

export const FormulaSuggestions = ({ searchTerm, onSelect }: FormulaSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<typeof FORMULA_SUGGESTIONS>([]);

  useEffect(() => {
    if (searchTerm.startsWith('=')) {
      const search = searchTerm.slice(1).toLowerCase();
      setSuggestions(
        FORMULA_SUGGESTIONS.filter(formula => 
          formula.name.toLowerCase().includes(search) ||
          formula.description.toLowerCase().includes(search)
        )
      );
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg z-50 mt-1">
      <ScrollArea className="h-[200px]">
        <div className="p-2">
          {suggestions.map((formula) => (
            <Button
              key={formula.name}
              variant="ghost"
              className="w-full justify-start text-left mb-1"
              onClick={() => onSelect(`=${formula.name}(`)}
            >
              <div>
                <div className="font-medium">{formula.name}</div>
                <div className="text-sm text-muted-foreground">{formula.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};