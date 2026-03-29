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
  const maybeAuthHeaders = !skipAuth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  const response = await fetch(`${API_BASE_URL}${withQueryParams(path, params)}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
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
  return request<Post[]>(`${API_PREFIX}/posts`);
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

  if (Array.isArray(response)) {
    return response as Resource[];
  }

  if (isRecord(response)) {
    const resources = response.resources;
    if (Array.isArray(resources)) {
      return resources as Resource[];
    }

    const data = response.data;
    if (Array.isArray(data)) {
      return data as Resource[];
    }
  }

  return [];
}

export async function getUserStats() {
  return request<Stat[]>(`${API_PREFIX}/stats`);
}

export async function getCurrentUser() {
  return request<User>(`${API_PREFIX}/users/me`);
}

export async function getSymptoms() {
  return request<Symptom[]>(`${API_PREFIX}/symptoms`);
}

export async function createSymptom(payload: { name: string; severity: number; date?: string }) {
  return request<Symptom>(`${API_PREFIX}/symptoms`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAppointments() {
  return request<Appointment[]>(`${API_PREFIX}/appointments`);
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
  return request<User>(`${API_PREFIX}/auth/me`);
}
