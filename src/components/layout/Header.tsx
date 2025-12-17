"use client";

import { useMe } from "@/hooks/useAuth";
import Button from "../common/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  // 사용자 정보 조회 및 추출
  // 매번 호출처럼 보이지만 실제 네트워크 요청은 매번X
  // 쿼리 클라이언트에 캐시된 데이터를 사용하기 때문에 매번 호출X
  // 캐시된 데이터가 있으면 캐시된 데이터를 사용하고, 없으면 네트워크 요청 (staleTime 설정에 따라 캐시 데이터 사용 여부 결정)
  const { data } = useMe();
  const user = data?.data;

  return (
    <header>
      {user ? (
        <>{user?.name}</>
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
