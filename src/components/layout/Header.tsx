"use client";

import { useAuth, useLogout } from "@/hooks/useAuth";
import Button from "../common/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  // TanStack Query로 사용자 상태 조회
  // useAuth 내부에서 서버 측 쿼리 활성화 여부 결정
  const { me, isGuest, isLoading } = useAuth();

  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      // 서버 요청 완료 대기 (refreshToken 쿠키 삭제 보장)
      await logoutMutation.mutateAsync();
    } catch {
      // 에러 발생해도 클라이언트 상태는 onError에서 정리됨
    } finally {
      // 서버 요청 완료 후 리디렉션
      router.push("/login");
    }
  };

  // 사용자 상태 조회 결과에 따라 렌더링
  return (
    <header>
      {isLoading ? (
        <span>로딩중...</span>
      ) : (
        <>
          {isGuest ? (
            <Button
              text="로그인"
              onClick={() => router.push("/login")}
              variant="outline"
              width="100px"
            />
          ) : (
            <>
              <span>{me?.name}</span>
              <Button
                text="로그아웃"
                onClick={handleLogout}
                variant="outline"
                width="100px"
              />
            </>
          )}
        </>
      )}
    </header>
  );
}
