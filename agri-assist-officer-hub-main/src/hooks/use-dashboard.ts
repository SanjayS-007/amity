// Custom React hooks for data fetching and real-time updates
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { apiClient, getMockDashboardSummary, getMockInboxTasks, type DashboardSummary, type InboxTask } from '@/lib/api';

// Dashboard Summary Hook with auto-refresh
export function useDashboardSummary(autoRefresh = true) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      // For development, use mock data if API fails
      try {
        return await apiClient.getDashboardSummary();
      } catch (err) {
        console.warn('Using mock data:', err);
        return getMockDashboardSummary();
      }
    },
    staleTime: 60 * 1000, // Cache for 1 minute
    refetchInterval: autoRefresh ? 5 * 60 * 1000 : false, // Auto-refresh every 5 minutes
  });

  return { data, isLoading, error, refetch };
}

// Inbox Tasks Hook
export function useInboxTasks(filters?: { type?: string; status?: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['inbox', 'tasks', filters],
    queryFn: async () => {
      try {
        return await apiClient.getInboxTasks(filters);
      } catch (err) {
        console.warn('Using mock inbox data:', err);
        return getMockInboxTasks();
      }
    },
    staleTime: 30 * 1000,
  });

  return { tasks: data || [], isLoading, error };
}

// Task Status Update Hook
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status, comment }: { taskId: string; status: string; comment?: string }) =>
      apiClient.updateTaskStatus(taskId, status, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox', 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
    },
  });
}

// WebSocket Hook for Real-Time Updates
interface WebSocketMessage {
  type: string;
  data: unknown;
}

export function useWebSocket(url?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setLastMessage(message);

      // Invalidate relevant queries based on message type
      switch (message.type) {
        case 'dashboard:update':
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
          break;
        case 'inbox:update':
          queryClient.invalidateQueries({ queryKey: ['inbox'] });
          break;
        case 'alert:new':
          queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [url, queryClient]);

  return { isConnected, lastMessage };
}

// Analytics Hooks
export function useCropAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'crops'],
    queryFn: () => apiClient.getCropAnalytics(),
    staleTime: 24 * 60 * 60 * 1000, // Cache for 1 day
  });
}

export function useCalendarEvents(start?: string, end?: string) {
  return useQuery({
    queryKey: ['calendar', 'events', start, end],
    queryFn: () => apiClient.getCalendarEvents(start, end),
    staleTime: 5 * 60 * 1000,
  });
}
