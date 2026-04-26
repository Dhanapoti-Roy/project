import { apiRequest } from "./http";

export const authApi = {
  register: (payload) =>
    apiRequest("/auth/register", {
      method: "POST",
      // body: JSON.stringify(payload)
      body: payload
    }),

  login: (payload) =>
    apiRequest("/auth/login", {
      method: "POST",
      // body: JSON.stringify(payload)
      body: payload
    }),

  me: (token) =>
    apiRequest("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};