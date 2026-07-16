import { randomUUID } from "node:crypto";

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    requestId: string;
    fields?: Record<string, string[]>;
  };
}

export interface ApiOkBody<T> {
  data: T;
}

export function apiOk<T>(data: T, init?: ResponseInit) {
  return Response.json({ data } satisfies ApiOkBody<T>, init);
}

export function apiError(
  code: string,
  message: string,
  status: number,
  fields?: Record<string, string[]>,
) {
  return Response.json(
    {
      error: {
        code,
        message,
        requestId: randomUUID(),
        ...(fields ? { fields } : {}),
      },
    } satisfies ApiErrorBody,
    { status },
  );
}
