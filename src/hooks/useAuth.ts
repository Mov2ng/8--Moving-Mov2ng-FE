/**
 * 유저 기능 훅
 */

"use client";

import { userService } from "@/services/userService";
import { useApiMutation } from "./useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery } from "./useApiQuery";

export function useSignup() {
  return useApiMutation({
    mutationFn: userService.signup,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: userService.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useMe() {
  return useApiQuery({
    queryKey: ["me"],
    queryFn: userService.me,
    retry: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: userService.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useRefresh() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationFn: userService.refresh,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
