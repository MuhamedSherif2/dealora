import type { ApiError } from "@/types/common";

// message = the backend's message, fields = first error per field path ("title.ar", "price"...)
export function parseApiError(err: unknown, fallback: string) {
  const body = (err as { data?: ApiError })?.data;
  const fields: Record<string, string> = {};
  body?.errors?.forEach((e) => {
    if (!(e.path in fields)) fields[e.path] = e.message;
  });
  return { message: body?.message ?? fallback, fields };
}