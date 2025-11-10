export interface NearbyStationRequestPayload {
  LAT: string | number;
  LON: string | number;
}

/**
 * 백엔드 `/selectNearbyStationPostGIS.do` 응답 스키마 추정치
 * 실제 필드는 백엔드 연동 이후 보정 가능
 */
export interface NearbyStationResponseItem {
  [key: string]: unknown;
  NODE_ID?: string | number;
  NODE_NAME?: string;
  STOP_ID?: string | number;
  STOP_NAME?: string;
  STATION_ID?: string | number;
  STATION_NAME?: string;
  LAT?: string | number;
  LON?: string | number;
  latitude?: string | number;
  longitude?: string | number;
  ADDRESS?: string;
  address?: string;
  distance?: string | number;
}

export interface StationStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  raw: NearbyStationResponseItem;
}

export interface StationStopWithDistance extends StationStop {
  distance: number;
}
