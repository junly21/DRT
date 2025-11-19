export function formatCallDateTime(date: Date = new Date()): string {
  const pad = (value: number) => value.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatDispatchDate(date: Date = new Date()): string {
  const pad = (value: number) => value.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

export function formatTimestampToReadable(
  timestamp?: number,
  options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }
): string | null {
  if (!timestamp) {
    return null;
  }

  try {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("ko-KR", options).format(date);
  } catch (error) {
    console.warn("[datetime] Invalid timestamp", timestamp, error);
    return null;
  }
}

export function formatEpochMsToCallDateTime(epochMs: number): string {
  return formatCallDateTime(new Date(epochMs));
}

export function formatEpochMsToDispatchDate(epochMs: number): string {
  return formatDispatchDate(new Date(epochMs));
}

/**
 * "2025-11-14 10:29:59" 형식의 문자열을 날짜와 시간으로 분리
 */
export function parseCallDateTime(callDtm: string): {
  date: string;
  time: string;
} | null {
  try {
    // "2025-11-14 10:29:59" 형식 파싱
    const [datePart, timePart] = callDtm.split(" ");
    if (!datePart || !timePart) {
      return null;
    }

    // 시간에서 초 제거 (10:29:59 -> 10:29)
    const timeWithoutSeconds = timePart.split(":").slice(0, 2).join(":");

    return {
      date: datePart,
      time: timeWithoutSeconds,
    };
  } catch (error) {
    console.warn("[datetime] Failed to parse call_dtm", callDtm, error);
    return null;
  }
}

/**
 * 결제 수단 코드를 한글 표시명으로 변환
 */
export function formatPaymentMethod(payment: "CARD" | "CASH" | "MOBILE"): string {
  switch (payment) {
    case "CARD":
      return "카드";
    case "CASH":
      return "현금";
    case "MOBILE":
      return "모바일";
    default:
      return payment;
  }
}
