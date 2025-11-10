import { apiClient, api, type Stop } from "@drt/api-client";
import { calculateDistance } from "@drt/utils/geo";

const NEARBY_STATION_ENDPOINT = "/selectNearbyStationPostGIS.do";

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

  return {
    id,
    name,
    latitude,
    longitude,
    distance,
    stationNo: normalizeString(item.stn_no),
    stationType: normalizeString(item.stn_type),
    address: null,
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
