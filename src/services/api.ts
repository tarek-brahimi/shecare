import type { Appointment, Post, Resource, Stat, Symptom, User } from "@/types/domain";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
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
  return request<Post[]>("/api/posts");
}

export async function createPost(payload: { content: string; tags: string[] }) {
  return request<Post>("/api/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getResources() {
  return request<Resource[]>("/api/resources");
}

export async function getUserStats() {
  return request<Stat[]>("/api/stats");
}

export async function getCurrentUser() {
  return request<User>("/api/users/me");
}

export async function getSymptoms() {
  return request<Symptom[]>("/api/symptoms");
}

export async function createSymptom(payload: { name: string; severity: number; date?: string }) {
  return request<Symptom>("/api/symptoms", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAppointments() {
  return request<Appointment[]>("/api/appointments");
}

export async function createAppointment(payload: {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: Appointment["type"];
}) {
  return request<Appointment>("/api/appointments", {
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
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

export async function register(payload: RegisterPayload) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

export async function getAuthMe() {
  return request<User>("/api/auth/me");
}
