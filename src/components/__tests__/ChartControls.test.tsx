import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChartControls } from '../ChartControls';
import type { ChartType } from '@/types/data';

describe('ChartControls', () => {
  const mockOnChartTypeChange = jest.fn();
  const mockOnLineToggle = jest.fn();
  const mockOnAnimationToggle = jest.fn();
  const mockOnGridToggle = jest.fn();
  const mockOnZoomReset = jest.fn();

  const defaultProps = {
    chartType: 'line' as ChartType,
    onChartTypeChange: mockOnChartTypeChange,
    selectedLines: {
      proyected_spend: true,
      max_spend: true,
      min_spend: false,
    },
    onLineToggle: mockOnLineToggle,
    showAnimations: true,
    onAnimationToggle: mockOnAnimationToggle,
    showGrid: true,
    onGridToggle: mockOnGridToggle,
    onZoomReset: mockOnZoomReset,
    stats: {
      total: 1000,
      average: 500,
      max: 800,
      min: 200,
      dataPoints: 10,
    },
    aggregatedData: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all chart type options', () => {
    render(<ChartControls {...defaultProps} />);

    expect(screen.getByText('Línea')).toBeInTheDocument();
    expect(screen.getByText('Área')).toBeInTheDocument();
    expect(screen.getByText('Barras')).toBeInTheDocument();
    expect(screen.getByText('Mixto')).toBeInTheDocument();
    expect(screen.getByText('Circular')).toBeInTheDocument();
  });

  it('should highlight selected chart type', () => {
    render(<ChartControls {...defaultProps} chartType="area" />);

    const areaButton = screen.getByText('Área');
    expect(areaButton.closest('button')).toHaveClass('bg-zinc-500');
  });

  it('should call onChartTypeChange when chart type is selected', async () => {
    const user = userEvent.setup();
    
    render(<ChartControls {...defaultProps} />);

    const barButton = screen.getByText('Barras');
    await user.click(barButton);

    expect(mockOnChartTypeChange).toHaveBeenCalledWith('bar');
  });

  it('should render line toggle switches', () => {
    render(<ChartControls {...defaultProps} />);

    expect(screen.getByRole('checkbox', { name: /proyectado/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /máximo/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /mínimo/i })).toBeInTheDocument();
  });

  it('should show correct switch states for selected lines', () => {
    render(<ChartControls {...defaultProps} />);

    const proyectedSwitch = screen.getByRole('checkbox', { name: /proyectado/i });
    const maxSwitch = screen.getByRole('checkbox', { name: /máximo/i });
    const minSwitch = screen.getByRole('checkbox', { name: /mínimo/i });

    expect(proyectedSwitch).toBeChecked();
    expect(maxSwitch).toBeChecked();
    expect(minSwitch).not.toBeChecked();
  });

  it('should call onLineToggle when line switch is toggled', async () => {
    const user = userEvent.setup();
    
    render(<ChartControls {...defaultProps} />);

    const minSwitch = screen.getByRole('checkbox', { name: /mínimo/i });
    await user.click(minSwitch);

    expect(mockOnLineToggle).toHaveBeenCalledWith('min_spend');
  });

  it('should render animation toggle', () => {
    render(<ChartControls {...defaultProps} />);

    expect(screen.getByText('Animación')).toBeInTheDocument();
    const animationSwitch = screen.getByRole('checkbox', { name: /animaciones/i });
    expect(animationSwitch).toBeChecked();
  });

  it('should call onAnimationToggle when animation switch is toggled', async () => {
    const user = userEvent.setup();
    
    render(<ChartControls {...defaultProps} />);

    const animationSwitch = screen.getByRole('checkbox', { name: /animaciones/i });
    await user.click(animationSwitch);

    expect(mockOnAnimationToggle).toHaveBeenCalled();
  });

  it('should render grid toggle', () => {
    render(<ChartControls {...defaultProps} />);

    expect(screen.getByText('Cuadrícula')).toBeInTheDocument();
    const gridSwitch = screen.getByRole('checkbox', { name: /cuadrícula/i });
    expect(gridSwitch).toBeChecked();
  });

  it('should call onGridToggle when grid switch is toggled', async () => {
    const user = userEvent.setup();
    
    render(<ChartControls {...defaultProps} />);

    const gridSwitch = screen.getByRole('checkbox', { name: /cuadrícula/i });
    await user.click(gridSwitch);

    expect(mockOnGridToggle).toHaveBeenCalled();
  });

  it('should render zoom reset button', () => {
    render(<ChartControls {...defaultProps} />);

    expect(screen.getByText('Resetear Zoom')).toBeInTheDocument();
  });

  it('should call onZoomReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<ChartControls {...defaultProps} />);

    const resetButton = screen.getByText('Resetear Zoom');
    await user.click(resetButton);

    expect(mockOnZoomReset).toHaveBeenCalled();
  });

  it('should handle all chart types correctly', async () => {
    const user = userEvent.setup();
    const chartTypes: ChartType[] = ['line', 'area', 'bar', 'composed', 'pie'];
    
    render(<ChartControls {...defaultProps} />);

    for (const chartType of chartTypes) {
      const button = screen.getByText(
        chartType === 'line' ? 'Línea' :
        chartType === 'area' ? 'Área' :
        chartType === 'bar' ? 'Barras' :
        chartType === 'composed' ? 'Mixto' : 'Circular'
      );
      
      await user.click(button);
      expect(mockOnChartTypeChange).toHaveBeenCalledWith(chartType);
    }
  });

  it('should handle disabled animation state', () => {
    render(<ChartControls {...defaultProps} showAnimations={false} />);

    const animationSwitch = screen.getByRole('checkbox', { name: /animaciones/i });
    expect(animationSwitch).not.toBeChecked();
  });

  it('should handle disabled grid state', () => {
    render(<ChartControls {...defaultProps} showGrid={false} />);

    const gridSwitch = screen.getByRole('checkbox', { name: /cuadrícula/i });
    expect(gridSwitch).not.toBeChecked();
  });

  it('should handle all lines disabled', () => {
    const allLinesDisabled = {
      proyected_spend: false,
      max_spend: false,
      min_spend: false,
    };

    render(<ChartControls {...defaultProps} selectedLines={allLinesDisabled} />);

    const proyectedSwitch = screen.getByRole('checkbox', { name: /proyectado/i });
    const maxSwitch = screen.getByRole('checkbox', { name: /máximo/i });
    const minSwitch = screen.getByRole('checkbox', { name: /mínimo/i });

    expect(proyectedSwitch).not.toBeChecked();
    expect(maxSwitch).not.toBeChecked();
    expect(minSwitch).not.toBeChecked();
  });

  it('should have proper accessibility attributes', () => {
    render(<ChartControls {...defaultProps} />);

    // Verificar que los switches tienen labels apropiados
    expect(screen.getByRole('checkbox', { name: /proyectado/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /máximo/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /mínimo/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /animaciones/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /cuadrícula/i })).toBeInTheDocument();
  });
});
