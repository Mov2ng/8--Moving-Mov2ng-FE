// app/driver/received/page.tsx
"use client";

import React, { useMemo } from "react";
import { Sidebar } from "../(components)/SideBar";
import { SearchBar } from "../(components)/SearchBar";
import { RequestList } from "../(components)/RequestList";
import { useGetDriverRequests } from "@/hooks/useDriverRequest";
import { useAuth } from "@/hooks/useAuth";
import type { RequestItem } from "../(components)/RequestsCard";

export default function ReceivedPage() {
  const { me, isLoading: authLoading, isDriver } = useAuth();
  
  // userId 추출
  const userId = me?.id;

  // API 호출 파라미터 구성
  const queryParams = useMemo(() => {
    if (!userId) return null;

    return {
      userId,
      page: 1,
      pageSize: 20,
    };
  }, [userId]);

  console.log(`queryParams:`, queryParams);
  // useGetDriverRequests 쿼리를 사용하여 driverRequests 데이터를 가져옴
  const { data, isLoading, error } = useGetDriverRequests(
    queryParams || { userId: "", page: 1, pageSize: 20 },
    !!queryParams && !!userId && !authLoading && isDriver
  );

  // data?.items를 RequestItem[] 타입으로 타입 추론
  const items: RequestItem[] = (data?.items || []) as RequestItem[];

  if (authLoading || isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div>로그인이 필요합니다.</div>
      </div>
    );
  }

  if (!isDriver) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div>기사님만 접근 가능한 페이지입니다.</div>
      </div>
    );
  }

  // error가 Error 타입일 때 error.message 사용, 그 외에는 "데이터 로드 실패" 메시지 표시
  if (error)
    return (
      <div className="p-6 text-red-500">
        에러: {error instanceof Error ? error.message : "데이터 로드 실패"}
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-6">
          <Sidebar />
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <SearchBar />
              {items.length === 0 ? (
                <div className="p-5 text-center text-gray-500">
                  요청이 없습니다.
                </div>
              ) : (
                <RequestList items={items} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
