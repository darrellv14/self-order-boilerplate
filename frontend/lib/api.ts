const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type RequestOptions = {
  method?: string;
  token?: string;
  body?: unknown;
  isFormData?: boolean;
};

export async function api<T>(path: string, options: RequestOptions = {}) {
  const headers: HeadersInit = {};

  if (!options.isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body
      ? options.isFormData
        ? (options.body as BodyInit)
        : JSON.stringify(options.body)
      : undefined,
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data as T;
}
