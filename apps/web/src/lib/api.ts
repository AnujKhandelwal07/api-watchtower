const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  let responseBody: unknown;

  try {
    responseBody = await response.json();
  } catch {
    responseBody = null;
  }

  if (!response.ok) {
    const message =
      typeof responseBody === "object" &&
      responseBody !== null &&
      "message" in responseBody &&
      typeof responseBody.message === "string"
        ? responseBody.message
        : `Request failed with status ${response.status}`;

    const details =
      typeof responseBody === "object" &&
      responseBody !== null &&
      "errors" in responseBody
        ? JSON.stringify(responseBody.errors)
        : "";

    throw new Error(details ? `${message} - ${details}` : message);
  }

  return responseBody as T;
}