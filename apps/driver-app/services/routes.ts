import { apiClient } from "@drt/api-client";
import { logApiRequest, logApiResponse } from "../utils/apiLogger";

const SELECT_ROUTE_LIST_ENDPOINT = "/selectRouteList.do";

interface SelectRouteListResponseItem {
  d_stn_id: string;
  area?: string;
  start_dt: number;
  end_dt: number;
  dir_cd?: string;
  route_id: string;
  route_nm: string;
  use_yn: string;
  o_stn_id: string;
  remark?: string | null;
}

export interface DriverRoute {
  routeId: string;
  routeName: string;
  originStopId: string;
  destinationStopId: string;
  directionCode: string;
  area: string;
  startDate: number;
  endDate: number;
  remark: string | null;
  isActive: boolean;
}

function mapToDriverRoute(item: SelectRouteListResponseItem): DriverRoute {
  return {
    routeId: item.route_id,
    routeName: item.route_nm?.trim() ?? "",
    originStopId: item.o_stn_id,
    destinationStopId: item.d_stn_id,
    directionCode: item.dir_cd?.trim() ?? "",
    area: item.area ?? "",
    startDate: item.start_dt,
    endDate: item.end_dt,
    remark: item.remark ?? null,
    isActive: item.use_yn?.toUpperCase() === "Y",
  };
}

export async function fetchDriverRoutes(): Promise<DriverRoute[]> {
  logApiRequest(SELECT_ROUTE_LIST_ENDPOINT, {});

  try {
    const response = await apiClient.post<SelectRouteListResponseItem[]>(
      SELECT_ROUTE_LIST_ENDPOINT,
      {}
    );

    if (!Array.isArray(response)) {
      throw new Error("노선 정보를 불러오지 못했습니다.");
    }

    logApiResponse(SELECT_ROUTE_LIST_ENDPOINT, response);

    return response.map(mapToDriverRoute);
  } catch (error) {
    console.error("[Driver][Routes] 노선 조회 실패", error);
    throw error;
  }
}
