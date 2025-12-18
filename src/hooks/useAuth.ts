/**
 * 유저 기능 훅
 */

"use client";

import { userService } from "@/services/userService";
import { useApiMutation } from "./useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery } from "./useApiQuery";
import { useRouter } from "next/navigation";

export function useSignup() {
  const router = useRouter();

  return useApiMutation({
    mutationKey: ["signup"],
    mutationFn: userService.signup,
    onSuccess: () => {
      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      router.push("/login");
    },
    onError: (error) => {
      console.error("회원가입 실패: ", error);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useApiMutation({
    mutationKey: ["login"],
    mutationFn: userService.login,
    onSuccess: (data) => {
      // 1. api 응답에서 accessToken get
      const { accessToken } = data.data;

      // 2. localStorage에 accessToken 저장 (apiClient에서 읽기 위해)
      if (typeof window !== "undefined" && accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      // 3. 사용자 정보(me) 쿼리 무효화해 최신 정보로 업데이트
      queryClient.invalidateQueries({ queryKey: ["me"] });

      // 4. 메인 페이지로 리디렉션합니다.
      alert("로그인이 완료되었습니다");
      router.push("/");
    },
    onError: (error) => {
      console.error("로그인 실패: ", error);
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
    mutationKey: ["logout"],
    mutationFn: userService.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useRefresh() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationKey: ["refresh"],
    mutationFn: userService.refresh,
    onSuccess: (data) => {
      // refresh 성공 시 새 accessToken을 localStorage에 저장
      const { accessToken } = data.data;
      if (typeof window !== "undefined" && accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
