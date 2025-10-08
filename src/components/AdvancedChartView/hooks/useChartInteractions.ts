import { useCallback, useState } from 'react';

export const useChartInteractions = () => {
  const [zoomDomain, setZoomDomain] = useState<{ left?: number, right?: number }>({});
  const [highlightedArea, setHighlightedArea] = useState<{ x1?: number, x2?: number } | null>(null);

  const handleMouseDown = useCallback((e: any) => {
    if (e && e.activeLabel) {
      setHighlightedArea({ x1: e.activeLabel });
    }
  }, []);

  const handleMouseMove = useCallback((e: any) => {
    if (highlightedArea?.x1 && e && e.activeLabel) {
      setHighlightedArea(prev => ({ ...prev, x2: e.activeLabel }));
    }
  }, [highlightedArea]);

  const handleMouseUp = useCallback(() => {
    if (highlightedArea?.x1 && highlightedArea?.x2) {
      const left = Math.min(highlightedArea.x1, highlightedArea.x2);
      const right = Math.max(highlightedArea.x1, highlightedArea.x2);
      setZoomDomain({ left, right });
    }
    setHighlightedArea(null);
  }, [highlightedArea]);

  return {
    zoomDomain,
    highlightedArea,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
