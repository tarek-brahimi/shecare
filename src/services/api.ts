import type { Appointment, Post, Resource, Stat, Symptom, User } from "@/types/domain";

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();
const API_PREFIX = "/api/v1";
const API_BASE_URL = RAW_API_BASE_URL ? RAW_API_BASE_URL.replace(/\/$/, "") : "";
const ACCESS_TOKEN_KEY = "shecare-access-token";

let accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_KEY);

export class ApiError extends Error {
  readonly status: number;
  readonly body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractArrayFromPayload<T>(value: unknown, preferredKeys: string[] = []): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (!isRecord(value)) {
    return [];
  }

  const queue: Array<{ node: unknown; depth: number }> = [{ node: value, depth: 0 }];
  const maxDepth = 3;
  const candidateKeys = [...preferredKeys, "data", "items", "results", "rows"];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || current.depth > maxDepth || !isRecord(current.node)) {
      continue;
    }

    for (const key of candidateKeys) {
      const candidate = current.node[key];
      if (Array.isArray(candidate)) {
        return candidate as T[];
      }
    }

    for (const nextValue of Object.values(current.node)) {
      if (Array.isArray(nextValue)) {
        return nextValue as T[];
      }

      if (isRecord(nextValue)) {
        queue.push({ node: nextValue, depth: current.depth + 1 });
      }
    }
  }

  return [];
}

function extractObjectFromPayload<T extends Record<string, unknown>>(value: unknown, preferredKeys: string[] = []): T | null {
  if (isRecord(value)) {
    for (const key of [...preferredKeys, "data", "result", "profile"]) {
      const candidate = value[key];
      if (isRecord(candidate)) {
        return candidate as T;
      }
    }

    return value as T;
  }

  return null;
}

function toMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (Array.isArray(value)) {
    const firstString = value.find((item) => typeof item === "string" && item.trim());
    return typeof firstString === "string" ? firstString : null;
  }

  return null;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) {
    return fallback;
  }

  if (!isRecord(error.body)) {
    return error.message || fallback;
  }

  const validationErrors = error.body.validationErrors;
  if (isRecord(validationErrors)) {
    const firstValidationError = Object.values(validationErrors)
      .map((value) => toMessage(value))
      .find((value): value is string => Boolean(value));

    if (firstValidationError) {
      return firstValidationError;
    }
  }

  const message = toMessage(error.body.message);
  return message || error.message || fallback;
}

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
};

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

function withQueryParams(path: string, params?: RequestOptions["params"]) {
  if (!params) {
    return path;
  }

  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { headers, params, skipAuth, ...restOptions } = options;
  const method = (restOptions.method ?? "GET").toUpperCase();
  const isGetRequest = method === "GET";
  const maybeAuthHeaders = !skipAuth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  const response = await fetch(`${API_BASE_URL}${withQueryParams(path, params)}`, {
    ...restOptions,
    cache: isGetRequest ? "no-store" : restOptions.cache,
    headers: {
      "Content-Type": "application/json",
      ...(isGetRequest ? { "Cache-Control": "no-cache", Pragma: "no-cache" } : {}),
      ...maybeAuthHeaders,
      ...headers,
    },
  });

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(`Request failed: ${response.status}`, response.status, body);
  }

  return body as T;
}

export async function getPosts() {
  const response = await request<unknown>(`${API_PREFIX}/posts`);
  return extractArrayFromPayload<Post>(response, ["posts"]);
}

export async function createPost(payload: {
  title?: string;
  authorName: string;
  author_id: string;
  content: string;
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
}) {
  return request<Post>(`${API_PREFIX}/posts`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function likePost(postId: string) {
  return request<unknown>(`${API_PREFIX}/posts/${postId}/like`, {
    method: "POST",
  });
}

export async function sharePost(postId: string) {
  return request<unknown>(`${API_PREFIX}/posts/${postId}/share`, {
    method: "POST",
  });
}

export async function commentOnPost(postId: string, comment: string) {
  return request<unknown>(`${API_PREFIX}/posts/${postId}/comment`, {
    method: "POST",
    body: JSON.stringify({ content: comment, comment }),
  });
}

export async function getResources() {
  const response = await request<unknown>(`${API_PREFIX}/resources`);
  return extractArrayFromPayload<Resource>(response, ["resources"]);
}

export async function getUserStats() {
  const response = await request<unknown>(`${API_PREFIX}/stats`);
  return extractArrayFromPayload<Stat>(response, ["stats"]);
}

export async function getCurrentUser() {
  const response = await request<unknown>(`${API_PREFIX}/users/me`);
  const user = extractObjectFromPayload<User & Record<string, unknown>>(response, ["user"]);
  if (!user) {
    throw new ApiError("Could not read current user payload", 500, response);
  }
  return user as User;
}

export async function getSymptoms() {
  const response = await request<unknown>(`${API_PREFIX}/symptoms`);
  return extractArrayFromPayload<Symptom>(response, ["symptoms"]);
}

export async function createSymptom(payload: { name: string; severity: number; date?: string }) {
  return request<Symptom>(`${API_PREFIX}/symptoms`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAppointments() {
  const response = await request<unknown>(`${API_PREFIX}/appointments`);
  return extractArrayFromPayload<Appointment>(response, ["appointments"]);
}

export async function createAppointment(payload: {
  user_id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: Appointment["type"];
}) {
  return request<Appointment>(`${API_PREFIX}/appointments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthPayload {
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export async function login(payload: AuthPayload) {
  return request<AuthResponse>(`${API_PREFIX}/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

export async function register(payload: RegisterPayload) {
  return request<AuthResponse>(`${API_PREFIX}/auth/register`, {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

export async function getAuthMe() {
  const response = await request<unknown>(`${API_PREFIX}/auth/me`);
  const user = extractObjectFromPayload<User & Record<string, unknown>>(response, ["user"]);
  if (!user) {
    throw new ApiError("Could not read auth profile payload", 500, response);
  }
  return user as User;
}
