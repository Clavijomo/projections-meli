import { useCallback } from 'react';

interface DateFilterProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label: string;
  minDate?: Date | null;
  maxDate?: Date | null;
}

export function DateFilter({ date, setDate, label, minDate, maxDate }: DateFilterProps) {

  const handleDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value) {
      try {
        const newDate = new Date(value);

        if (isNaN(newDate.getTime())) {
          console.warn('Fecha inválida:', value);
          return;
        }

        if (minDate && newDate < minDate) {
          console.warn('Fecha menor al mínimo permitido:', newDate, 'Min:', minDate);
          return;
        }

        if (maxDate && newDate > maxDate) {
          console.warn('Fecha mayor al máximo permitido:', newDate, 'Max:', maxDate);
          return;
        }

        setDate(newDate);
      } catch (error) {
        console.error('Error al parsear fecha:', error);
      }
    } else {
      setDate(undefined);
    }
  }, [setDate, minDate, maxDate]);

  const handleClear = useCallback(() => {
    setDate(undefined);
  }, [setDate]);

  const formatDateForInput = (date: Date | null | undefined): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (date: Date | null | undefined): string => {
    if (!date) return 'No definida';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className='p-4 rounded-2xl bg-zinc-900 shadow-md mt-10'>
      <div className='flex items-center justify-between mb-3'>
        <label className='text-sm font-semibold'>
          {label}
        </label>

        {minDate && maxDate && (
          <div className='text-sm text-zinc-300'>
            Rango disponible: {formatDateForDisplay(minDate)} - {formatDateForDisplay(maxDate)}
          </div>
        )}
      </div>

      <div className='flex gap-3 items-center'>
        <input
          type="date"
          value={formatDateForInput(date)}
          onChange={handleDateChange}   
          min={formatDateForInput(minDate)}
          max={formatDateForInput(maxDate)}
          className='p-2 border border-zinc-400 rounded-md text-sm flex-1'          
        />

        <button
          onClick={handleClear}
          type="button"
          className='p-2 text-sm cursor-pointer'
        >
          Limpiar
        </button>
      </div>

      <div className='text-xs text-zinc-300 mt-3'>
        Fecha seleccionada: {formatDateForDisplay(date)}
      </div>
    </div>
  );
}
