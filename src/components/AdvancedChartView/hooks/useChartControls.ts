import { useCallback, useState } from 'react';
import type { ChartType } from '@/types/data';

export const useChartControls = () => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedLines, setSelectedLines] = useState({
    proyected_spend: true,
    max_spend: true,
    min_spend: true,
  });
  const [showAnimations, setShowAnimations] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const handleLineToggle = useCallback((line: keyof typeof selectedLines) => {
    setSelectedLines(prev => ({ ...prev, [line]: !prev[line] }));
  }, []);

  const handleAnimationToggle = useCallback(() => {
    setShowAnimations(!showAnimations);
  }, [showAnimations]);

  const handleGridToggle = useCallback(() => {
    setShowGrid(!showGrid);
  }, [showGrid]);

  return {
    chartType,
    setChartType,
    selectedLines,
    showAnimations,
    showGrid,
    handleLineToggle,
    handleAnimationToggle,
    handleGridToggle
  };
};
