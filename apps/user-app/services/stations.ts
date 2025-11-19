import { apiClient, api, type Stop } from "@drt/api-client";
import { calculateDistance } from "@drt/utils/geo";
import { formatDispatchDate } from "../utils/datetime";

const NEARBY_STATION_ENDPOINT = "/selectNearbyStationPostGIS.do";
const ALIGHTING_STATION_ENDPOINT = "/selectAlghStationList.do";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface NearbyStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  stationNo?: string | null;
  stationType?: string | null;
  address?: string | null;
  direction?: string | null;
  raw?: NearbyStationApiItem;
}

interface NearbyStationApiItem {
  stn_no?: string | number;
  stn_nm?: string;
  gps_x?: number | string;
  gps_y?: number | string;
  dist_m?: number | string;
  stn_type?: string;
  stn_id?: string;
  direction?: string;
  [key: string]: unknown;
}

function normalizeNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return null;
}

function mapApiItem(
  item: NearbyStationApiItem,
  reference: Coordinates
): NearbyStop | null {
  const latitude = normalizeNumber(item.gps_y);
  const longitude = normalizeNumber(item.gps_x);

  if (latitude === null || longitude === null) {
    return null;
  }

  const distance =
    normalizeNumber(item.dist_m) ??
    calculateDistance(reference, { latitude, longitude });

  const id =
    normalizeString(item.stn_id) ??
    normalizeString(item.stn_no) ??
    `${latitude},${longitude}`;

  const name = normalizeString(item.stn_nm) ?? "이름 없는 정류장";
  const direction = normalizeString(item.direction) || "방향정보없음";

  return {
    id,
    name,
    latitude,
    longitude,
    distance,
    stationNo: normalizeString(item.stn_no),
    stationType: normalizeString(item.stn_type),
    address: null,
    direction,
    raw: item,
  };
}

function mapMockStop(reference: Coordinates, stop: Stop): NearbyStop {
  return {
    id: stop.id,
    name: stop.name,
    latitude: stop.latitude,
    longitude: stop.longitude,
    distance: calculateDistance(reference, {
      latitude: stop.latitude,
      longitude: stop.longitude,
    }),
    stationNo: null,
    stationType: stop.type,
    address: stop.address ?? null,
    direction: "방향정보없음",
  };
}

export async function fetchNearbyStops({
  latitude,
  longitude,
}: Coordinates): Promise<NearbyStop[]> {
  const payload = {
    LAT: latitude.toString(),
    LON: longitude.toString(),
  };

  try {
    const data = await apiClient.post<NearbyStationApiItem[]>(
      NEARBY_STATION_ENDPOINT,
      payload
    );

    if (!Array.isArray(data)) {
      throw new Error("Unexpected station response");
    }

    return data
      .map((item) => mapApiItem(item, { latitude, longitude }))
      .filter((item): item is NearbyStop => item !== null)
      .sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.warn(
      "[stations] 인근 정류장 API 호출 실패, mock 데이터로 대체합니다.",
      error
    );

    const fallbackStops = await api.getStops();
    return fallbackStops
      .map((stop) => mapMockStop({ latitude, longitude }, stop))
      .sort((a, b) => a.distance - b.distance);
  }
}

interface AlightingStationApiItem {
  point_type?: string;
  stn_no?: string | number;
  point_id?: string;
  stn_nm?: string;
  route_id?: string;
  required_min?: number | string;
  point_seq?: number | string;
  dist_m?: number | string;
  stn_id?: string;
  direction?: string;
  [key: string]: unknown;
}

export interface AlightingStop {
  id: string;
  point_type: string | null;
  stn_no: string | null;
  stn_id: string | null;
  stn_nm: string;
  route_id: string | null;
  required_min: number | null;
  point_seq: number | null;
  dist_m: number | null;
  direction: string | null;
  raw?: AlightingStationApiItem;
}

interface FetchAlightingStopsParams extends Coordinates {
  routeId: string;
}

function mapAlightingApiItem(
  item: AlightingStationApiItem
): AlightingStop | null {
  const name = normalizeString(item.stn_nm) ?? "이름 없는 정류장";
  const id = normalizeString(item.stn_no) ?? name;

  if (!id) {
    return null;
  }

  const direction = normalizeString(item.direction) || "방향정보없음";

  return {
    id,
    point_type: normalizeString(item.point_type),
    stn_no: normalizeString(item.stn_no),
    stn_id: normalizeString(item.stn_id),
    stn_nm: name,
    route_id: normalizeString(item.route_id),
    required_min: normalizeNumber(item.required_min),
    point_seq: normalizeNumber(item.point_seq),
    dist_m: normalizeNumber(item.dist_m),
    direction,
    raw: item,
  };
}

export async function fetchAlightingStops({
  latitude,
  longitude,
}: Coordinates): Promise<AlightingStop[]> {
  const payload = {
    LAT: latitude.toString(),
    LON: longitude.toString(),
  };

  console.log(payload);

  const data = await apiClient.post<AlightingStationApiItem[]>(
    ALIGHTING_STATION_ENDPOINT,
    payload
  );

  if (!Array.isArray(data)) {
    throw new Error("Unexpected alighting station response");
  }
  console.log("api응답", data);
  return data
    .map(mapAlightingApiItem)
    .filter((item): item is AlightingStop => item !== null)
    .sort((a, b) =>
      a.stn_nm.localeCompare(b.stn_nm, "ko", { sensitivity: "base" })
    );
}

// Ferry boarding stops API
const FERRY_BOARDING_STATION_ENDPOINT = "/selectStartStnIdForFerry.do";

interface FerryBoardingStationApiItem {
  stn_no?: string | number;
  stn_nm?: string;
  stn_id?: string;
  gps_x?: number | string;
  gps_y?: number | string;
  dist_m?: number | string;
  dispatch_seq?: number | string;
  route_id?: string;
  vehicle_id?: string;
  end_point_id?: string;
  dispatch_dt?: number | string;
  algh_dtm?: number | string;
  end_algh_dtm?: number | string;
  end_seq?: number | string;
  direction?: string;
  [key: string]: unknown;
}

interface FerryBoardingStationApiResponse {
  RESULT: "SUCCESS" | "FAIL";
  MESSAGE?: string;
  START_STN_LIST?: FerryBoardingStationApiItem[];
}

export interface FerryBoardingStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  stationNo?: string | null;
  stationId?: string | null;
  dispatchSeq?: number | null;
  routeId?: string | null;
  vehicleId?: string | null;
  endPointId?: string | null;
  direction?: string | null;
  raw?: FerryBoardingStationApiItem;
}

interface FetchFerryBoardingStopsParams extends Coordinates {
  endPointId: string;
  dispatchDate?: string; // YYYY-MM-DD 형식
}

function mapFerryBoardingApiItem(
  item: FerryBoardingStationApiItem,
  reference: Coordinates
): FerryBoardingStop | null {
  const latitude = normalizeNumber(item.gps_y);
  const longitude = normalizeNumber(item.gps_x);

  if (latitude === null || longitude === null) {
    return null;
  }

  const distance =
    normalizeNumber(item.dist_m) ??
    calculateDistance(reference, { latitude, longitude });

  const id =
    normalizeString(item.stn_id) ??
    normalizeString(item.stn_no) ??
    `${latitude},${longitude}`;

  const name = normalizeString(item.stn_nm) ?? "이름 없는 정류장";
  const direction = normalizeString(item.direction) || "방향정보없음";

  return {
    id,
    name,
    latitude,
    longitude,
    distance,
    stationNo: normalizeString(item.stn_no),
    stationId: normalizeString(item.stn_id),
    dispatchSeq: normalizeNumber(item.dispatch_seq),
    routeId: normalizeString(item.route_id),
    vehicleId: normalizeString(item.vehicle_id),
    endPointId: normalizeString(item.end_point_id),
    direction,
    raw: item,
  };
}

export async function fetchFerryBoardingStops({
  latitude,
  longitude,
  endPointId,
  dispatchDate,
}: FetchFerryBoardingStopsParams): Promise<FerryBoardingStop[]> {
  const payload = {
    DISPATCH_DT: dispatchDate || formatDispatchDate(),
    END_POINT_ID: endPointId,
    LAT: latitude.toString(),
    LON: longitude.toString(),
  };

  console.log("[FerryBoardingStops] API 요청", payload);

  const data = await apiClient.post<FerryBoardingStationApiResponse[]>(
    FERRY_BOARDING_STATION_ENDPOINT,
    payload
  );

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Unexpected ferry boarding station response");
  }

  const [response] = data;

  if (response.RESULT === "FAIL") {
    const message = response.MESSAGE || "승차 가능한 정류장이 없습니다.";
    console.warn("[FerryBoardingStops] API 실패", message);
    throw new Error(message);
  }

  if (response.RESULT !== "SUCCESS" || !response.START_STN_LIST) {
    throw new Error("Unexpected ferry boarding station response format");
  }

  console.log("[FerryBoardingStops] API 응답", response);

  return response.START_STN_LIST.map((item) =>
    mapFerryBoardingApiItem(item, { latitude, longitude })
  )
    .filter((item): item is FerryBoardingStop => item !== null)
    .sort((a, b) => a.distance - b.distance);
}
