const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface ApiError extends Error {
  status?: number;
}

interface RequestOptions extends RequestInit {
  signal?: AbortSignal;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const data = await response.json();
      if (data?.detail) {
        message = String(data.detail);
      } else if (data?.message) {
        message = String(data.message);
      }
    } catch {
      // ignore JSON parse errors, keep default message
    }

    const error: ApiError = new Error(message);
    error.status = response.status;
    throw error;
  }

  return (await response.json()) as T;
}

export { API_BASE_URL };

