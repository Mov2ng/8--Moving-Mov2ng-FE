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
    role: string;
    name: string;
    email: string;
    phoneNum: string;
    password: string;
    passwordConfirm: string;
  }) => {
    return apiClient("/auth/signup", {
      method: "POST",
      body: data,
    });
  },
  login: (data: { email: string; password: string; role: string }) => {
    return apiClient("/auth/login", {
      method: "POST",
      body: data,
    });
  },
  refresh: () => {
    // apiClient 사용시 무한루프 발생 가능해 별도 fetch 할 것
    return apiClient("/auth/refresh", {
      method: "POST",
    });
  },
  me: () => {
    return apiClient("/auth/me", {
      method: "GET",
    });
  },
  logout: () => {
    return apiClient("/auth/logout", {
      method: "POST",
    });
  },
};
