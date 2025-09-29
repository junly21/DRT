// API Base Configuration
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.drt-mvp.com";

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || "API request failed",
          status: response.status,
          code: errorData.code,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && "status" in error) {
        throw error;
      }
      throw {
        message: "Network error",
        status: 0,
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Type definitions
export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  type: "bus" | "ferry";
}

export interface Route {
  id: string;
  name: string;
  type: "bus" | "ferry";
  stops: string[];
}

export interface CallRequest {
  mode: "passenger" | "bus";
  originStopId: string;
  destStopId: string;
  passengerCount?: number;
  specialNeeds?: string[];
  payment?: {
    method: "card" | "cash" | "mobile";
    amount: number;
  };
}

export interface CallResponse {
  id: string;
  status: "confirmed" | "pending" | "cancelled";
  estimatedArrival: string;
  vehicleInfo?: {
    id: string;
    type: string;
    licensePlate: string;
  };
  driver?: {
    name: string;
    phone: string;
  };
}

// Mock 데이터
const MOCK_STOPS: Stop[] = [
  {
    id: "ferry_1",
    name: "제주항 여객터미널",
    latitude: 33.5102,
    longitude: 126.5219,
    address: "제주특별자치도 제주시 임항로 17",
    type: "ferry",
  },
  {
    id: "ferry_2",
    name: "성산항 여객터미널",
    latitude: 33.4615,
    longitude: 126.9275,
    address: "제주특별자치도 서귀포시 성산읍 성산항로 57",
    type: "ferry",
  },
  {
    id: "bus_1",
    name: "제주시청 정류장",
    latitude: 33.4996,
    longitude: 126.5312,
    address: "제주특별자치도 제주시 연동 1294-1",
    type: "bus",
  },
  {
    id: "bus_2",
    name: "제주공항 정류장",
    latitude: 33.5067,
    longitude: 126.493,
    address: "제주특별자치도 제주시 공항로 2",
    type: "bus",
  },
  {
    id: "bus_3",
    name: "서귀포시청 정류장",
    latitude: 33.2541,
    longitude: 126.5602,
    address: "제주특별자치도 서귀포시 중앙로 105",
    type: "bus",
  },
  {
    id: "bus_4",
    name: "중문관광단지 정류장",
    latitude: 33.2394,
    longitude: 126.4135,
    address: "제주특별자치도 서귀포시 중문동 2624-1",
    type: "bus",
  },
];

// Mock API 함수들
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// API Methods
export const api = {
  // Stops
  getStops: async (): Promise<Stop[]> => {
    await mockDelay();
    return MOCK_STOPS;
  },

  getStopsByLocation: async (
    lat: number,
    lng: number,
    radius = 1000
  ): Promise<Stop[]> => {
    await mockDelay();
    // 거리 계산해서 가까운 순으로 정렬
    const stopsWithDistance = MOCK_STOPS.map((stop) => ({
      ...stop,
      distance: Math.sqrt(
        Math.pow(lat - stop.latitude, 2) + Math.pow(lng - stop.longitude, 2)
      ),
    }));

    return stopsWithDistance
      .filter((stop) => stop.distance * 111000 <= radius) // 대략적인 거리 계산 (1도 ≈ 111km)
      .sort((a, b) => a.distance - b.distance)
      .map(({ distance, ...stop }) => stop);
  },

  getStop: async (id: string): Promise<Stop> => {
    await mockDelay();
    const stop = MOCK_STOPS.find((s) => s.id === id);
    if (!stop) throw new Error(`Stop with id ${id} not found`);
    return stop;
  },

  // Routes
  getRoutes: async (): Promise<Route[]> => {
    await mockDelay();
    return [
      {
        id: "route_1",
        name: "제주시 순환버스",
        type: "bus",
        stops: ["bus_1", "bus_2"],
      },
      {
        id: "route_2",
        name: "서귀포 관광버스",
        type: "bus",
        stops: ["bus_3", "bus_4"],
      },
    ];
  },

  getRoutesByStop: async (stopId: string): Promise<Route[]> => {
    await mockDelay();
    const routes = await api.getRoutes();
    return routes.filter((route) => route.stops.includes(stopId));
  },

  // Calls
  createCall: async (request: CallRequest): Promise<CallResponse> => {
    await mockDelay(1000);
    const callId = `call_${Date.now()}`;

    return {
      id: callId,
      status: "confirmed",
      estimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15분 후
      vehicleInfo: {
        id: "vehicle_1",
        type: request.mode === "passenger" ? "여객선" : "버스",
        licensePlate:
          request.mode === "passenger" ? "제주88바1234" : "제주70가5678",
      },
      driver: {
        name: "김기사",
        phone: "010-1234-5678",
      },
    };
  },

  getCall: async (id: string): Promise<CallResponse> => {
    await mockDelay();
    return {
      id,
      status: "confirmed",
      estimatedArrival: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      vehicleInfo: {
        id: "vehicle_1",
        type: "버스",
        licensePlate: "제주70가5678",
      },
      driver: {
        name: "김기사",
        phone: "010-1234-5678",
      },
    };
  },

  cancelCall: async (id: string): Promise<void> => {
    await mockDelay();
    console.log(`Call ${id} cancelled`);
  },
};

