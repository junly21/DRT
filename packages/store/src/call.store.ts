import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface CallState {
  // Call parameters
  mode: "passenger" | "bus" | null;

  // Driver app specific
  driverRegion: "금오도" | "거문도" | null;
  driverIsOperating: boolean;
  driverRouteId: string | null;
  vehicleId: string | null;
  driverStopInfo: {
    stopName: string | null;
    passengerCount: number | null;
    isArrivalEvent: boolean | null;
  } | null;

  // Ferry-specific data
  ferryScheduleId: string | null;
  ferryBoardingStopId: string | null;
  ferryRouteId: string | null;

  // Bus-specific data
  busBoardingStopId: string | null;
  busRouteId: string | null;
  busAlightingStopId: string | null;

  // Departure location (for bus mode)
  departureLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;

  // Legacy fields (keep for compatibility)
  destStopId: string | null;
  originStopId: string | null;

  // Passenger-specific data
  passengerCount: number;
  specialNeeds: string[];

  // Payment info
  payment: {
    method: "card" | "cash" | "mobile" | null;
    amount: number | null;
  } | null;

  // Device info
  deviceId: string | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Current call info
  currentCallId: string | null;
  callStatus: "idle" | "calling" | "confirmed" | "cancelled" | null;
}

export interface CallActions {
  // Mode selection
  setMode: (mode: "passenger" | "bus") => void;

  // Driver app actions
  setDriverRegion: (region: "금오도" | "거문도" | null) => void;
  setDriverRouteId: (routeId: string | null) => void;
  startDriverOperation: (routeId: string) => void;
  endDriverOperation: () => void;
  setVehicleId: (vehicleId: string | null) => void;
  setDriverStopInfo: (info: CallState["driverStopInfo"]) => void;

  // Ferry actions
  setFerrySchedule: (scheduleId: string) => void;
  setFerryBoardingStop: (stopId: string) => void;
  setFerryRoute: (routeId: string) => void;

  // Bus actions
  setBusBoardingStop: (stopId: string) => void;
  setBusRoute: (routeId: string) => void;
  setBusAlightingStop: (stopId: string) => void;
  setDepartureLocation: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;

  // Legacy stop selection (keep for compatibility)
  setDestStop: (stopId: string) => void;
  setOriginStop: (stopId: string) => void;

  // Passenger info
  setPassengerCount: (count: number) => void;
  addSpecialNeed: (need: string) => void;
  removeSpecialNeed: (need: string) => void;

  // Payment
  setPayment: (payment: CallState["payment"]) => void;

  // Device info
  setDeviceId: (deviceId: string | null) => void;

  // UI state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Call management
  setCurrentCall: (callId: string | null) => void;
  setCallStatus: (status: CallState["callStatus"]) => void;

  // Reset
  resetCall: () => void;
  resetAll: () => void;
}

export type CallStore = CallState & CallActions;

const initialState: CallState = {
  mode: null,

  // Driver
  driverRegion: null,
  driverIsOperating: false,
  driverRouteId: null,
  vehicleId: null,
  driverStopInfo: null,

  // Ferry-specific data
  ferryScheduleId: null,
  ferryBoardingStopId: null,
  ferryRouteId: null,

  // Bus-specific data
  busBoardingStopId: null,
  busRouteId: null,
  busAlightingStopId: null,

  // Departure location
  departureLocation: null,

  // Legacy fields
  destStopId: null,
  originStopId: null,

  passengerCount: 1,
  specialNeeds: [],
  payment: null,
  deviceId: null,
  isLoading: false,
  error: null,
  currentCallId: null,
  callStatus: "idle",
};

export const useCallStore = create<CallStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Mode selection
      setMode: (mode) => set({ mode }),

      // Driver actions
      setDriverRegion: (region) => set({ driverRegion: region }),
      setDriverRouteId: (routeId) => set({ driverRouteId: routeId }),
      startDriverOperation: (routeId) =>
        set({
          driverIsOperating: true,
          driverRouteId: routeId,
          driverStopInfo: null,
        }),
      endDriverOperation: () =>
        set({
          driverIsOperating: false,
          driverRouteId: null,
          driverStopInfo: null,
        }),
      setVehicleId: (vehicleId) => set({ vehicleId }),
      setDriverStopInfo: (info) => set({ driverStopInfo: info }),

      // Ferry actions
      setFerrySchedule: (scheduleId) => set({ ferryScheduleId: scheduleId }),
      setFerryBoardingStop: (stopId) => set({ ferryBoardingStopId: stopId }),
      setFerryRoute: (routeId) => set({ ferryRouteId: routeId }),

      // Bus actions
      setBusBoardingStop: (stopId) => set({ busBoardingStopId: stopId }),
      setBusRoute: (routeId) => set({ busRouteId: routeId }),
      setBusAlightingStop: (stopId) => set({ busAlightingStopId: stopId }),
      setDepartureLocation: (location) => set({ departureLocation: location }),

      // Legacy stop selection
      setDestStop: (stopId) => set({ destStopId: stopId }),
      setOriginStop: (stopId) => set({ originStopId: stopId }),

      // Passenger info
      setPassengerCount: (count) => set({ passengerCount: Math.max(1, count) }),
      addSpecialNeed: (need) => {
        const { specialNeeds } = get();
        if (!specialNeeds.includes(need)) {
          set({ specialNeeds: [...specialNeeds, need] });
        }
      },
      removeSpecialNeed: (need) => {
        const { specialNeeds } = get();
        set({ specialNeeds: specialNeeds.filter((n) => n !== need) });
      },

      // Payment
      setPayment: (payment) => set({ payment }),

      // Device info
      setDeviceId: (deviceId) => set({ deviceId }),

      // UI state
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Call management
      setCurrentCall: (callId) => set({ currentCallId: callId }),
      setCallStatus: (status) => set({ callStatus: status }),

      // Reset functions
      resetCall: () =>
        set((state) => ({
          // Driver
          driverIsOperating: false,
          driverRouteId: null,
          vehicleId: state.vehicleId,
          driverStopInfo: null,
          // keep driverRegion as is on call reset

          // Ferry data
          ferryScheduleId: null,
          ferryBoardingStopId: null,
          ferryRouteId: null,

          // Bus data
          busBoardingStopId: null,
          busRouteId: null,
          busAlightingStopId: null,

          // Departure location
          departureLocation: null,

          // Legacy fields
          destStopId: null,
          originStopId: null,

          passengerCount: 1,
          specialNeeds: [],
          payment: null,
          currentCallId: null,
          callStatus: "idle",
          error: null,
        })),

      resetAll: () =>
        set((state) => ({
          ...initialState,
          deviceId: state.deviceId,
          vehicleId: state.vehicleId,
          driverStopInfo: null,
        })),
    }),
    {
      name: "call-store",
    }
  )
);

// Selectors for better performance
export const useCallMode = () => useCallStore((state) => state.mode);
export const useCallStops = () =>
  useCallStore((state) => ({
    destStopId: state.destStopId,
    originStopId: state.originStopId,
  }));
export const usePassengerInfo = () =>
  useCallStore((state) => ({
    passengerCount: state.passengerCount,
    specialNeeds: state.specialNeeds,
  }));
export const useCallStatus = () =>
  useCallStore((state) => ({
    currentCallId: state.currentCallId,
    callStatus: state.callStatus,
    isLoading: state.isLoading,
    error: state.error,
  }));
