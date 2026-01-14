"use client";

import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { apiClient } from "@/libs/apiClient";
import QuoteCard from "./QuoteCard";
import QuoteTabNav from "./QuoteTabNav";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { formatDateLabel } from "@/utils/date";
import { STALE_TIME } from "@/constants/query";

import type { ApiQuote, QuoteStatus } from "@/types/api/quotes";
import type { QuoteCardView } from "@/types/view/quote";
import { getServiceLabel } from "@/constants/profile.constants";

const statusMap: Record<QuoteStatus, "waiting" | "confirmed" | "rejected"> = {
  PENDING: "waiting",
  ACCEPTED: "confirmed",
  REJECTED: "rejected",
};

const adaptQuote = (item: ApiQuote): QuoteCardView => ({
  id: item.id,
  name: item.driver.nickname,
  profileImage: "/assets/image/avatartion-1.png", // 임시 프로필 이미지지
  rating: item.driver.rating ?? 0,
  reviewCount: item.driver.reviewCount ?? 0,
  experience: item.driver.driver_years ?? 0,
  confirmedCount: item.driver.confirmedCount ?? 0,
  likeCount: item.driver.likeCount ?? 0,
  status: statusMap[item.status],
  serviceType: getServiceLabel(item.request.moving_type),
  isDesignatedRequest: item.isRequest ?? false,
  designatedLabel: "지정 견적 요청",
  movingDate: formatDateLabel(item.request.moving_data),
  requestedAt: item.request.createdAt,
  departure: item.request.origin,
  arrival: item.request.destination,
  price: item.price,
});

const ENDPOINT = "/request/user/estimates";

export default function QuotePendingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const { data, isLoading, error } = useApiQuery<
    {
      success: boolean;
      message: string;
      data: ApiQuote[];
    },
    Error
  >({
    queryKey: ["quotes", "pending"],
    queryFn: async () => {
      return apiClient(ENDPOINT, {
        method: "GET",
        query: { status: "PENDING" },
      });
    },
    staleTime: STALE_TIME.ESTIMATE, // 30초 캐싱
  });

  const quotes: QuoteCardView[] = data?.data ? data.data.map(adaptQuote) : [];
  const summary = quotes[0];

  const { mutate: acceptQuote, isPending: isAccepting } = useApiMutation<
    { success: boolean; message: string },
    void,
    Error
  >({
    mutationFn: async () =>
      apiClient(`${ENDPOINT}/${confirmId}/pending/accept`, {
        method: "POST",
      }),
    onSuccess: () => {
      setConfirmId(null);
      queryClient.invalidateQueries({ queryKey: ["quotes", "pending"] });
      alert("견적을 확정했어요.");
    },
    onError: (err) => {
      alert(err.message ?? "견적 확정에 실패했습니다.");
    },
  });

  return (
    <>
      <div className="min-h-screen bg-background-200">
        <header className="bg-white border-b border-line-100">
          <div className="mx-auto max-w-6xl px-5">
            <QuoteTabNav />
          </div>
          {summary && (
            <div className="mx-auto max-w-6xl px-5 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-t border-line-100">
              <div className="flex flex-col gap-1">
                <span className="text-primary-black-400 pret-xl-semibold">
                  {summary.serviceType || "서비스 종류 미정"}
                </span>
                <span className="text-gray-400 pret-14-medium">
                  견적 신청일:{" "}
                  {summary.requestedAt
                    ? formatDateLabel(summary.requestedAt)
                    : "-"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-black-300 pret-15-medium">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-gray-300 pret-13-medium">출발지</span>
                  <span className="text-primary-black-400">
                    {summary.departure}
                  </span>
                </div>
                <div className="flex items-center text-primary-black-300">
                  →
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-gray-300 pret-13-medium">도착지</span>
                  <span className="text-primary-black-400">
                    {summary.arrival}
                  </span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-gray-300 pret-13-medium">이사일</span>
                  <span className="text-primary-black-400">
                    {summary.movingDate}
                  </span>
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="max-w-6xl mx-auto px-5 py-6">
          {isLoading && (
            <div className="text-center text-gray-400 pret-14-medium">
              불러오는 중...
            </div>
          )}
          {error && (
            <div className="text-center text-secondary-red-200 pret-14-medium">
              {error.message}
            </div>
          )}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  name={quote.name}
                  profileImage={quote.profileImage}
                  avatarSize="sm"
                  avatarResponsive={false}
                  ratingPlacement="meta"
                  rating={quote.rating}
                  reviewCount={quote.reviewCount}
                  experience={quote.experience}
                  confirmedCount={quote.confirmedCount}
                  likeCount={quote.likeCount}
                  status={quote.status}
                  serviceType={quote.serviceType}
                  isDesignatedRequest={quote.isDesignatedRequest}
                  movingDate={quote.movingDate}
                  departure={quote.departure}
                  arrival={quote.arrival}
                  price={quote.price}
                  onConfirm={() => setConfirmId(quote.id)}
                  onDetail={() =>
                    router.push(`/estimate/user/pending/${quote.id}`)
                  }
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <div className="pret-lg-semibold text-black-300 mb-2">
              견적을 확정하시겠습니까?
            </div>
            <p className="text-gray-500 pret-14-medium mb-6">
              확정 후에는 기사님과의 매칭이 진행됩니다.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                disabled={isAccepting}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-[12px] border border-primary-blue-300 text-primary-blue-300 pret-14-semibold hover:bg-primary-blue-50 transition-colors disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => acceptQuote()}
                disabled={isAccepting}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-[12px] bg-primary-blue-300 text-white pret-14-semibold hover:bg-primary-blue-400 transition-colors disabled:opacity-60"
              >
                {isAccepting ? "확정 중..." : "확정하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
