export function formatDate(ms?: number | null): string {
  if (!ms) {
    return "-";
  }
  const date = new Date(ms);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDispatchDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDirectionLabel(directionCode: string): string {
  const normalized = directionCode.trim().toUpperCase();
  switch (normalized) {
    case "UD":
      return "상행";
    case "DU":
    case "DD":
      return "하행";
    case "LR":
      return "순환";
    default:
      return normalized || "미정";
  }
}

