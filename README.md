# MELI Projections Dashboard

React-based dashboard for analyzing Mercado Libre's infrastructure spending data with AI-powered insights.

## Web site
taupe-wisp-27a64c.netlify.app

## Features

- CSV data processing and visualization
- Multiple chart types (Line, Area, Bar, Composed, Pie)
- Interactive data tables with search and filtering
- Date range filtering
- AI analysis with Google Gemini
- Data export (CSV/JSON)
- Responsive Material-UI design

## Tech Stack

- React 18 + TypeScript
- Material-UI + Recharts
- Papa Parse (CSV processing)
- Google Gemini AI
- Vite build tool

## Quick Start

```bash
# Install dependencies
npm install

# Set environment variable
echo "VITE_GEMINI_API_KEY=your_api_key" > .env

# Start development server
npm run dev
```

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom hooks
├── types/              # TypeScript interfaces
└── App.tsx             # Main application
```

## Data Format

Place CSV files in `public/data/`:

**historico.csv**
```csv
vertical,area,initiative,service,date,spend
```

**proyecciones.csv**
```csv
vertical,area,initiative,service,date,proyected_spend,max_spend,min_spend
```

## API Documentation

View the Swagger documentation:
```bash
npm run dev
# Then open: http://localhost:5173/swagger.html
```

## Build

```bash
npm run build
```

## License

MIT