"use client";

import { useMe } from "@/hooks/useAuth";
import Button from "../common/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  // accessToken 체크 (클라이언트 사이드에서만)
  const hasAccessToken =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  // accessToken이 있을 때만 사용자 정보 조회
  const { data, error, isLoading, isFetching } = useMe(hasAccessToken);

  const user = data?.data;
  
  if (hasAccessToken && !user && !isLoading && !isFetching) {
    console.warn("⚠️ accessToken이 있는데 user 정보가 없습니다. 에러:", error);
  }
  
  return (
    <header>
      {user ? (
        <span>{user.name}</span>
      ) : (
        <Button
          text="로그인"
          onClick={() => router.push("/login")}
          variant="outline"
          width="100px"
        />
      )}
    </header>
  );
}
