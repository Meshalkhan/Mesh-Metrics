import { http } from "./http.js";

export async function fetchDashboard(filters, { signal } = {}) {
  const response = await http.get("/dashboard", { params: filters, signal });
  return response.data;
}
