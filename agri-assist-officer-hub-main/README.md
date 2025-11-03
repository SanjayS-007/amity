# AgriAssist - Officer Portal

## Project Overview

AgriAssist Officer Portal is an AI & IoT-Based Smart Agriculture Management System designed for government and agricultural officers to monitor, assist, and analyze farmers in their zones.

## Key Features

### Zone Overview Dashboard
A clean, professional interface displaying **4 essential real-time metrics**:

#### 1. Total Farmers Under Zone
- Total farmer count with weekly activity percentage
- Active vs Inactive status badges
- 7-day activity trend sparkline
- Trend indicator (+12.5%)
- Quick actions: View List, Send Message

#### 2. Active Crop Cycles  
- Count of ongoing crop cycles
- Growth phase distribution:
  - Sowing: 25% (45 farmers)
  - Vegetative: 35% 
  - Flowering: 20%
  - Harvest: 20% (55 farmers)
- Circular progress indicators for each phase
- Quick actions: View Phases, Assign Officer

#### 3. Pending Actions
- Total pending tasks (consultations + field visits)
- Breakdown by type with badges
- Weekly trend indicator
- Activity sparkline showing workload patterns
- Quick actions: View All, Assign Tasks

#### 4. Alerts Issued This Week
- Total alert count
- Critical and Warning badge counts (with urgency indicator)
- Alert distribution ring (31% solved)
- Pending actions count
- Quick actions: View List, Broadcast Alert

### Zone Analytics Overview
An interactive visual analytics section with **dynamic pie chart selector** placed below the KPI cards:

#### Three Analysis Views:
1. **Crops by Type**
   - Pie chart showing crop distribution across the zone
   - Data: Paddy (1,240 ha, 33%), Maize (890 ha), Cotton (650 ha), Wheat (520 ha), Pulses (480 ha)
   - Detailed breakdown panel with farmer counts
   - Insight: "Paddy cultivation increased by 8% compared to last season"

2. **Phases Distribution**  
   - Growth stage breakdown across all active cycles
   - Data: Vegetative (875 farmers, 30%), Maturity (525, 18%), Sowing (625, 21%), Flowering (500, 17%), Harvest (425, 14%)
   - Dominant phase indicator with contextual alerts
   - Alert: "Harvest phase delayed—12% farmers flagged for support"

3. **Health Status**
   - Farm health condition overview
   - Data: Healthy (1,820 farms, 74%), Warning (420, 17%), Critical (95, 4%), Under Review (115, 5%)
   - Action-oriented breakdown (e.g., "Immediate attention", "Monitor closely")
   - Priority alert: "95 farms in critical condition require immediate field visits"
   - Quick navigation to critical farms list

#### Interactive Features:
- **Tab Selector**: Large, color-coded buttons with icons for easy switching
- **Smooth Animations**: Chart transitions preserve orientation for clarity
- **Rich Tooltips**: Hover to see exact segment details (count, percentage)
- **Responsive Layout**: Side-by-side chart + details panel on desktop, stacked on mobile
- **Contextual Insights**: Each view includes highlighted key findings and alerts
- **Action Buttons**: Direct links to relevant sections (e.g., "View Critical Farms")

### Design Features
- **Professional & Clean**: Business-appropriate interface, no flashy gradients
- **Comfortable Spacing**: 6-unit gaps, generous padding for easy reading
- **High Contrast**: Dark text on light backgrounds for better readability
- **Subtle Color Coding**: Left border accents (emerald/green/blue/red)
- **Interactive Cards**: Click-to-navigate with hover effects
- **Responsive Grid**: 4 columns → 2 columns → 1 column across devices
- **Accessibility**: Chart segments use distinct colors and patterns for clarity

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

### Real-Time Dashboard
- **Auto-Refreshing KPI Cards**: 6 real-time metrics updating every 5 minutes
  - Total Farmers (active/inactive/dormant breakdown)
  - Active Crops (top 3 with acreage)
  - Pending Actions (consultations + visits + alerts)
  - Alerts This Week (critical/warning/info distribution)
  - Task Completion Rate (officer performance)
  - App Adoption Metrics (digital user engagement)
- **Interactive Navigation**: Click any KPI card to drill down into detailed views
- **Hover Tooltips**: Growth percentages, breakdowns, and contextual insights
- **WebSocket Integration**: Real-time updates without page refresh

### Zone-Level Analytics
- Crop distribution charts (pie/bar by acreage)
- Phase distribution (growth stage tracking)
- Health heatmap integration ready
- Yield trends analysis
- 7-day weather forecast widget
- Market price comparison

### Farmer Management
- Comprehensive farmer profiles with status tracking
- Filter by village, health status, crop type
- Activity segmentation (Active <30 days, Inactive 31-90, Dormant >90)
- Quick contact and profile access

### Consultation System
- Real-time consultation request tracking
- Priority-based task queue
- Status workflow (new → in-progress → resolved)
- SLA monitoring (4-hour response target)

### Alert Broadcast System
- Multi-severity alert creation (critical/warning/info)
- Delivery rate tracking
- Alert history and analytics
- Targeted zone-based distribution

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

## Architecture & Data Flow

### API Integration Layer

**Location**: `src/lib/api.ts`

Centralized API client with TypeScript types for all endpoints:

```typescript
// Core endpoints
GET  /api/dashboard/summary  → Real-time KPI metrics
GET  /api/analytics/crops    → Crop distribution data
GET  /api/analytics/phases   → Growth phase tracking
GET  /api/analytics/health   → Health heatmap data
GET  /api/analytics/yield    → Historical yield trends
GET  /api/analytics/weather  → 7-day forecast
GET  /api/analytics/market   → Mandi prices + MSP
GET  /api/inbox              → Pending task queue
PATCH /api/inbox/:id         → Update task status
GET  /api/calendar           → Events by date range
POST /api/calendar           → Create new event
```

**Sample Dashboard Summary Payload**:
```json
{
  "farmers": {
    "active": 1820,
    "inactive": 420,
    "dormant": 210
  },
  "crops": [
    {"name": "Paddy", "acreage": 1240},
    {"name": "Maize", "acreage": 890}
  ],
  "pending": {
    "consultations": 12,
    "visits": 5,
    "alerts": 8
  },
  "alerts": {
    "red": 4,
    "yellow": 7,
    "info": 5,
    "deliveryRate": 0.92
  },
  "taskCompletion": 84,
  "appAdoption": 74,
  "lastUpdated": "2025-11-03T14:30:00Z"
}
```

### Data Fetching Hooks

**Location**: `src/hooks/use-dashboard.ts`

React Query powered hooks for optimized data fetching:

- `useDashboardSummary(autoRefresh)` - Dashboard KPIs with 5-min auto-refresh
- `useInboxTasks(filters)` - Filtered task queue
- `useUpdateTaskStatus()` - Mutation for task updates
- `useWebSocket(url)` - Real-time event streaming
- `useCropAnalytics()` - Zone crop data (24h cache)
- `useCalendarEvents(start, end)` - Calendar events

**Caching Strategy**:
- Dashboard summary: 60s stale time, 5min refetch interval
- Analytics data: 24h cache (daily refresh)
- Inbox tasks: 30s stale time, WebSocket invalidation
- Calendar: 5min cache

### Real-Time Update Flow

```
Backend Event → WebSocket Server → Client Connection
                                   ↓
                        React Query Cache Invalidation
                                   ↓
                         Automatic UI Re-render
```

**WebSocket Event Types**:
- `dashboard:update` - KPI metrics changed
- `inbox:update` - New task or status change
- `alert:new` - Alert broadcast sent
- `consultation:assigned` - Task assignment

### Business Logic Rules

**Farmer Segmentation**:
- Active: Last activity < 30 days
- Inactive: Last activity 31-90 days  
- Dormant: Last activity > 90 days

**SLA Management**:
- Response target: 4 hours
- Breach threshold: > 4h pending
- Red flag: Auto-escalation after 6h

**Crop Health Scoring**:
- Green (Healthy): Score ≥ 75
- Yellow (Warning): Score 50-74
- Red (Critical): Score < 50

**App Adoption Calculation**:
```
adoption_rate = (active_app_users / total_farmers) × 100
```

**Task Completion Rate**:
```
completion_rate = (resolved_tasks / total_tasks) × 100
Target: > 80%
```

### Navigation & Deep Linking

All KPI cards support click-to-navigate with pre-applied filters:

- **Total Farmers** → `/farmers` (default view)
- **Active Crops** → `/analytics?view=crops`
- **Pending Actions** → `/consultations?filter=pending`
- **Alerts This Week** → `/alerts?filter=this-week`
- **Task Completion** → `/analytics?view=performance`
- **App Adoption** → `/analytics?view=app-usage`

Query parameters are read via `useSearchParams()` and applied to data fetching automatically.

### Role-Based Access Control

**Implementation**: JWT-based authentication with zone scoping

Every API request includes:
```typescript
headers: {
  'Authorization': 'Bearer <jwt_token>',
  'X-Zone-ID': '<officer_zone>'
}
```

Backend filters all queries by officer's assigned zone automatically.

### Performance Optimizations

1. **React Query Caching**: Reduces redundant API calls
2. **Stale-While-Revalidate**: Shows cached data immediately, updates in background
3. **WebSocket Multiplexing**: Single connection for all real-time channels
4. **Component Code-Splitting**: Lazy load analytics/calendar modules
5. **Redis Server Cache**: 60s TTL for dashboard summary endpoint

## Development Workflow

### Adding New KPI Cards

1. Add metric to `DashboardSummary` type in `src/lib/api.ts`
2. Update backend `/api/dashboard/summary` response
3. Add new `StatsCard` in `src/pages/Index.tsx` with:
   - Navigation handler
   - Tooltip content
   - Icon and variant
4. Update query filters in target page

### Adding Real-Time Features

1. Define WebSocket event type in backend
2. Emit event when data changes
3. Handle in `useWebSocket` hook (invalidate relevant queries)
4. UI updates automatically via React Query

### Extending Analytics

1. Create new component in `src/pages/` or `/analytics/`
2. Add API endpoint in `src/lib/api.ts`
3. Create React Query hook in `src/hooks/`
4. Add route in `src/App.tsx`
5. Link from KPI card or navigation

## Backend Integration Checklist

To make dashboard fully operational:

- [ ] Implement `/api/dashboard/summary` endpoint
- [ ] Set up WebSocket server (Socket.io or native WS)
- [ ] Create database tables (farmer_profile, crop_registry, etc.)
- [ ] Implement zone-based query filtering
- [ ] Set up Redis cache layer
- [ ] Configure JWT authentication
- [ ] Implement SLA tracking background job
- [ ] Set up notification service
- [ ] Create analytics aggregation jobs (daily)
- [ ] Implement audit logging

````
