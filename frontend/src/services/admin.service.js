import { http } from "./http.js";

export async function fetchUsers({ signal } = {}) {
  const response = await http.get("/users", { signal });
  return response.data.data;
}

export async function fetchApiKeys({ signal } = {}) {
  const response = await http.get("/api-keys", { signal });
  return response.data.data;
}

export async function fetchOpsSummary({ signal } = {}) {
  const response = await http.get("/analytics/summary", { signal });
  return response.data.cards;
}
