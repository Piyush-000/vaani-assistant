const API_URL = "http://127.0.0.1:8000";

export async function sendCommand(action: string, target: string) {
  const response = await fetch(`${API_URL}/command`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
      target,
    }),
  });

  return response.json();
}

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}