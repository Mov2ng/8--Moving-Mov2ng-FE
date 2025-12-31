"use client";

import { useAuth } from "@/hooks/useAuth";
import Button from "../common/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  // TanStack Query로 사용자 상태 조회
  // useAuth 내부에서 서버 측 쿼리 활성화 여부 결정
  const { me, isGuest, isLoading } = useAuth();

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
              {/* <Button
                text="로그아웃"
                onClick={() => router.push("/logout")}
                variant="outline"
                width="100px"
              /> */}
            </>
          )}
        </>
      )}
    </header>
  );
}
