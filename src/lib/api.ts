import { apiFetch } from "@/services/api";

export const apiClient = {
  get: async <T = any>(url: string) => {
    const data = await apiFetch<T>(url);
    return { data };
  },
  post: async <T = any>(url: string, body?: any) => {
    const data = await apiFetch<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  },
  patch: async <T = any>(url: string, body?: any) => {
    const data = await apiFetch<T>(url, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  },
  delete: async <T = any>(url: string) => {
    const data = await apiFetch<T>(url, { method: "DELETE" });
    return { data };
  },
};
