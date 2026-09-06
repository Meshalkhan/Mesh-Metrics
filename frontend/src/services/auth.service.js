import { http } from "./http.js";

export async function login({ email, password }) {
  const response = await http.post("/auth/login", { email, password });
  return response.data;
}
