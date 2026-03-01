const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiFetch<T>(path: string, init?: RequestInit, retries = 2): Promise<T> {
  let attempt = 0;
  while (true) {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }
    });
    if (res.ok) return res.json() as Promise<T>;
    if (attempt >= retries) {
      throw new ApiError((await res.json().catch(() => ({ detail: 'Request failed' }))).detail, res.status);
    }
    attempt += 1;
    await wait(300 * attempt);
  }
}
