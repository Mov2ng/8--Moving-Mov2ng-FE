"use client";

import React, { useState, useMemo } from "react";
import { useGetDriverDesignatedRequests } from "@/hooks/useDriverRequest";
import { useAuth } from "@/hooks/useAuth";
import PendingEstimateCard, {
  type PendingEstimateItem,
} from "../(components)/PendingEstimateCard";

export default function PendingPage() {
  const { me, isLoading: authLoading, isDriver } = useAuth();
  const [activeTab, setActiveTab] = useState<"sent" | "rejected">("sent");
  const [page] = useState(1);
  const [pageSize] = useState(20);

  // userId 추출
  const userId = me?.id;

  // API 호출 파라미터 구성
  const queryParams = useMemo(() => {
    if (!userId) return null;

    return {
      userId,
      page,
      pageSize,
      sort: "recent" as const,
    };
  }, [userId, page, pageSize]);

  // 보낸 견적 조회 (지정 견적 요청 리스트 사용)
  const { data: sentData, isLoading: sentLoading } =
    useGetDriverDesignatedRequests(
      queryParams || { userId: "", page: 1, pageSize: 20 },
      !!queryParams && !!userId && !authLoading && isDriver && activeTab === "sent"
    );

  // 필터링된 데이터
  const sentItems: PendingEstimateItem[] = useMemo(() => {
    if (!sentData?.items) return [];

    return sentData.items
      .filter((item) => {
        // estimateId가 있고 REJECTED가 아닌 것만 (보낸 견적)
        return (
          item.estimateId !== null &&
          item.estimateId !== undefined &&
          item.estimateStatus !== "REJECTED"
        );
      })
      .map((item) => ({
        ...item,
        isCompleted: false, // TODO: 완료 여부 판단 로직 추가 필요
      })) as PendingEstimateItem[];
  }, [sentData]);

  const rejectedItems: PendingEstimateItem[] = useMemo(() => {
    if (!sentData?.items) return [];

    return sentData.items
      .filter((item) => {
        // estimateStatus가 REJECTED인 것만
        return item.estimateStatus === "REJECTED";
      })
      .map((item) => ({
        ...item,
        isCompleted: false,
      })) as PendingEstimateItem[];
  }, [sentData]);

  const displayItems =
    activeTab === "sent" ? sentItems : rejectedItems;
  const isLoading = sentLoading;

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
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* 탭 */}
        <div className="flex items-center gap-6 border-b border-line-100 mb-8">
          <button
            onClick={() => setActiveTab("sent")}
            className={`relative pb-2 pret-lg-semibold transition-colors ${
              activeTab === "sent"
                ? "text-black-400"
                : "text-gray-300 hover:text-black-300"
            }`}
          >
            보낸 견적 조회
            {activeTab === "sent" && (
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-black-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`relative pb-2 pret-lg-semibold transition-colors ${
              activeTab === "rejected"
                ? "text-black-400"
                : "text-gray-300 hover:text-black-300"
            }`}
          >
            반려 요청
            {activeTab === "rejected" && (
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-black-400" />
            )}
          </button>
        </div>

        {/* 카드 그리드 */}
        {isLoading ? (
          <div className="text-center text-gray-400 pret-14-medium py-12">
            로딩 중...
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center text-gray-400 pret-14-medium py-12">
            {activeTab === "sent" ? "보낸 견적이 없습니다." : "반려된 요청이 없습니다."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayItems.map((item) => (
              <PendingEstimateCard
                key={item.requestId}
                item={item}
                isRejected={activeTab === "rejected"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
