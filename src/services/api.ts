const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export class ApiError extends Error {
  readonly status: number;
  readonly fields: Record<string, string[]>;

  constructor(message: string, status: number, fields: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!baseUrl) throw new Error("API is not configured");
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init.headers } });
  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => ({ message: "Request failed" }));
    const body = payload && typeof payload === "object" ? payload as { message?: unknown; errors?: { fieldErrors?: unknown } } : {};
    const fieldErrors = body.errors?.fieldErrors;
    throw new ApiError(
      typeof body.message === "string" ? body.message : "Request failed",
      response.status,
      fieldErrors && typeof fieldErrors === "object" ? fieldErrors as Record<string, string[]> : {},
    );
  }
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
}
