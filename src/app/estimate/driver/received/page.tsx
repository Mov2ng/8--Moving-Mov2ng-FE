// app/driver/received/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Sidebar } from "../(components)/SideBar";
import { SearchBar } from "../(components)/SearchBar";
import { RequestList } from "../(components)/RequestList";
import {
  useGetDriverRequests,
  useRejectEstimate,
  useAcceptEstimate,
} from "@/hooks/useDriverRequest";
import { useAuth } from "@/hooks/useAuth";
import type { RequestItem } from "../(components)/RequestsCard";
import { useQueryClient } from "@tanstack/react-query";
import SendEstimateModal from "../(components)/SendEstimateModal";
import RejectEstimateModal from "../(components)/RejectEstimateModal";
import type { DriverRequestDetail } from "@/types/api/driverRequest";
import { parseServerError } from "@/utils/parseServerError";

export default function ReceivedPage() {
  const { me, isLoading: authLoading, isDriver } = useAuth();
  const queryClient = useQueryClient();
  const [page] = useState(1);
  const [pageSize] = useState(20);
  const [movingTypeFilter, setMovingTypeFilter] = useState<string[]>([]);
  const [isDesignatedFilter, setIsDesignatedFilter] = useState<
    boolean | undefined
  >(undefined);
  const [sort, setSort] = useState<"soonest" | "recent">("soonest");
  const [searchQuery, setSearchQuery] = useState("");

  const rejectEstimateMutation = useRejectEstimate();
  const acceptEstimateMutation = useAcceptEstimate();
  const [selectedItem, setSelectedItem] = useState<RequestItem | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

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
        movingType: movingTypeFilter[0],
      }),
      ...(isDesignatedFilter !== undefined && {
        isDesignated: isDesignatedFilter,
      }),
      sort,
    };
  }, [userId, page, pageSize, movingTypeFilter, isDesignatedFilter, sort]);

  // useGetDriverRequests 쿼리를 사용하여 driverRequests 데이터를 가져옴
  const { data, isLoading } = useGetDriverRequests(
    queryParams || { userId: "", page: 1, pageSize: 20 },
    !!queryParams && !!userId && !authLoading && isDriver
  );

  // DriverRequest를 DriverRequestDetail로 변환
  const convertToDetail = (item: RequestItem): DriverRequestDetail => {
    return {
      requestId: item.requestId,
      movingType: item.movingType,
      movingDate: item.movingDate ?? "",
      origin: item.origin ?? "",
      destination: item.destination ?? "",
      userId: item.userId ?? "",
      userName: item.userName ?? undefined,
    };
  };

  const handleSendEstimate = (item: RequestItem) => {
    setSelectedItem(item);
    setIsSendModalOpen(true);
  };

  const handleReject = (item: RequestItem) => {
    setSelectedItem(item);
    setIsRejectModalOpen(true);
  };

  const handleSendEstimateSubmit = async (payload: {
    price: number;
    requestReason: string;
  }) => {
    if (!selectedItem) return;

    try {
      await acceptEstimateMutation.mutateAsync({
        userId: me?.id,
        requestId: selectedItem.requestId,
        price: payload.price,
        requestReason: payload.requestReason,
      });
      queryClient.invalidateQueries({ queryKey: ["driverRequests"] });
      setIsSendModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("견적 보내기 실패:", error);
      
      // 에러 메시지 추출
      const parsedError = parseServerError(error);
      let errorMessage = parsedError?.message || "견적 보내기에 실패했습니다. 다시 시도해주세요.";
      
      // 한국어 메시지로 변환
      if (errorMessage.includes("Estimate already decided")) {
        errorMessage = "이미 처리된 견적 요청입니다.";
      } else if (errorMessage.includes("already decided")) {
        errorMessage = "이미 결정된 견적입니다.";
      }
      
      alert(errorMessage);
    }
  };

  const handleRejectSubmit = async (payload: { requestReason: string }) => {
    if (!selectedItem) return;

    try {
      await rejectEstimateMutation.mutateAsync({
        userId: me?.id,
        requestId: selectedItem.requestId,
        requestReason: payload.requestReason,
      });
      queryClient.invalidateQueries({ queryKey: ["driverRequests"] });
      setIsRejectModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("반려 실패:", error);
      
      // 에러 메시지 추출
      const parsedError = parseServerError(error);
      let errorMessage = parsedError?.message || "반려 처리에 실패했습니다. 다시 시도해주세요.";
      
      // 한국어 메시지로 변환
      if (errorMessage.includes("Estimate already decided")) {
        errorMessage = "이미 처리된 견적 요청입니다.";
      } else if (errorMessage.includes("already decided")) {
        errorMessage = "이미 결정된 견적입니다.";
      }
      
      alert(errorMessage);
    }
  };

  // data?.items를 RequestItem[] 타입으로 타입 추론
  const items: RequestItem[] = useMemo(() => {
    if (!data?.items) return [];
    return data.items as RequestItem[];
  }, [data?.items]);

  // 필터링된 데이터 (검색어 필터링 + 반려/보낸 견적 제외)
  const filteredItems: RequestItem[] = useMemo(() => {
    if (!items || items.length === 0) return [];

    // 반려된 견적과 보낸 견적이 있는 데이터 제외
    let filtered = items.filter((item) => {
      // estimateId가 있으면 견적을 보낸 것 → 제외
      if (item.estimateId !== null && item.estimateId !== undefined) {
        return false;
      }
      // estimateStatus가 REJECTED면 반려된 것 → 제외
      if (item.estimateStatus === "REJECTED") {
        return false;
      }
      return true;
    });

    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.userId?.toLowerCase().includes(query) ||
          item.origin?.toLowerCase().includes(query) ||
          item.destination?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [items, searchQuery]);

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
            items={items}
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
              ) : filteredItems.length === 0 ? (
                <div className="p-5 text-center text-gray-500">
                  요청이 없습니다.
                </div>
              ) : (
                <RequestList
                  items={filteredItems}
                  onReject={handleReject}
                  onSendEstimate={handleSendEstimate}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* 견적 보내기 모달 */}
      {selectedItem && (
        <SendEstimateModal
          open={isSendModalOpen}
          onClose={() => {
            setIsSendModalOpen(false);
            setSelectedItem(null);
          }}
          data={convertToDetail(selectedItem)}
          onSubmit={handleSendEstimateSubmit}
          isSubmitting={acceptEstimateMutation.isPending}
          isDesignated={selectedItem.isDesignated ?? false}
        />
      )}

      {/* 반려 모달 */}
      {selectedItem && (
        <RejectEstimateModal
          open={isRejectModalOpen}
          onClose={() => {
            setIsRejectModalOpen(false);
            setSelectedItem(null);
          }}
          data={convertToDetail(selectedItem)}
          onSubmit={handleRejectSubmit}
          isSubmitting={rejectEstimateMutation.isPending}
          isDesignated={selectedItem.isDesignated ?? false}
        />
      )}
    </div>
  );
}
