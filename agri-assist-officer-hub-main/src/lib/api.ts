// API Service Layer for AgriAssist Officer Dashboard
// Centralized API calls with error handling and type safety

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export type FarmerStats = {
  active: number;
  inactive: number;
  dormant: number;
};

export type CropData = {
  name: string;
  acreage: number;
};

export type PendingActions = {
  consultations: number;
  visits: number;
  alerts: number;
};

export type AlertStats = {
  red: number;
  yellow: number;
  info: number;
  deliveryRate: number;
};

export type DashboardSummary = {
  farmers: FarmerStats;
  crops: CropData[];
  pending: PendingActions;
  alerts: AlertStats;
  taskCompletion: number;
  appAdoption: number;
  lastUpdated?: string;
};

export type AnalyticsCropData = {
  crop: string;
  acreage: number;
  percentage: number;
  phase: string;
  healthScore: number;
};

export type InboxTask = {
  id: string;
  type: 'consultation' | 'disease' | 'query' | 'visit' | 'verification' | 'sla-breach';
  farmerName: string;
  farmerPhone: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  dueAt: string;
  slaBreached: boolean;
  assignedTo?: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: 'scheme' | 'pest' | 'officer' | 'market';
  location?: string;
  priority: 'low' | 'medium' | 'high';
};

// API Client with error handling
class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Dashboard Summary
  async getDashboardSummary(): Promise<DashboardSummary> {
    return this.request<DashboardSummary>('/dashboard/summary');
  }

  // Analytics
  async getCropAnalytics(): Promise<AnalyticsCropData[]> {
    return this.request<AnalyticsCropData[]>('/analytics/crops');
  }

  async getPhaseDistribution(): Promise<Record<string, unknown>> {
    return this.request('/analytics/phases');
  }

  async getHealthHeatmap(): Promise<Record<string, unknown>> {
    return this.request('/analytics/health');
  }

  async getYieldTrends(): Promise<Record<string, unknown>> {
    return this.request('/analytics/yield');
  }

  async getWeatherForecast(): Promise<Record<string, unknown>> {
    return this.request('/analytics/weather');
  }

  async getMarketPrices(): Promise<Record<string, unknown>> {
    return this.request('/analytics/market');
  }

  // Inbox
  async getInboxTasks(filters?: { type?: string; status?: string }): Promise<InboxTask[]> {
    const params = new URLSearchParams(filters as Record<string, string>);
    return this.request<InboxTask[]>(`/inbox?${params}`);
  }

  async updateTaskStatus(taskId: string, status: string, comment?: string): Promise<void> {
    return this.request(`/inbox/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    });
  }

  // Calendar
  async getCalendarEvents(start?: string, end?: string): Promise<CalendarEvent[]> {
    const params = new URLSearchParams({ start: start || '', end: end || '' });
    return this.request<CalendarEvent[]>(`/calendar?${params}`);
  }

  async createCalendarEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    return this.request<CalendarEvent>('/calendar', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }
}

export const apiClient = new ApiClient();

// Mock data generator for development (remove when real API is available)
export function getMockDashboardSummary(): DashboardSummary {
  return {
    farmers: { active: 1820, inactive: 420, dormant: 210 },
    crops: [
      { name: 'Paddy', acreage: 1240 },
      { name: 'Maize', acreage: 890 },
      { name: 'Cotton', acreage: 650 },
    ],
    pending: { consultations: 12, visits: 5, alerts: 8 },
    alerts: { red: 4, yellow: 7, info: 5, deliveryRate: 0.92 },
    taskCompletion: 84,
    appAdoption: 74,
    lastUpdated: new Date().toISOString(),
  };
}

export function getMockInboxTasks(): InboxTask[] {
  return [
    {
      id: '1',
      type: 'consultation',
      farmerName: 'Rajesh Kumar',
      farmerPhone: '+91 98765 43210',
      subject: 'Yellow leaves in rice crop',
      description: 'Seeing yellow discoloration on leaves. Need immediate guidance.',
      priority: 'high',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      dueAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      slaBreached: false,
    },
    {
      id: '2',
      type: 'sla-breach',
      farmerName: 'Sunita Devi',
      farmerPhone: '+91 98765 43211',
      subject: 'Pest infestation - 5 hours pending',
      description: 'Urgent: Brown spot disease spreading rapidly.',
      priority: 'critical',
      status: 'pending',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      dueAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      slaBreached: true,
    },
  ];
}
