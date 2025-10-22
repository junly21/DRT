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
    const headers: any = {
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
        const errorData = (await response.json().catch(() => ({}))) as any;
        const error: ApiError = {
          message: errorData.message || "API request failed",
          status: response.status,
          code: errorData.code,
        };
        throw error;
      }

      return (await response.json()) as T;
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
  estimatedBoardingTime?: string; // 예상 탑승시간
  estimatedAlightingTime?: string; // 예상 하차시간
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

// Mock 데이터 (실제 정류장 정보 반영)
const MOCK_STOPS: Stop[] = [
  // 여객선 터미널
  {
    id: "ferry_1",
    name: "녹동항 여객터미널",
    latitude: 34.6102,
    longitude: 127.3219,
    address: "전라남도 고흥군 도양읍 녹동항",
    type: "ferry",
  },
  // 실제 버스 정류장들
  {
    id: "bus_1",
    name: "우실삼거리",
    latitude: 34.6096,
    longitude: 127.3312,
    address: "전라남도 여수시 남면 우실삼거리",
    type: "bus",
  },
  {
    id: "bus_2",
    name: "소유",
    latitude: 34.6167,
    longitude: 127.303,
    address: "전라남도 여수시 남면 소유",
    type: "bus",
  },
  {
    id: "bus_3",
    name: "대유",
    latitude: 34.5641,
    longitude: 127.3702,
    address: "전라남도 여수시 남면 대유",
    type: "bus",
  },
  {
    id: "bus_4",
    name: "여천터미널",
    latitude: 34.5494,
    longitude: 127.4235,
    address: "전라남도 여수시 여천동 터미널",
    type: "bus",
  },
  {
    id: "bus_5",
    name: "모하",
    latitude: 34.55,
    longitude: 127.43,
    address: "전라남도 여수시 남면 모하",
    type: "bus",
  },
  {
    id: "bus_6",
    name: "두포분무골",
    latitude: 34.555,
    longitude: 127.435,
    address: "전라남도 여수시 남면 두포분무골",
    type: "bus",
  },
  {
    id: "bus_7",
    name: "학동",
    latitude: 34.56,
    longitude: 127.44,
    address: "전라남도 여수시 남면 학동",
    type: "bus",
  },
  {
    id: "bus_8",
    name: "직포",
    latitude: 34.565,
    longitude: 127.445,
    address: "전라남도 여수시 남면 직포",
    type: "bus",
  },
  {
    id: "bus_9",
    name: "우학보건소",
    latitude: 34.57,
    longitude: 127.45,
    address: "전라남도 여수시 남면 우학보건소",
    type: "bus",
  },
  {
    id: "bus_10",
    name: "우학터미널",
    latitude: 34.575,
    longitude: 127.455,
    address: "전라남도 여수시 남면 우학터미널",
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
        name: "금오도 순환버스",
        type: "bus",
        stops: ["bus_1", "bus_2"],
      },
      {
        id: "route_2",
        name: "여수 금오도 연결버스",
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
    await mockDelay(2000); // 2초 지연으로 "호출 중..." 상태를 더 오래 보여줌
    const callId = `call_${Date.now()}`;

    // 시간표 기반 예상 시간 계산
    const getEstimatedTimes = (originStopId: string, destStopId: string) => {
      // 현재 시간 기준으로 다음 운행 시간 계산
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // 1호차 노선1 시간표: 7:00-7:30
      // 1호차 노선2 시간표: 7:30-7:52
      let boardingTime: Date;
      let alightingTime: Date;

      if (originStopId === "bus_1" && destStopId === "bus_4") {
        // 우실삼거리 -> 여천터미널 (1호차 노선1)
        boardingTime = new Date();
        boardingTime.setHours(8, 0, 0, 0); // 다음 운행 시간으로 설정
        alightingTime = new Date(boardingTime);
        alightingTime.setMinutes(alightingTime.getMinutes() + 7); // 7분 후 도착
      } else if (originStopId === "bus_1" && destStopId === "bus_10") {
        // 우실삼거리 -> 우학터미널 (1호차 노선2)
        boardingTime = new Date();
        boardingTime.setHours(8, 30, 0, 0);
        alightingTime = new Date(boardingTime);
        alightingTime.setMinutes(alightingTime.getMinutes() + 22); // 22분 후 도착
      } else {
        // 기본값
        boardingTime = new Date(Date.now() + 10 * 60 * 1000); // 10분 후
        alightingTime = new Date(Date.now() + 25 * 60 * 1000); // 25분 후
      }

      return {
        boarding: boardingTime.toISOString(),
        alighting: alightingTime.toISOString(),
        arrival: new Date(boardingTime.getTime() - 5 * 60 * 1000).toISOString(), // 탑승 5분 전 도착
      };
    };

    const times = getEstimatedTimes(request.originStopId, request.destStopId);

    return {
      id: callId,
      status: "confirmed",
      estimatedArrival: times.arrival,
      estimatedBoardingTime: times.boarding,
      estimatedAlightingTime: times.alighting,
      vehicleInfo: {
        id: "vehicle_1",
        type: request.mode === "passenger" ? "여객선" : "버스",
        licensePlate:
          request.mode === "passenger" ? "전남88바1234" : "전남70가5678",
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
      estimatedArrival: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      estimatedBoardingTime: new Date(
        Date.now() + 10 * 60 * 1000
      ).toISOString(),
      estimatedAlightingTime: new Date(
        Date.now() + 25 * 60 * 1000
      ).toISOString(),
      vehicleInfo: {
        id: "vehicle_1",
        type: "버스",
        licensePlate: "전남70가5678",
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
