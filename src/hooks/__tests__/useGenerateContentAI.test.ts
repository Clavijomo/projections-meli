import { renderHook, act, waitFor } from '@testing-library/react';
import { useGetIAContent } from '../useGenerateContentAI';
import { mockHistoricalData, mockAIResponse } from '../../__mocks__/mockData';
import * as generateContentGemini from '../../services/generateContentGemini';

// Mock del servicio de Gemini
jest.mock('../../services/generateContentGemini');
const mockFetchGetIA = generateContentGemini.fetchGetIA as jest.MockedFunction<typeof generateContentGemini.fetchGetIA>;

describe('useGetIAContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useGetIAContent());
    
    expect(result.current.aiAnalysis).toBe('');
    expect(result.current.aiLoading).toBe(false);
    expect(typeof result.current.getAnalysis).toBe('function');
  });

  it('should generate AI analysis successfully', async () => {
    mockFetchGetIA.mockResolvedValue(mockAIResponse);

    const { result } = renderHook(() => useGetIAContent());

    await act(async () => {
      await result.current.getAnalysis(mockHistoricalData);
    });

    await waitFor(() => {
      expect(result.current.aiLoading).toBe(false);
    });

    expect(result.current.aiAnalysis).toBe(mockAIResponse);
    expect(mockFetchGetIA).toHaveBeenCalledWith(mockHistoricalData);
  });

  it('should handle loading state correctly', async () => {
    mockFetchGetIA.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockAIResponse), 100))
    );

    const { result } = renderHook(() => useGetIAContent());

    act(() => {
      result.current.getAnalysis(mockHistoricalData);
    });

    expect(result.current.aiLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.aiLoading).toBe(false);
    });

    expect(result.current.aiAnalysis).toBe(mockAIResponse);
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'API Error';
    mockFetchGetIA.mockRejectedValue(new Error(errorMessage));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useGetIAContent());

    await act(async () => {
      await result.current.getAnalysis(mockHistoricalData);
    });

    await waitFor(() => {
      expect(result.current.aiLoading).toBe(false);
    });

    expect(result.current.aiAnalysis).toBe('Error al generar análisis. Por favor, intenta nuevamente.');
    expect(consoleSpy).toHaveBeenCalledWith('Error en análisis de IA:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('should not call API with empty data', async () => {
    const { result } = renderHook(() => useGetIAContent());

    await act(async () => {
      await result.current.getAnalysis([]);
    });

    expect(mockFetchGetIA).not.toHaveBeenCalled();
    expect(result.current.aiLoading).toBe(false);
    expect(result.current.aiAnalysis).toBe('');
  });

  it('should handle multiple consecutive calls', async () => {
    mockFetchGetIA
      .mockResolvedValueOnce('First response')
      .mockResolvedValueOnce('Second response');

    const { result } = renderHook(() => useGetIAContent());

    // Primera llamada
    await act(async () => {
      await result.current.getAnalysis(mockHistoricalData);
    });

    await waitFor(() => {
      expect(result.current.aiAnalysis).toBe('First response');
    });

    // Segunda llamada
    await act(async () => {
      await result.current.getAnalysis(mockHistoricalData);
    });

    await waitFor(() => {
      expect(result.current.aiAnalysis).toBe('Second response');
    });

    expect(mockFetchGetIA).toHaveBeenCalledTimes(2);
  });

  it('should reset loading state even if API call fails', async () => {
    mockFetchGetIA.mockRejectedValue(new Error('Network error'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useGetIAContent());

    await act(async () => {
      await result.current.getAnalysis(mockHistoricalData);
    });

    await waitFor(() => {
      expect(result.current.aiLoading).toBe(false);
    });

    expect(result.current.aiLoading).toBe(false);
  });
});
