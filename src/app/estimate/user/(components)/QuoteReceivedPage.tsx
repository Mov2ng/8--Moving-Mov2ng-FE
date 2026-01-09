"use client";

import { useApiQuery } from "@/hooks/useApiQuery";
import { apiClient } from "@/libs/apiClient";
import Link from "next/link";
import QuoteCard from "./QuoteCard";
import QuoteTabNav from "./QuoteTabNav";
import FilterDropdown from "@/components/common/FilterDropdown";
import { formatDateLabel, formatDateTime } from "@/utils/date";
import { useState } from "react";
import { STALE_TIME } from "@/constants/query";

import type { ApiQuote, QuoteStatus } from "@/types/api/quotes";
import type { QuoteCardView } from "@/types/view/quote";

const statusMap: Record<QuoteStatus, "waiting" | "confirmed" | "rejected"> = {
  PENDING: "waiting",
  ACCEPTED: "confirmed",
  REJECTED: "rejected",
};

const movingTypeMap: Record<string, string> = {
  SMALL: "소형이사",
  HOME: "가정이사",
  OFFICE: "사무실이사",
};

const adaptQuote = (item: ApiQuote): QuoteCardView => ({
  id: item.id,
  name: item.driver.nickname,
  profileImage: "/assets/image/avatartion-1.png", // 임시 프로필 이미지
  rating: item.driver.rating ?? 0,
  reviewCount: item.driver.reviewCount ?? 0,
  experience: item.driver.driver_years ?? 0,
  confirmedCount: item.driver.confirmedCount ?? 0,
  likeCount: item.driver.likeCount ?? 0,
  status: statusMap[item.status],
  serviceType:
    movingTypeMap[item.request.moving_type] ?? item.request.moving_type,
  isDesignatedRequest: item.isRequest ?? false,
  designatedLabel: "지정 견적 요청",
  movingDate: formatDateLabel(item.request.moving_data),
  movingDateTimeLabel: formatDateTime(item.request.moving_data),
  requestedAt: item.request.createdAt,
  departure: item.request.origin,
  arrival: item.request.destination,
  price: item.price,
});

const ENDPOINT = "/request/user/estimates";

export default function QuoteReceivedPage() {
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED">("ALL");
  const { data, isLoading, error } = useApiQuery<
    {
      success: boolean;
      message: string;
      data: ApiQuote[];
    },
    Error
  >({
    queryKey: ["quotes", "received"],
    queryFn: async () => {
      return apiClient(ENDPOINT, {
        method: "GET",
        query: { completedOnly: true },
      });
    },
    staleTime: STALE_TIME.ESTIMATE,
  });

  const quotes: QuoteCardView[] = data?.data ? data.data.map(adaptQuote) : [];
  const filteredQuotes =
    filter === "CONFIRMED"
      ? quotes.filter((q) => q.status === "confirmed")
      : quotes;
  const first = filteredQuotes[0] ?? quotes[0];
  const filterLabel = filter === "ALL" ? "전체" : "확정된 견적서";

  return (
    <div className="min-h-screen bg-background-200">
      <header className="bg-white">
        <div className="mx-auto max-w-6xl px-5">
          <QuoteTabNav />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-0 sm:px-4 md:px-5 py-8">
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
          <section className="rounded-2xl bg-white border border-line-100 px-6 py-6 shadow-sm flex flex-col gap-6">
            {/* 견적 정보 */}
            {first && (
              <div>
                <h2 className="text-black-400 pret-2xl-semibold mb-4">
                  견적 정보
                </h2>
                <div className="rounded-2xl bg-background-100 border border-line-100 px-6 py-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10">
                    <InfoRow
                      label="견적 요청일"
                      value={formatDateLabel(first.requestedAt ?? "")}
                    />
                    <InfoRow label="서비스" value={first.serviceType} />
                    <InfoRow
                      label="이용일"
                      value={first.movingDateTimeLabel ?? "-"}
                    />
                    <InfoRow label="출발지" value={first.departure} />
                    <InfoRow label="도착지" value={first.arrival} />
                  </div>
                </div>
              </div>
            )}

            {/* 필터 영역 */}
            <div className="flex flex-col gap-2">
              <h2 className="text-black-400 pret-2xl-semibold">견적서 목록</h2>
              <div className="w-[160px]">
                <FilterDropdown
                  menuName={filterLabel}
                  menuList={["전체", "확정된 견적서"]}
                  onClick={(menu) =>
                    setFilter(menu === "확정된 견적서" ? "CONFIRMED" : "ALL")
                  }
                />
              </div>
            </div>

            {/* 목록 */}
            <div className="flex flex-col gap-4">
              {filteredQuotes.map((quote) => (
                <Link
                  key={quote.id}
                  href={`/estimate/user/received/${quote.id}`}
                >
                  <div className="bg-white rounded-2xl border border-line-100 shadow-sm">
                    <QuoteCard
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
                      price={quote.price}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="w-20 text-gray-400 pret-13-medium">{label}</span>
      <span className="flex-1 text-black-300 pret-14-medium">{value}</span>
    </div>
  );
}
