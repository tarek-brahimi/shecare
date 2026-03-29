const API_URL = "http://127.0.0.1:8000";

export async function predictCancer(features: number[]) {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });
  return await response.json();
}