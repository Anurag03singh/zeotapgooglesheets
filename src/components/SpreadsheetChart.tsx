import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { CellData } from '@/utils/cellUtils';

interface SpreadsheetChartProps {
  data: { [key: string]: CellData };
  selectedRange: string[];
}

export const SpreadsheetChart = ({ data, selectedRange }: SpreadsheetChartProps) => {
  const chartData = selectedRange.map((cellKey) => {
    const value = data[cellKey]?.computedValue || data[cellKey]?.content || '';
    return {
      name: cellKey,
      value: typeof value === 'number' ? value : parseFloat(value) || 0,
    };
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          Show Chart
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Data Visualization</DialogTitle>
        </DialogHeader>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};