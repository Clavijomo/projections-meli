import { renderHook } from '@testing-library/react';
import { useProjectionDateRange } from '../useDateRange';
import { mockProjectionData } from '../../__mocks__/mockData';
import type { ProjectionData } from '@/types/data';

describe('useProjectionDateRange', () => {
  it('should return null dates for empty data', () => {
    const { result } = renderHook(() => useProjectionDateRange([]));
    
    expect(result.current.minDate).toBeNull();
    expect(result.current.maxDate).toBeNull();
  });

  it('should calculate correct date range from projection data', () => {
    const { result } = renderHook(() => useProjectionDateRange(mockProjectionData));
    
    // Los datos mock usan formato DD/MM/YYYY: '01/01/2025' y '02/01/2025'
    expect(result.current.minDate?.getFullYear()).toBe(2025);
    expect(result.current.minDate?.getMonth()).toBe(0); // Enero = 0
    expect(result.current.minDate?.getDate()).toBe(1);
    
    expect(result.current.maxDate?.getFullYear()).toBe(2025);
    expect(result.current.maxDate?.getMonth()).toBe(0); // Enero = 0
    expect(result.current.maxDate?.getDate()).toBe(2);
  });

  it('should handle single data point', () => {
    const singleDataPoint: ProjectionData[] = [{
      vertical: 'Retail',
      area: 'Platform',
      initiative: 'Test',
      service: 'Test Service',
      date: '15/06/2025',
      proyected_spend: 1000,
      max_spend: 1200,
      min_spend: 800,
    }];

    const { result } = renderHook(() => useProjectionDateRange(singleDataPoint));
    
    expect(result.current.minDate?.getFullYear()).toBe(2025);
    expect(result.current.minDate?.getMonth()).toBe(5); // Junio = 5
    expect(result.current.minDate?.getDate()).toBe(15);
    
    expect(result.current.maxDate?.getFullYear()).toBe(2025);
    expect(result.current.maxDate?.getMonth()).toBe(5); // Junio = 5
    expect(result.current.maxDate?.getDate()).toBe(15);
  });

  it('should handle data with multiple dates correctly', () => {
    const multiDateData: ProjectionData[] = [
      {
        vertical: 'Retail',
        area: 'Platform',
        initiative: 'Test',
        service: 'Service 1',
        date: '01/01/2025',
        proyected_spend: 1000,
        max_spend: 1200,
        min_spend: 800,
      },
      {
        vertical: 'Fintech',
        area: 'Lending',
        initiative: 'Test',
        service: 'Service 2',
        date: '15/03/2025',
        proyected_spend: 1500,
        max_spend: 1800,
        min_spend: 1200,
      },
      {
        vertical: 'Retail',
        area: 'Delivery',
        initiative: 'Test',
        service: 'Service 3',
        date: '10/02/2025',
        proyected_spend: 800,
        max_spend: 1000,
        min_spend: 600,
      },
    ];

    const { result } = renderHook(() => useProjectionDateRange(multiDateData));
    
    expect(result.current.minDate?.getFullYear()).toBe(2025);
    expect(result.current.minDate?.getMonth()).toBe(0); // Enero = 0
    expect(result.current.minDate?.getDate()).toBe(1);
    
    expect(result.current.maxDate?.getFullYear()).toBe(2025);
    expect(result.current.maxDate?.getMonth()).toBe(2); // Marzo = 2
    expect(result.current.maxDate?.getDate()).toBe(15);
  });

  it('should update when data changes', () => {
    const initialData: ProjectionData[] = [{
      vertical: 'Retail',
      area: 'Platform',
      initiative: 'Test',
      service: 'Service 1',
      date: '01/01/2025',
      proyected_spend: 1000,
      max_spend: 1200,
      min_spend: 800,
    }];

    const updatedData: ProjectionData[] = [
      ...initialData,
      {
        vertical: 'Fintech',
        area: 'Lending',
        initiative: 'Test',
        service: 'Service 2',
        date: '31/12/2025',
        proyected_spend: 1500,
        max_spend: 1800,
        min_spend: 1200,
      },
    ];

    const { result, rerender } = renderHook(
      ({ data }) => useProjectionDateRange(data),
      { initialProps: { data: initialData } }
    );

    expect(result.current.minDate?.getFullYear()).toBe(2025);
    expect(result.current.minDate?.getMonth()).toBe(0); // Enero = 0
    expect(result.current.minDate?.getDate()).toBe(1);
    
    expect(result.current.maxDate?.getFullYear()).toBe(2025);
    expect(result.current.maxDate?.getMonth()).toBe(0); // Enero = 0
    expect(result.current.maxDate?.getDate()).toBe(1);

    rerender({ data: updatedData });

    expect(result.current.minDate?.getFullYear()).toBe(2025);
    expect(result.current.minDate?.getMonth()).toBe(0); // Enero = 0
    expect(result.current.minDate?.getDate()).toBe(1);
    
    expect(result.current.maxDate?.getFullYear()).toBe(2025);
    expect(result.current.maxDate?.getMonth()).toBe(11); // Diciembre = 11
    expect(result.current.maxDate?.getDate()).toBe(31);
  });

  it('should handle invalid date formats gracefully', () => {
    const invalidDateData: ProjectionData[] = [{
      vertical: 'Retail',
      area: 'Platform',
      initiative: 'Test',
      service: 'Service 1',
      date: 'invalid-date',
      proyected_spend: 1000,
      max_spend: 1200,
      min_spend: 800,
    }];

    const { result } = renderHook(() => useProjectionDateRange(invalidDateData));
    
    // Debería manejar fechas inválidas sin romper
    expect(result.current.minDate).toBeDefined();
    expect(result.current.maxDate).toBeDefined();
  });

  it('should memoize results when data does not change', () => {
    const { result, rerender } = renderHook(
      ({ data }) => useProjectionDateRange(data),
      { initialProps: { data: mockProjectionData } }
    );

    const firstResult = result.current;
    
    rerender({ data: mockProjectionData });
    
    const secondResult = result.current;
    
    expect(firstResult).toBe(secondResult);
  });
});
