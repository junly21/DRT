import { apiClient } from "@drt/api-client";

const FERRY_SCHEDULE_ENDPOINT = "/getFerryScheduleInfo.do";

export interface FerryScheduleRequestPayload {
  pageNo: string;
  numOfRows: string;
  rlvtYmd: string;
  psnshpNm: string;
}

interface FerryScheduleApiItem {
  rlvt_ymd: string;
  sail_tm: string;
  psnshp_cd: string;
  psnshp_nm: string;
  oport_nm: string;
  lcns_seawy_nm: string;
  nvg_seawy_nm: string;
  nvg_drc_nm: string | null;
  pasngr_pscp_cnt: number;
  nvg_se_nm: string | null;
}

interface FerryScheduleApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: FerryScheduleApiItem[] | FerryScheduleApiItem | undefined;
      };
    };
  };
}

export interface FerrySchedule {
  date: string;
  sailTime: string;
  vesselName: string;
  routeName: string;
  direction: string;
  passengerCapacity: number;
}

const DEFAULT_VESSELS = ["한림페리9호", "금오고속페리호", "한려페리9호"];

function formatToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}

function normalizeItems(
  items: FerryScheduleApiItem[] | FerryScheduleApiItem | undefined
) {
  if (!items) {
    return [];
  }
  if (Array.isArray(items)) {
    return items;
  }
  return [items];
}

function mapSchedule(item: FerryScheduleApiItem): FerrySchedule | null {
  if (!item.sail_tm || item.nvg_drc_nm !== "역방향") {
    return null;
  }

  return {
    date: item.rlvt_ymd,
    sailTime: item.sail_tm,
    vesselName: item.psnshp_nm,
    routeName: item.lcns_seawy_nm,
    direction: item.nvg_drc_nm ?? "",
    passengerCapacity: item.pasngr_pscp_cnt,
  };
}

async function fetchScheduleByVessel(
  vesselName: string,
  date: string
): Promise<FerrySchedule[]> {
  const payload: FerryScheduleRequestPayload = {
    pageNo: "1",
    numOfRows: "100",
    rlvtYmd: date,
    psnshpNm: vesselName,
  };

  const response = await apiClient.post<FerryScheduleApiResponse>(
    FERRY_SCHEDULE_ENDPOINT,
    payload
  );

  console.log("[FerrySchedule] API 요청", {
    vesselName,
    payload,
  });
  console.log("[FerrySchedule] API 응답(raw)", {
    vesselName,
    response,
  });

  const items = normalizeItems(response.response.body.items.item);
  return items
    .map(mapSchedule)
    .filter((schedule): schedule is FerrySchedule => schedule !== null);
}

export async function fetchFerrySchedules(
  vessels: string[] = DEFAULT_VESSELS,
  date: string = formatToday()
): Promise<FerrySchedule[]> {
  const results = await Promise.all(
    vessels.map((vessel) =>
      fetchScheduleByVessel(vessel, date).catch((error) => {
        console.error("[FerrySchedule] API 호출 실패", vessel, error);
        return [];
      })
    )
  );

  const flattened = results.flat().sort((a, b) => {
    if (a.sailTime === b.sailTime) {
      return a.vesselName.localeCompare(b.vesselName, "ko");
    }
    return Number(a.sailTime) - Number(b.sailTime);
  });

  console.log("[FerrySchedule] 가공된 스케줄", flattened);

  return flattened;
}
