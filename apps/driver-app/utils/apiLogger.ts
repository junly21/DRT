export function logApiRequest(endpoint: string, payload?: unknown) {
  console.log("[Driver][API] 요청", { endpoint, payload });
}

export function logApiResponse(endpoint: string, response: unknown) {
  console.log("[Driver][API] 응답", { endpoint, response });
}

export function logApiError(endpoint: string, error: unknown) {
  console.error("[Driver][API] 오류", { endpoint, error });
}

