const RAW_API_URL = (import.meta.env.VITE_AI_API_URL || import.meta.env.VITE_API_BASE_URL || "").trim();
const API_URL = RAW_API_URL ? RAW_API_URL.replace(/\/$/, "") : "";
const AI_PREDICT_PATH = "/api/v1/predict";

export interface PredictCancerResponse {
  resultat?: string;
  result?: string;
  probabilite?: number;
  probability?: number;
  message?: string;
}

export async function predictCancer(features: number[]): Promise<PredictCancerResponse> {
  const response = await fetch(`${API_URL}${AI_PREDICT_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status}`);
  }

  return response.json() as Promise<PredictCancerResponse>;
}
