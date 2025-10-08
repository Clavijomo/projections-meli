# 📊 MELI Projections Dashboard

Dashboard interactivo desarrollado en React para el análisis de datos de gastos de infraestructura de Mercado Libre con insights potenciados por IA.

## ✨ Características Principales

### 📈 Visualización de Datos
- *Múltiples tipos de gráficos*: Línea, Área, Barras, Mixto, Circular
- *Gráficos interactivos* con zoom, animaciones y cuadrícula configurable
- *Estadísticas en tiempo real*: Total, promedio, máximo, mínimo y puntos de datos

### 🔍 Tabla Avanzada
- *Filtrado inteligente* por estado, búsqueda de texto y filtros avanzados
- *Ordenamiento dinámico* por cualquier columna
- *Paginación configurable* (5, 10, 25, 50 registros por página)
- *Vista detallada* de registros individuales

### 🤖 Análisis con IA
- *Integración con Google Gemini* para análisis automático
- *Insights inteligentes* sobre patrones de gasto
- *Recomendaciones* basadas en los datos

### 🎨 Interfaz Moderna
- *Diseño responsive* con Material-UI y Tailwind CSS
- *Tema oscuro* optimizado para análisis de datos
- *Componentes reutilizables* y modulares

## 🛠️ Stack Tecnológico

- *Frontend*: React 18 + TypeScript
- *UI Framework*: Material-UI + Tailwind CSS
- *Gráficos*: Recharts
- *Procesamiento CSV*: Papa Parse
- *IA*: Google Gemini API
- *Build Tool*: Vite
- *Testing*: Jest + Testing Library

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Ejecutar tests
npm test

# Construir para producción
npm run build


## 🏗️ Arquitectura del Proyecto

```
src/
├── components/
│   ├── AdvancedMuiTable/           # Tabla modular
│   │   ├── hooks/                  # Hooks especializados
│   │   │   ├── useTableData.ts     # Transformación de datos
│   │   │   ├── useTableFilters.ts  # Lógica de filtros
│   │   │   ├── useTableSorting.ts  # Lógica de ordenamiento
│   │   │   ├── useTablePagination.ts # Lógica de paginación
│   │   │   └── useTableDialog.ts   # Manejo de diálogos
│   │   ├── components/             # Componentes UI
│   │   │   ├── StatusChip.tsx      # Chip de estado
│   │   │   ├── PriorityChip.tsx    # Chip de prioridad
│   │   │   ├── TableFilters.tsx    # Controles de filtrado
│   │   │   ├── TableHeader.tsx     # Encabezado con ordenamiento
│   │   │   ├── TableRowComponent.tsx # Fila individual
│   │   │   └── ViewDialog.tsx      # Diálogo de detalles
│   │   └── AdvancedMuiTable.tsx    # Componente principal
│   ├── AdvancedChartView/          # Gráficos modulares
│   │   ├── hooks/                  # Hooks especializados
│   │   │   ├── useChartData.ts     # Procesamiento de datos
│   │   │   ├── useChartStats.ts    # Cálculo de estadísticas
│   │   │   ├── useChartControls.ts # Estados de controles
│   │   │   ├── useChartInteractions.ts # Interacciones
│   │   │   └── useDebouncedDates.ts # Debounce de fechas
│   │   └── AdvancedChartView.tsx   # Componente principal
│   ├── ChartControls.tsx           # Controles de gráficos
│   ├── ChartRenderer.tsx           # Renderizador de gráficos
│   ├── ChartView.tsx              # Vista simple de gráficos
│   ├── DateFilter.tsx             # Filtro de fechas
│   └── ErrorBoundary.tsx          # Manejo de errores
├── hooks/                         # Hooks globales
│   ├── useCsvData.ts             # Procesamiento CSV
│   ├── useDateRange.ts           # Manejo de rangos de fecha
│   └── useGenerateContentAI.ts   # Integración con IA
├── services/                     # Servicios externos
│   └── generateContentGemini.ts  # Cliente Gemini AI
├── types/                        # Definiciones TypeScript
│   └── data.ts                   # Interfaces de datos
└── App.tsx                       # Aplicación principal
```

## 🧪 Testing

El proyecto incluye una suite completa de tests:

bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch


*Estado actual*: ✅ 46 tests, 5 suites, 100% éxito


### *historico.csv*
csv
vertical,area,initiative,service,date,spend
Retail,Marketing,Campaign,Analytics,01/01/2024,1500.50


### *proyecciones.csv*
csv
vertical,area,initiative,service,date,proyected_spend,max_spend,min_spend
Retail,IT,Infrastructure,Cloud,01/02/2024,2000.00,2500.00,1500.00


## 🔧 Principios de Desarrollo Aplicados

### ✅ *Responsabilidad Única*
- Cada componente y hook tiene una sola responsabilidad
- Separación clara entre lógica de negocio y presentación
- Módulos especializados y reutilizables

### ✅ *Código Limpio*
- Nombres descriptivos y consistentes
- Funciones pequeñas y enfocadas
- Comentarios donde es necesario

### ✅ *Performance*
- Memoización con useMemo y useCallback
- Debouncing para filtros y búsquedas
- Lazy loading de componentes pesados

### ✅ *Mantenibilidad*
- Estructura modular fácil de extender
- Tests unitarios para cada funcionalidad
- TypeScript para detección temprana de errores

## 📚 Documentación API

Ver la documentación Swagger:
bash
npm run dev
# Luego abrir: http://localhost:5173/swagger.html

## 👨‍💻 Desarrollado por

*Jonathan Clavijo*  

Dashboard desarrollado como prueba técnica para Mercado Libre