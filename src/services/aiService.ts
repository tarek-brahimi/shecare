const API_URL = (import.meta.env.VITE_AI_API_URL || import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export interface PredictCancerResponse {
  resultat?: string;
  result?: string;
  probabilite?: number;
  probability?: number;
  message?: string;
}

export async function predictCancer(features: number[]): Promise<PredictCancerResponse> {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status}`);
  }

  return response.json() as Promise<PredictCancerResponse>;
}
