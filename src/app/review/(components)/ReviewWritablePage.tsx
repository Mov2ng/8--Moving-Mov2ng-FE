"use client";

import ReviewCreateCard from "./ReviewCreateCard";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { apiClient } from "@/libs/apiClient";
import { formatDate } from "@/utils/date";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/common/Pagination";
import ReviewWriteModal from "./ReviewWriteModal";
import { useQueryClient } from "@tanstack/react-query";
import { STALE_TIME } from "@/constants/query";
import ReviewTabNav from "./ReviewTabNav";
import { useRouter } from "next/navigation";

import type { ApiWritableReview, ReviewItem } from "@/types/view/review";
import { getServiceLabel } from "@/constants/profile.constants";

const adaptWritable = (item: ApiWritableReview): ReviewItem => ({
  id: item.id,
  driverId: item.driver.id,
  serviceType: item.request.moving_type
    ? getServiceLabel(item.request.moving_type)
    : "",
  isDesignatedRequest: false,
  designatedLabel: "지정 견적 요청",
  name: item.driver.user?.name ?? item.driver.nickname ?? "기사님",
  profileImage: item.driver.profileImage ?? "/assets/image/avatartion-1.png",
  movingDate: formatDate(item.request.moving_data),
  price: item.price ?? 0,
  reviewEnabled: true,
  reviewButtonText: "리뷰 작성하기",
});

export default function ReviewWritablePage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [pageSize, setPageSize] = useState(6);
  const queryClient = useQueryClient();
  const router = useRouter();

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
    { success: boolean; message: string; data: ApiWritableReview[] },
    Error
  >({
    queryKey: ["reviews", "writable"],
    queryFn: async () =>
      apiClient("/review/writable", {
        method: "GET",
      }),
    staleTime: STALE_TIME.REVIEW,
  });

  const writableReviews =
    data?.data && Array.isArray(data.data) ? data.data.map(adaptWritable) : [];
  const { mutate: createReview, isPending: isCreating } = useApiMutation<
    { success: boolean; message: string },
    {
      driverId: number;
      rating: number;
      review_content?: string;
      review_title?: string;
    },
    Error
  >({
    mutationFn: async (payload) =>
      apiClient("/review", {
        method: "POST",
        body: payload,
      }),
    onSuccess: (res) => {
      alert(res.message ?? "리뷰가 등록되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["reviews", "writable"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "written"] });
      setIsModalOpen(false);
      setSelectedReview(null);
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const list = writableReviews;
  const totalCount = list.length;
  const paged = list.slice((page - 1) * pageSize, page * pageSize);
  const emptyText = "작성 가능한 리뷰가 없습니다.";

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

      <main className="max-w-6xl mx-auto px-5 py-8 flex flex-col gap-4">
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
              <ReviewCreateCard
                key={item.id}
                serviceType={item.serviceType}
                isDesignatedRequest={item.isDesignatedRequest}
                designatedLabel={item.designatedLabel}
                name={item.name}
                profileImage={item.profileImage}
                movingDate={item.movingDate}
                price={item.price}
                onWriteReview={() => {
                  setSelectedReview(item);
                  setIsModalOpen(true);
                }}
                reviewEnabled={item.reviewEnabled ?? true}
                reviewButtonText={item.reviewButtonText ?? "리뷰 작성하기"}
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

      <ReviewWriteModal
        key={isModalOpen ? selectedReview?.id ?? "open" : "closed"}
        open={isModalOpen}
        item={selectedReview}
        onClose={() => setIsModalOpen(false)}
        onSubmit={({ rating, content, item }) => {
          if (!item?.driverId) {
            alert("driverId가 없어 리뷰를 등록할 수 없습니다.");
            return;
          }
          createReview({
            driverId: item.driverId,
            rating,
            review_content: content,
          });
        }}
        isSubmitting={isCreating}
      />
    </div>
  );
}
