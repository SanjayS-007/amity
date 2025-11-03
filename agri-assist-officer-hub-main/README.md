# AgriAssist - Officer Portal

## Project Overview

AgriAssist Officer Portal is an AI & IoT-Based Smart Agriculture Management System designed for government and agricultural officers to monitor, assist, and analyze farmers in their zones.

## Getting Started

### Prerequisites

Ensure you have Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Development Setup

Follow these steps to run the project locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd agri-assist-officer-hub-main

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev

```

The application will be available at `http://localhost:8080` (or the next available port if 8080 is occupied).

## Tech Stack

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Backend services
- **Recharts** - Data visualization

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Current Features

- Dashboard with zone overview metrics
- Farmer management gallery with filters
- Consultation tracking with tabbed status views
- Alert composition and broadcast history
- Crop health visualisations
- Weather snapshot via widget

## Navigation & Page Directory

All primary navigation links are declared in `src/components/layout/Sidebar.tsx`. Each page reuses the shared `Sidebar` and `TopBar` layout wrappers. To extend a section, edit the referenced page component and, if needed, register a new route inside `src/App.tsx`.

### Dashboard

- **Route**: `/`
- **Entry point**: `src/pages/Index.tsx`
- **Key building blocks**: `StatsCard`, `CropHealthChart`, `WeatherWidget`, recent activity feed (`Card` component)
- **How to access**: Run `npm run dev` and visit `http://localhost:8080/`

### Farmers

- **Route**: `/farmers`
- **Entry point**: `src/pages/Farmers.tsx`
- **Key building blocks**: `FarmerCard` grid, filter controls (`Input`, `Select`), add farmer action (`Button`)
- **How to access**: Use the sidebar "Farmers" link or go directly to `http://localhost:8080/farmers`

### Consultations

- **Route**: `/consultations`
- **Entry point**: `src/pages/Consultations.tsx`
- **Key building blocks**: `ConsultationCard`, status `Tabs`, search input (`Input`)
- **How to access**: Sidebar shortcut or `http://localhost:8080/consultations`

### Alerts

- **Route**: `/alerts`
- **Entry point**: `src/pages/Alerts.tsx`
- **Key building blocks**: Alert KPI cards, alert history list, alert composer form (React Hook Form + `useToast` + `createAlert` helper)
- **How to access**: Sidebar shortcut or `http://localhost:8080/alerts`

### Pest & Disease *(in progress)*

- **Configured path**: `/pest-disease`
- **Current behaviour**: Falls back to the catch-all route (`src/pages/NotFound.tsx`)
- **Where to build features**: Create a page (e.g., `src/pages/PestDisease.tsx`), add a `<Route path="/pest-disease" ...>` entry in `src/App.tsx`, then reuse chart or alert components as needed

### Market & Schemes *(in progress)*

- **Configured path**: `/market`
- **Current behaviour**: Falls back to `NotFound`
- **Where to build features**: Add a dedicated page under `src/pages/` and register it in `src/App.tsx`

### Analytics *(in progress)*

- **Configured path**: `/analytics`
- **Current behaviour**: Falls back to `NotFound`
- **Where to build features**: Create analytics visualisations under a new page component and register the route

### Communication *(in progress)*

- **Configured path**: `/communication`
- **Current behaviour**: Falls back to `NotFound`
- **Where to build features**: Implement messaging/broadcast tools in a new page and register the route

### Settings *(in progress)*

- **Configured path**: `/settings`
- **Current behaviour**: Falls back to `NotFound`
- **Where to build features**: Create configuration UI in a dedicated page and register the route

### Not Found

- **Route**: `*`
- **Entry point**: `src/pages/NotFound.tsx`
- **Purpose**: Handles every path without a dedicated page; currently displayed for the in-progress navigation items listed above

````
