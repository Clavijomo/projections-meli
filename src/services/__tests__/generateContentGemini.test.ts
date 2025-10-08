import { fetchGetIA } from '../generateContentGemini';
import { mockHistoricalData, mockAIResponse } from '../../__mocks__/mockData';
import type { HistoricalData } from '@/types/data';

const { mockGenerateContent } = require('../../__mocks__/@google/genai.js');

describe('generateContentGemini', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty string for empty data', async () => {
    const result = await fetchGetIA([]);
    expect(result).toBe('');
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it('should generate AI content successfully', async () => {
    mockGenerateContent.mockResolvedValue({
      text: mockAIResponse,
    });

    const result = await fetchGetIA(mockHistoricalData);

    expect(result).toBe(mockAIResponse);
    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-2.0-flash-exp',
      contents: expect.stringContaining('Analiza estos datos de gastos de infraestructura de Mercado Libre'),
    });
  });

  it('should calculate correct statistics in prompt', async () => {
    mockGenerateContent.mockResolvedValue({
      text: mockAIResponse,
    });

    await fetchGetIA(mockHistoricalData);

    const callArgs = mockGenerateContent.mock.calls[0][0];
    const prompt = callArgs.contents;

    expect(prompt).toContain('Total de registros: 3');
    expect(prompt).toContain('Gasto total: $3.690,72');
    expect(prompt).toContain('Gasto promedio: $1.230,24');
    expect(prompt).toContain('Verticales: Retail, Fintech');
  });

  it('should include all required sections in prompt', async () => {
    mockGenerateContent.mockResolvedValue({
      text: mockAIResponse,
    });

    await fetchGetIA(mockHistoricalData);

    const callArgs = mockGenerateContent.mock.calls[0][0];
    const prompt = callArgs.contents;

    expect(prompt).toContain('Analiza estos datos de gastos de infraestructura de Mercado Libre');
    expect(prompt).toContain('DATOS:');
    expect(prompt).toContain('1. Análisis de los gastos');
    expect(prompt).toContain('2. Principales insights');
    expect(prompt).toContain('3. Una recomendación clave');
    expect(prompt).toContain('máximo 3 párrafos');
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'API Error';
    mockGenerateContent.mockRejectedValue(new Error(errorMessage));

    await expect(fetchGetIA(mockHistoricalData)).rejects.toThrow(errorMessage);
  });

  it('should handle empty response from API', async () => {
    mockGenerateContent.mockResolvedValue({
      text: '',
    });

    const result = await fetchGetIA(mockHistoricalData);

    expect(result).toBe('');
  });

  it('should handle undefined text in response', async () => {
    mockGenerateContent.mockResolvedValue({
      text: undefined,
    });

    const result = await fetchGetIA(mockHistoricalData);

    expect(result).toBe('');
  });

  it('should calculate unique verticals correctly', async () => {
    const dataWithDuplicateVerticals: HistoricalData[] = [
      ...mockHistoricalData,
      {
        vertical: 'Retail',
        area: 'Another Area',
        initiative: 'Another Initiative',
        service: 'Another Service',
        date: '04/07/2024',
        spend: 500,
      },
    ];

    mockGenerateContent.mockResolvedValue({
      text: mockAIResponse,
    });

    await fetchGetIA(dataWithDuplicateVerticals);

    const callArgs = mockGenerateContent.mock.calls[0][0];
    const prompt = callArgs.contents;

    expect(prompt).toContain('Verticales: Retail, Fintech');
    expect(prompt).not.toContain('Retail, Retail');
  });

  it('should format large numbers correctly', async () => {
    const largeSpendData: HistoricalData[] = [{
      vertical: 'Retail',
      area: 'Platform',
      initiative: 'Test',
      service: 'Test Service',
      date: '01/01/2024',
      spend: 1234567.89,
    }];

    mockGenerateContent.mockResolvedValue({
      text: mockAIResponse,
    });

    await fetchGetIA(largeSpendData);

    const callArgs = mockGenerateContent.mock.calls[0][0];
    const prompt = callArgs.contents;

    expect(prompt).toContain('1.234.567');
  });

  it('should use correct model configuration', async () => {
    mockGenerateContent.mockResolvedValue({
      text: mockAIResponse,
    });

    await fetchGetIA(mockHistoricalData);

    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-2.0-flash-exp',
      contents: expect.any(String),
    });
  });
});