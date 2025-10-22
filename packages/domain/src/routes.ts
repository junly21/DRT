/**
 * 노선 인터페이스 정의
 */
export interface Route {
  id: string;
  name: string;
  description: string;
  duration: string;
  stops: string[];
  frequency: string;
  price?: number;
  color?: string;
}

/**
 * 금오도 버스 노선 데이터 (1호차, 2호차가 노선을 변경하며 운행)
 */
export const BUS_ROUTES: Route[] = [
  // 1호차 노선들
  {
    id: "bus-1-route-1",
    name: "1호차 노선1",
    description: "우실삼거리 - 소유 - 대유 - 여천터미널",
    stops: [
      "우실삼거리",
      "소유",
      "대유",
      "여천터미널",
      "대유",
      "소유",
      "우실삼거리",
    ],
    duration: "7:00-7:30 (30분)",
    frequency: "순환운행",
    color: "bg-blue-500",
  },
  {
    id: "bus-1-route-2",
    name: "1호차 노선2",
    description: "우실삼거리 - 모하 - 두포분무골 - 학동 - 직포",
    stops: [
      "우실삼거리",
      "모하",
      "두포분무골",
      "모하",
      "학동",
      "직포",
      "학동",
      "우실삼거리",
      "우학보건소",
      "우학터미널",
    ],
    duration: "7:30-7:52 (22분)",
    frequency: "순환운행",
    color: "bg-blue-500",
  },
  {
    id: "bus-1-route-3",
    name: "1호차 노선3",
    description: "녹동항 - 녹동삼거리 - 율림마을 - 녹동항",
    stops: ["녹동항", "녹동삼거리", "율림마을", "녹동항"],
    duration: "8:00-8:45 (45분)",
    frequency: "순환운행",
    color: "bg-blue-500",
  },
  {
    id: "bus-1-route-4",
    name: "1호차 노선4",
    description: "녹동항 - 녹동삼거리 - 신흥마을 - 녹동항",
    stops: ["녹동항", "녹동삼거리", "신흥마을", "녹동항"],
    duration: "9:00-9:50 (50분)",
    frequency: "순환운행",
    color: "bg-blue-500",
  },
  {
    id: "bus-1-route-5",
    name: "1호차 노선5",
    description: "녹동항 - 녹동삼거리 - 진목마을 - 녹동항",
    stops: ["녹동항", "녹동삼거리", "진목마을", "녹동항"],
    duration: "10:00-10:55 (55분)",
    frequency: "순환운행",
    color: "bg-blue-500",
  },
  {
    id: "bus-1-route-6",
    name: "1호차 노선6",
    description: "녹동항 - 녹동삼거리 - 덕촌마을 - 녹동항",
    stops: ["녹동항", "녹동삼거리", "덕촌마을", "녹동항"],
    duration: "11:00-12:00 (60분)",
    frequency: "순환운행",
    color: "bg-blue-500",
  },
  {
    id: "bus-1-route-7",
    name: "1호차 노선7",
    description: "녹동항 - 녹동삼거리 - 월호마을 - 녹동항",
    stops: ["녹동항", "녹동삼거리", "월호마을", "녹동항"],
    duration: "12:30-13:10 (40분)",
    frequency: "순환운행",
    color: "bg-blue-500",
  },
  {
    id: "bus-1-route-8",
    name: "1호차 노선8",
    description: "녹동항 - 녹동삼거리 - 봉정마을 - 녹동항",
    stops: ["녹동항", "녹동삼거리", "봉정마을", "녹동항"],
    duration: "13:30-14:15 (45분)",
    frequency: "순환운행",
    color: "bg-blue-500",
  },
  // 2호차 노선들
  {
    id: "bus-2-route-1",
    name: "2호차 노선1",
    description: "녹동항 - 녹동삼거리 - 석정마을 - 녹동항",
    stops: ["녹동항", "녹동삼거리", "석정마을", "녹동항"],
    duration: "7:15-7:50 (35분)",
    frequency: "순환운행",
    color: "bg-green-500",
  },
  {
    id: "bus-2-route-2",
    name: "2호차 노선2",
    description: "녹동항 - 녹동삼거리 - 용소마을 - 녹동항",
    stops: ["녹동항", "녹동삼거리", "용소마을", "녹동항"],
    duration: "8:15-8:55 (40분)",
    frequency: "순환운행",
    color: "bg-green-500",
  },
  {
    id: "bus-2-route-3",
    name: "2호차 노선3",
    description: "녹동항 - 녹동삼거리 - 화정마을 - 녹동항",
    stops: ["녹동항", "녹동삼거리", "화정마을", "녹동항"],
    duration: "9:15-10:00 (45분)",
    frequency: "순환운행",
    color: "bg-green-500",
  },
];

/**
 * 여객선용 버스 노선 데이터 (터미널로 가는 노선들)
 */
export const FERRY_BUS_ROUTES: Route[] = [
  {
    id: "ferry-bus-1-route-1",
    name: "1호차 노선1 (터미널행)",
    description: "우실삼거리 - 소유 - 대유 - 여천터미널",
    stops: ["우실삼거리", "소유", "대유", "여천터미널"],
    duration: "7:00-7:07 (7분)",
    frequency: "여객선 시간표 연계",
    color: "bg-blue-500",
  },
  {
    id: "ferry-bus-1-route-2",
    name: "1호차 노선2 (터미널행)",
    description: "우실삼거리 - 모하 - 두포분무골 - 우학터미널",
    stops: [
      "우실삼거리",
      "모하",
      "두포분무골",
      "모하",
      "학동",
      "직포",
      "학동",
      "우실삼거리",
      "우학보건소",
      "우학터미널",
    ],
    duration: "7:30-7:52 (22분)",
    frequency: "여객선 시간표 연계",
    color: "bg-blue-500",
  },
  {
    id: "ferry-bus-2-route-1",
    name: "2호차 노선1 (터미널행)",
    description: "석정마을 - 녹동삼거리 - 녹동항",
    stops: ["석정마을", "녹동삼거리", "녹동항"],
    duration: "7:15-7:35 (20분)",
    frequency: "여객선 시간표 연계",
    color: "bg-green-500",
  },
  {
    id: "ferry-bus-2-route-2",
    name: "2호차 노선2 (터미널행)",
    description: "용소마을 - 녹동삼거리 - 녹동항",
    stops: ["용소마을", "녹동삼거리", "녹동항"],
    duration: "8:15-8:40 (25분)",
    frequency: "여객선 시간표 연계",
    color: "bg-green-500",
  },
];
