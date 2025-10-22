// React Query key factory

export const queryKeys = {
  // Stops
  stops: ["stops"] as const,
  stop: (id: string) => ["stops", id] as const,

  // Routes
  routes: ["routes"] as const,
  route: (id: string) => ["routes", id] as const,

  // Calls
  calls: ["calls"] as const,
  call: (id: string) => ["calls", id] as const,
  userCalls: ["calls", "user"] as const,
  driverCalls: ["calls", "driver"] as const,

  // Schedules
  schedules: ["schedules"] as const,
  schedule: (id: string) => ["schedules", id] as const,

  // User
  user: ["user"] as const,
  userProfile: ["user", "profile"] as const,

  // Driver
  driver: ["driver"] as const,
  driverProfile: ["driver", "profile"] as const,
  driverStatus: ["driver", "status"] as const,
} as const;
