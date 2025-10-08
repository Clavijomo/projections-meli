# Guía de Testing - MELI Projections Dashboard

## 🧪 Configuración de Testing

Este proyecto utiliza **Jest** y **React Testing Library** siguiendo las mejores prácticas para testing en React con TypeScript.

### Stack de Testing

- **Jest**: Framework de testing principal
- **React Testing Library**: Utilidades para testing de componentes React
- **@testing-library/user-event**: Simulación de interacciones de usuario
- **@testing-library/jest-dom**: Matchers adicionales para Jest
- **ts-jest**: Soporte para TypeScript en Jest

## 📁 Estructura de Tests

```
src/
├── __mocks__/              # Mocks globales y datos de prueba
│   └── mockData.ts         # Datos mock para tests
├── __tests__/              # Tests principales
│   ├── utils/              # Utilidades de testing
│   │   └── testUtils.tsx   # Configuración de render personalizada
│   └── App.test.tsx        # Tests del componente principal
├── components/__tests__/   # Tests de componentes
├── hooks/__tests__/        # Tests de custom hooks
├── services/__tests__/     # Tests de servicios
└── setupTests.ts          # Configuración global de tests
```

## 🚀 Scripts de Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests para CI/CD
npm run test:ci
```

## 📋 Tipos de Tests Implementados

### 1. **Tests de Custom Hooks**
- `useCsvData.test.ts`: Testing de carga y procesamiento de datos CSV
- `useGenerateContentAI.test.ts`: Testing de integración con IA
- `useDateRange.test.ts`: Testing de cálculo de rangos de fechas

### 2. **Tests de Componentes**
- `App.test.tsx`: Testing del componente principal
- `ErrorBoundary.test.tsx`: Testing de manejo de errores
- `DateFilter.test.tsx`: Testing de filtros de fecha
- `ChartControls.test.tsx`: Testing de controles de gráficos

### 3. **Tests de Servicios**
- `generateContentGemini.test.ts`: Testing de integración con Google Gemini

## 🛠️ Mejores Prácticas Implementadas

### 1. **Configuración de Testing Environment**
```typescript
// setupTests.ts - Configuración global
import '@testing-library/jest-dom';

// Mocks para APIs del navegador
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    // ... más configuración
  })),
});
```

### 2. **Custom Render con Providers**
```typescript
// testUtils.tsx - Render personalizado
const AllTheProviders = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

const customRender = (ui, options) => 
  render(ui, { wrapper: AllTheProviders, ...options });
```

### 3. **Mocking de Dependencias**
```typescript
// Mock de servicios externos
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: { generateContent: jest.fn() }
  }))
}));

// Mock de hooks personalizados
jest.mock('../hooks/useCsvData');
const mockUseCsvData = useCsvData.useCsvData as jest.MockedFunction<typeof useCsvData.useCsvData>;
```

### 4. **Testing de Estados Asíncronos**
```typescript
// Testing de loading states
it('should handle loading state correctly', async () => {
  mockFetchGetIA.mockImplementation(() => 
    new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
  );

  const { result } = renderHook(() => useGetIAContent());
  
  act(() => {
    result.current.getAnalysis(mockData);
  });

  expect(result.current.aiLoading).toBe(true);

  await waitFor(() => {
    expect(result.current.aiLoading).toBe(false);
  });
});
```

### 5. **Testing de Interacciones de Usuario**
```typescript
// Testing con user-event
it('should call handler when button is clicked', async () => {
  const user = userEvent.setup();
  const mockHandler = jest.fn();
  
  render(<Button onClick={mockHandler}>Click me</Button>);
  
  await user.click(screen.getByRole('button'));
  
  expect(mockHandler).toHaveBeenCalled();
});
```

## 📊 Coverage Goals

El proyecto está configurado con los siguientes umbrales de coverage:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🔧 Configuración de Jest

```javascript
// jest.config.cjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // ... más configuración
};
```

## 🎯 Estrategias de Testing

### 1. **Testing de Componentes**
- Render del componente con props necesarias
- Verificación de elementos en el DOM
- Testing de interacciones de usuario
- Testing de estados condicionales

### 2. **Testing de Hooks**
- Uso de `renderHook` para testing aislado
- Testing de valores de retorno
- Testing de efectos secundarios
- Testing de dependencias

### 3. **Testing de Servicios**
- Mocking de APIs externas
- Testing de manejo de errores
- Testing de transformación de datos
- Testing de casos edge

## 🚨 Manejo de Errores en Tests

```typescript
// Suprimir console.error durante tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});
```

## 📝 Convenciones de Naming

- **Archivos de test**: `*.test.ts` o `*.test.tsx`
- **Describe blocks**: Nombre del componente/hook/servicio
- **Test cases**: Descripción clara del comportamiento esperado
- **Mocks**: Prefijo `mock` + nombre descriptivo

## 🔍 Debugging Tests

```bash
# Ejecutar un test específico
npm test -- --testNamePattern="should render correctly"

# Ejecutar tests de un archivo específico
npm test -- src/components/__tests__/App.test.tsx

# Ejecutar con más información de debug
npm test -- --verbose --no-cache
```

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
