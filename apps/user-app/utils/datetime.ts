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
