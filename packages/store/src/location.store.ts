import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type LocationPermissionStatus =
  | "unknown"
  | "granted"
  | "denied"
  | "restricted";

export type LocationSource = "gps" | "mock" | "manual";

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface StoredLocation {
  coords: Coordinates;
  timestamp: number;
  source: LocationSource;
  address?: string;
  metadata?: Record<string, unknown>;
}

interface LocationState {
  permissionStatus: LocationPermissionStatus;
  lastKnownLocation: StoredLocation | null;
  isWatching: boolean;
  error: string | null;
}

interface LocationActions {
  setPermissionStatus: (status: LocationPermissionStatus) => void;
  updateLocation: (
    location: Omit<StoredLocation, "timestamp" | "source"> & {
      timestamp?: number;
      source?: LocationSource;
    }
  ) => void;
  clearLocation: () => void;
  startWatching: () => void;
  stopWatching: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type LocationStore = LocationState & LocationActions;

const initialState: LocationState = {
  permissionStatus: "unknown",
  lastKnownLocation: null,
  isWatching: false,
  error: null,
};

export const useLocationStore = create<LocationStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setPermissionStatus: (status) => set({ permissionStatus: status }),

      updateLocation: ({
        coords,
        address,
        metadata,
        source = "gps",
        timestamp = Date.now(),
      }) =>
        set({
          lastKnownLocation: {
            coords,
            address,
            metadata,
            source,
            timestamp,
          },
          error: null,
        }),

      clearLocation: () => set({ lastKnownLocation: null }),

      startWatching: () => set({ isWatching: true, error: null }),

      stopWatching: () => set({ isWatching: false }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    { name: "location-store" }
  )
);

export const useCurrentLocation = () =>
  useLocationStore((state) => state.lastKnownLocation);

export const useLocationPermissionStatus = () =>
  useLocationStore((state) => state.permissionStatus);

export const useLocationWatchingState = () =>
  useLocationStore((state) => ({
    isWatching: state.isWatching,
    error: state.error,
  }));
