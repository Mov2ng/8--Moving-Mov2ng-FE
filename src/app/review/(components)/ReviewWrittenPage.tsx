"use client";

import WrittenReviewCard from "./WrittenReviewCard";
import { Pagination } from "@/components/common/Pagination";
import { useApiQuery } from "@/hooks/useApiQuery";
import { apiClient } from "@/libs/apiClient";
import { formatDate, formatDateLabel } from "@/utils/date";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { ApiWrittenReview, ReviewWrittenItem } from "@/types/view/review";

const movingTypeMap: Record<string, string> = {
  SMALL: "소형이사",
  HOME: "가정이사",
  OFFICE: "사무실이사",
};

const adaptWritten = (item: ApiWrittenReview): ReviewWrittenItem => {
  // driver.estimates[0]에도 request/price가 들어오는 백엔드 응답 대비
  const primaryEstimate = item.driver?.estimates?.[0];

  const movingTypeSource =
    item.request?.moving_type ?? primaryEstimate?.request?.moving_type;
  const serviceType =
    movingTypeSource && movingTypeMap[movingTypeSource]
      ? movingTypeMap[movingTypeSource]
      : "";

  const isDesignated = item.request?.isDesignatedRequest ?? false;

  const movingDateRaw =
    item.request?.moving_data ?? primaryEstimate?.request?.moving_data;
  const movingDate = movingDateRaw ? formatDate(movingDateRaw) : "-";

  const price =
    item.request?.price ?? primaryEstimate?.price ?? item.price ?? 0;

  return {
    id: item.id,
    serviceType,
    isDesignatedRequest: isDesignated,
    designatedLabel: "지정 견적 요청",
    createdAt: item.createdAt ? formatDateLabel(item.createdAt) : undefined,
    name: item.driver.user?.name ?? item.driver.nickname ?? "기사님",
    profileImage: item.driver.profileImage ?? "/assets/image/avatartion-1.png",
    movingDate,
    price,
    rating: item.rating ?? 0,
    reviewText: item.review_content ?? "",
    reviewTitle: item.review_title,
  };
};

export default function ReviewWrittenPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    const calc = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      setPageSize(width < 1024 ? 4 : 6);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const { data, isLoading, error } = useApiQuery<
    { success: boolean; message: string; data: ApiWrittenReview[] },
    Error
  >({
    queryKey: ["reviews", "written"],
    queryFn: async () =>
      apiClient("/review/my", {
        method: "GET",
      }),
    staleTime: 1000 * 30,
  });

  const list: ReviewWrittenItem[] = data?.data?.map(adaptWritten) ?? [];

  const totalCount = list.length;
  const paged = list.slice((page - 1) * pageSize, page * pageSize);
  const emptyText = "작성한 리뷰가 없습니다.";

  return (
    <div className="min-h-screen bg-background-200">
      <header className="bg-white border-b border-line-100">
        <div className="mx-auto max-w-6xl px-5 py-5 flex items-center gap-6">
          <Link href="/" className="text-primary-blue-300 pret-xl-semibold">
            무빙
          </Link>
          <nav className="flex items-center gap-6 pret-15-semibold">
            <Link
              href="/review/writable"
              className="text-black-200 hover:text-primary-black-400"
            >
              작성 가능한 리뷰
            </Link>
            <Link href="/review/written" className="text-primary-black-400">
              내가 작성한 리뷰
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8 flex flex-col gap-6">
        {/* 카드 리스트 */}
        {isLoading && (
          <div className="text-center text-gray-400 pret-15-medium py-10">
            불러오는 중...
          </div>
        )}
        {error && (
          <div className="text-center text-secondary-red-200 pret-15-medium py-10">
            {error.message}
          </div>
        )}
        {!isLoading && !error && list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-4">
            <Image
              src="/assets/image/img-empty-blue.png"
              alt="빈 상태"
              width={120}
              height={120}
              priority
            />
            <div className="text-gray-400 pret-16-medium">{emptyText}</div>
          </div>
        ) : null}
        {!isLoading && !error && list.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paged.map((item) => (
              <WrittenReviewCard
                key={item.id}
                serviceType={item.serviceType}
                isDesignatedRequest={item.isDesignatedRequest}
                designatedLabel={item.designatedLabel}
                createdAt={item.createdAt}
                name={item.name}
                profileImage={item.profileImage}
                movingDate={item.movingDate}
                price={item.price}
                rating={item.rating}
                reviewText={item.reviewText}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && totalCount > pageSize && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onChange={(next) => setPage(next)}
          />
        )}
      </main>
    </div>
  );
}
