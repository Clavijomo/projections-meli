import { renderHook, waitFor } from '@testing-library/react';
import { mockHistoricalData } from '../../__mocks__/mockData';
import { useCsvData } from '../useCsvData';

jest.mock('papaparse', () => ({
  parse: jest.fn(),
}));

const mockPapa = require('papaparse');

describe('useCsvData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty data and loading true', () => {
    mockPapa.parse.mockImplementation(() => {});
    
    const { result } = renderHook(() => useCsvData('/test/path.csv'));
    
    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('should load and parse CSV data successfully', async () => {
    mockPapa.parse.mockImplementation((filepath: string, options: any) => {
      setTimeout(() => {
        options.complete({
          data: mockHistoricalData,
        });
      }, 0);
    });

    const { result } = renderHook(() => useCsvData('/data/historico.csv'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockHistoricalData);
    expect(mockPapa.parse).toHaveBeenCalledWith('/data/historico.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: expect.any(Function),
    });
  });

  it('should filter out empty rows', async () => {
    const dataWithEmptyRows = [
      ...mockHistoricalData,
      { vertical: '', area: '', initiative: '', service: '', date: '', spend: null },
      { vertical: null, area: null, initiative: null, service: null, date: null, spend: null },
    ];

    mockPapa.parse.mockImplementation((filepath: string, options: any) => {
      setTimeout(() => {
        options.complete({
          data: dataWithEmptyRows,
        });
      }, 0);
    });

    const { result } = renderHook(() => useCsvData('/data/test.csv'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockHistoricalData);
    expect(result.current.data).toHaveLength(3);
  });

  it('should handle different file paths', () => {
    const filepath1 = '/data/historico.csv';
    const filepath2 = '/data/proyecciones.csv';

    const { rerender } = renderHook(
      ({ filepath }) => useCsvData(filepath),
      { initialProps: { filepath: filepath1 } }
    );

    expect(mockPapa.parse).toHaveBeenCalledWith(filepath1, expect.any(Object));

    rerender({ filepath: filepath2 });

    expect(mockPapa.parse).toHaveBeenCalledWith(filepath2, expect.any(Object));
  });

  it('should reset loading state when filepath changes', () => {
    mockPapa.parse.mockImplementation(() => {});
    
    const { result, rerender } = renderHook(
      ({ filepath }) => useCsvData(filepath),
      { initialProps: { filepath: '/data/test1.csv' } }
    );

    expect(result.current.loading).toBe(true);

    rerender({ filepath: '/data/test2.csv' });

    expect(result.current.loading).toBe(true);
  });
});
