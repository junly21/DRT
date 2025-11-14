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
  ferryBoardingStopName: string | null;
  ferrySelectedSchedule: {
    sailTime: string;
    vesselName: string;
    routeName: string;
    passengerCapacity: number;
  } | null;
  ferryRouteId: string | null;

  // Bus-specific data
  busBoardingStopId: string | null;
  busBoardingStopName: string | null;
  busRouteId: string | null;
  busAlightingStopId: string | null;
  busAlightingStopName: string | null;

  // Departure location (for bus mode)
  departureLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;

  // Legacy fields (keep for compatibility)
  destStopId: string | null;
  destStopName: string | null;
  originStopId: string | null;
  originStopName: string | null;

  // Passenger-specific data
  passengerCount: number;
  specialNeeds: string[];

  // Payment info
  payment: {
    method: "card" | "cash" | "mobile" | null;
    amount: number | null;
  } | null;

  // Call validation (pre-call confirmation)
  callValidation: {
    result: "SUCCESS" | "FAIL_CAPA" | "FAIL_DISPATCH";
    params?: {
      DISPATCH_DT: string;
      CALL_DTM: string;
      START_POINT_ID: string;
      END_POINT_ID: string;
      DEVICE_ID: string;
      GPS_X: string;
      GPS_Y: string;
      PAYMENT: "CARD" | "CASH" | "MOBILE";
      RSV_NUM: string | number;
      SAIL_TM?: string;
      VEHICLE_ID?: string;
      ROUTE_ID?: string;
      DISPATCH_SEQ?: number;
      SCHEDULE_RIDE_DTM?: number;
      SCHEDULE_ALGH_DTM?: number;
      NEWRSV?: number;
      CURREN_RESERVED?: number;
    };
    message?: string;
    capacity?: number;
    currentReserved?: number;
    newReserved?: number;
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
  setFerryBoardingStop: (stop: { id: string; name?: string | null }) => void;
  setFerrySelectedSchedule: (
    schedule: CallState["ferrySelectedSchedule"]
  ) => void;
  setFerryRoute: (routeId: string) => void;

  // Bus actions
  setBusBoardingStop: (stop: { id: string; name?: string | null }) => void;
  setBusRoute: (routeId: string) => void;
  setBusAlightingStop: (stop: { id: string; name?: string | null }) => void;
  setDepartureLocation: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;

  // Legacy stop selection (keep for compatibility)
  setDestStop: (stop: { id: string; name?: string | null }) => void;
  setOriginStop: (stop: { id: string; name?: string | null }) => void;

  // Passenger info
  setPassengerCount: (count: number) => void;
  addSpecialNeed: (need: string) => void;
  removeSpecialNeed: (need: string) => void;

  // Payment
  setPayment: (payment: CallState["payment"]) => void;
  setCallValidation: (validation: CallState["callValidation"]) => void;
  clearCallValidation: () => void;

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
  ferryBoardingStopName: null,
  ferrySelectedSchedule: null,
  ferryRouteId: null,

  // Bus-specific data
  busBoardingStopId: null,
  busBoardingStopName: null,
  busRouteId: null,
  busAlightingStopId: null,
  busAlightingStopName: null,

  // Departure location
  departureLocation: null,

  // Legacy fields
  destStopId: null,
  destStopName: null,
  originStopId: null,
  originStopName: null,

  passengerCount: 1,
  specialNeeds: [],
  payment: null,
  callValidation: null,
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
      setFerryBoardingStop: (stop) =>
        set({
          ferryBoardingStopId: stop.id,
          ferryBoardingStopName: stop.name ?? null,
        }),
      setFerrySelectedSchedule: (schedule) =>
        set({ ferrySelectedSchedule: schedule }),
      setFerryRoute: (routeId) => set({ ferryRouteId: routeId }),

      // Bus actions
      setBusBoardingStop: (stop) =>
        set({
          busBoardingStopId: stop.id,
          busBoardingStopName: stop.name ?? null,
        }),
      setBusRoute: (routeId) => set({ busRouteId: routeId }),
      setBusAlightingStop: (stop) =>
        set({
          busAlightingStopId: stop.id,
          busAlightingStopName: stop.name ?? null,
        }),
      setDepartureLocation: (location) => set({ departureLocation: location }),

      // Legacy stop selection
      setDestStop: (stop) =>
        set({
          destStopId: stop.id,
          destStopName: stop.name ?? null,
        }),
      setOriginStop: (stop) =>
        set({
          originStopId: stop.id,
          originStopName: stop.name ?? null,
        }),

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
      setCallValidation: (validation) => set({ callValidation: validation }),
      clearCallValidation: () => set({ callValidation: null }),

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
          ferryBoardingStopName: null,
          ferrySelectedSchedule: null,
          ferryRouteId: null,

          // Bus data
          busBoardingStopId: null,
          busBoardingStopName: null,
          busRouteId: null,
          busAlightingStopId: null,
          busAlightingStopName: null,

          // Departure location
          departureLocation: null,

          // Legacy fields
          destStopId: null,
          destStopName: null,
          originStopId: null,
          originStopName: null,

          passengerCount: 1,
          specialNeeds: [],
          payment: null,
          callValidation: null,
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
          payment: state.payment ?? initialState.payment,
          callValidation: null,
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
