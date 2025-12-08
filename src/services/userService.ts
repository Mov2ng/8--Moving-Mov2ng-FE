/**
 * userService: user API endpoint layer
 * - signup
 * - login
 * - refresh
 * - me
 * - logout
 */

import { apiClient } from "@/libs/apiClient";

export const userService = {
  signup: (data: {
    name: string;
    email: string;
    phoneNum: number;
    password: string;
  }) => {
    apiClient("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  login: (data: { email: string; password: string }) => {
    apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  refresh: () => {
    apiClient("/auth/refresh", {
      method: "POST",
    });
  },
  me: () => {
    apiClient("/auth/me", {
      method: "GET",
    });
  },
  logout: () => {
    apiClient("/auth/logout", {
      method: "POST",
    });
  },
};
