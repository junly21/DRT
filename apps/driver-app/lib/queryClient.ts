import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === "object" && "status" in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

export const queryKeys = {
  stops: ["stops"] as const,
  stopsByLocation: (lat: number, lng: number) =>
    ["stops", "by-location", lat, lng] as const,
  routes: ["routes"] as const,
  routesByStop: (stopId: string) => ["routes", "by-stop", stopId] as const,
} as const;
