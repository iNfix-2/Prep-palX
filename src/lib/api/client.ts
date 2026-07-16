import type { ApiErrorBody, ApiOkBody } from "@/lib/server/api-response";

export class ApiError extends Error {
  status: number;
  code: string;
  requestId?: string;
  fields?: Record<string, string[]>;

  constructor({
    status,
    code,
    message,
    requestId,
    fields,
  }: {
    status: number;
    code: string;
    message: string;
    requestId?: string;
    fields?: Record<string, string[]>;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.fields = fields;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = payload as ApiErrorBody | null;
    throw new ApiError({
      status: response.status,
      code: errorBody?.error.code ?? "REQUEST_FAILED",
      message: errorBody?.error.message ?? "The request failed.",
      requestId: errorBody?.error.requestId,
      fields: errorBody?.error.fields,
    });
  }

  return (payload as ApiOkBody<T>).data;
}
