import { useEffect, useState } from 'react';

export const useDebouncedDates = (startDate?: Date, endDate?: Date) => {
  const [debouncedDates, setDebouncedDates] = useState({ startDate, endDate });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDates({ startDate, endDate });
    }, 300);

    return () => clearTimeout(timer);
  }, [startDate, endDate]);

  return debouncedDates;
};
