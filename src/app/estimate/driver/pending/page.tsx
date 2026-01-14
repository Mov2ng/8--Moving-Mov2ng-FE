"use client";

import React, { useState, useMemo } from "react";
import { Sidebar } from "../(components)/SideBar";
import { SearchBar } from "../(components)/SearchBar";
import { RequestList } from "../(components)/RequestList";
import { useGetDriverRequests, useRejectEstimate } from "@/hooks/useDriverRequest";
import { useAuth } from "@/hooks/useAuth";
import type { RequestItem } from "../(components)/RequestsCard";
import { useQueryClient } from "@tanstack/react-query";

export default function PendingPage() {
  const { me, isLoading: authLoading, isDriver } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [movingTypeFilter, setMovingTypeFilter] = useState<string[]>([]);
  const [isDesignatedFilter, setIsDesignatedFilter] = useState<
    boolean | undefined
  >(undefined);
  const [sort, setSort] = useState<"soonest" | "recent">("soonest");
  const [searchQuery, setSearchQuery] = useState("");

  // useRejectEstimate 쿼리를 사용하여 견적 반려 데이터를 가져옴
  const rejectEstimateMutation = useRejectEstimate();

  // userId 추출
  const userId = me?.id;

  // API 호출 파라미터 구성
  const queryParams = useMemo(() => {
    if (!userId) return null;

    return {
      userId,
      page,
      pageSize,
      ...(movingTypeFilter.length > 0 && {
        movingType: movingTypeFilter[0], // API는 단일 값만 받음
      }),
      ...(isDesignatedFilter !== undefined && {
        isDesignated: isDesignatedFilter,
      }),
      sort,
    };
  }, [userId, page, pageSize, movingTypeFilter, isDesignatedFilter, sort]);
   console.log(queryParams);
  // useGetDriverRequests 쿼리를 사용하여 driverRequests 데이터를 가져옴
  const { data, isLoading, error } = useGetDriverRequests(
    queryParams || { userId: "", page: 1, pageSize: 10 },
    !!queryParams && !!userId && !authLoading && isDriver
  );

  const handleReject = async (requestId: number) => {
    if (!confirm("정말 반려하시겠습니까?")) return;

    try {
      await rejectEstimateMutation.mutateAsync({
        userId: me?.id,
        requestId,
        requestReason: "반려합니다.",
      });
      // 쿼리 무효화하여 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["driverRequests"] });
      alert("반려되었습니다.");
    } catch (error) {
      console.error("반려 실패:", error);
      alert("반려 처리 중 오류가 발생했습니다.");
    }
  };

  // 필터링된 데이터
  const filteredItems: RequestItem[] = useMemo(() => {
    if (!data?.items) return [];

    let items = data.items as RequestItem[];

    // 검색어 필터링 (userId나 주소로 검색)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.userId?.toLowerCase().includes(query) ||
          item.origin?.toLowerCase().includes(query) ||
          item.destination?.toLowerCase().includes(query)
      );
    }

    return items;
  }, [data?.items, searchQuery]);

  if (authLoading) {
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

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-6">
          <Sidebar
            movingTypeFilter={movingTypeFilter}
            onMovingTypeFilterChange={setMovingTypeFilter}
            isDesignatedFilter={isDesignatedFilter}
            onIsDesignatedFilterChange={setIsDesignatedFilter}
          />
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <SearchBar
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                sort={sort}
                onSortChange={setSort}
              />
              {isLoading ? (
                <div className="p-5 text-center text-gray-500">
                  로딩 중...
                </div>
              ) : error ? (
                <div className="p-5 text-center text-red-500">
                  오류가 발생했습니다.
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="p-5 text-center text-gray-500">
                  요청이 없습니다.
                </div>
              ) : (
                <RequestList items={filteredItems} onReject={handleReject} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
