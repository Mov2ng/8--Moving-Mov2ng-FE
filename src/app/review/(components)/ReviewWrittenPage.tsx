"use client";

import WrittenReviewCard from "./WrittenReviewCard";
import { Pagination } from "@/components/common/Pagination";
import { useApiQuery } from "@/hooks/useApiQuery";
import { apiClient } from "@/libs/apiClient";
import { formatDate, formatDateLabel } from "@/utils/date";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { ApiWrittenReview, ReviewWrittenItem } from "@/types/view/review";
import { STALE_TIME } from "@/constants/query";
import Image from "next/image";
import { getServiceLabel } from "@/constants/profile.constants";
import ReviewTabNav from "./ReviewTabNav";
import { useRouter } from "next/navigation";
import { useI18n } from "@/libs/i18n/I18nProvider";

export default function ReviewWrittenPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const router = useRouter();
  const { t } = useI18n();

  const adaptWritten = useMemo(
    () =>
      (item: ApiWrittenReview): ReviewWrittenItem => {
        const primaryEstimate = item.driver?.estimates?.[0];

        const movingTypeSource =
          item.request?.moving_type ?? primaryEstimate?.request?.moving_type;
        const serviceType = movingTypeSource
          ? movingTypeSource === "SMALL"
            ? t("moving_type_small")
            : movingTypeSource === "HOME"
            ? t("moving_type_home")
            : movingTypeSource === "OFFICE"
            ? t("moving_type_office")
            : getServiceLabel(movingTypeSource)
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
          designatedLabel: t("designated_quote_full"),
          createdAt: item.createdAt
            ? formatDateLabel(item.createdAt)
            : undefined,
          name:
            item.driver.user?.name ??
            item.driver.nickname ??
            t("driver_suffix"),
          profileImage:
            item.driver.profileImage ?? "/assets/image/avatartion-1.png",
          movingDate,
          price,
          rating: item.rating ?? 0,
          reviewText: item.review_content ?? "",
          reviewTitle: item.review_title,
        };
      },
    [t]
  );

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
    staleTime: STALE_TIME.REVIEW,
  });

  const list: ReviewWrittenItem[] = data?.data?.map(adaptWritten) ?? [];

  const totalCount = list.length;
  const paged = list.slice((page - 1) * pageSize, page * pageSize);
  const emptyText = t("empty_written_reviews");

  useEffect(() => {
    if (!error) return;

    const status =
      typeof error === "object" && "status" in error
        ? (error as { status?: number }).status
        : undefined;
    const code =
      typeof error === "object" && "code" in error
        ? (error as { code?: string }).code
        : undefined;
    const isForbidden = status === 403 || code === "FORBIDDEN";

    if (isForbidden) {
      alert("일반 회원만 접근가능합니다.");
      setTimeout(() => router.replace("/profile"), 0);
    }
  }, [error, router]);

  return (
    <div className="min-h-screen bg-background-200">
      <header className="bg-white border-b border-line-100">
        <div className="mx-auto max-w-6xl flex items-center gap-6">
          <ReviewTabNav />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8 flex flex-col gap-6">
        {/* 카드 리스트 */}
        {isLoading && (
          <div className="text-center text-gray-400 pret-15-medium py-10">
            {t("loading")}
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
            <Link
              href="/review/writable"
              className="mt-2 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-blue-300 text-white pret-15-semibold hover:bg-primary-blue-400 transition-colors"
            >
              {t("go_write_review")}
            </Link>
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
