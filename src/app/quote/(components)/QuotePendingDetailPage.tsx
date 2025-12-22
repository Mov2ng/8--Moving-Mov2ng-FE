"use client";

import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { apiClient } from "@/libs/apiClient";
import QuoteDetailCard from "./QuoteDetailCard";
import QuoteTabNav from "./QuoteTabNav";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/common/button";
import { formatDate, formatDateTime } from "@/utils/date";

import type { QuoteDetailView } from "@/types/view/quote";
import type { ApiQuoteDetail, QuoteStatus } from "@/types/api/quotes";

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

const adaptQuoteDetail = (item: ApiQuoteDetail): QuoteDetailView => ({
  id: item.id,
  status: statusMap[item.status],
  serviceType:
    movingTypeMap[item.request.moving_type] ?? item.request.moving_type,
  isDesignatedRequest: item.isRequest ?? false,
  designatedLabel: "지정 견적 요청",
  description: item.driver?.driver_intro ?? "",
  name: item.driver.nickname ?? "-",
  profileImage: "/assets/image/avatartion-1.png", // 임시 프로필 이미지
  rating: item.driver.rating ?? 0,
  reviewCount: item.driver.reviewCount ?? 0,
  experience: item.driver.driver_years ?? 0,
  confirmedCount: item.driver.confirmedCount ?? 0,
  likeCount: item.driver.likeCount ?? 0,
  price: item.price,
  requestedAt: item.request?.createdAt ?? item.createdAt ?? "",
  movingDateTime: item.request?.moving_data ?? "",
  origin: item.request?.origin ?? "-",
  destination: item.request?.destination ?? "-",
});

type QuotePendingDetailPageProps = {
  estimateId: number;
};
const ENDPOINT = "/request/user/quotes/pending";
export default function QuotePendingDetailPage({
  estimateId,
}: QuotePendingDetailPageProps) {
  const queryClient = useQueryClient();
  const id = estimateId;
  const invalidId = Number.isNaN(id);

  const { data, isLoading, error } = useApiQuery<
    { success: boolean; message: string; data: ApiQuoteDetail },
    Error
  >({
    queryKey: ["quote", "pending", id],
    queryFn: async () => apiClient(`${ENDPOINT}/${id}`, { method: "GET" }),
    staleTime: 1000 * 30,
    enabled: !invalidId,
  });

  const { mutate: acceptQuote, isPending: isAccepting } = useApiMutation<
    { success: boolean; message: string },
    void,
    Error
  >({
    mutationFn: async () =>
      apiClient(`${ENDPOINT}/${id}/accept`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quote", "pending", id] });
      queryClient.invalidateQueries({ queryKey: ["quote", "pending"] });
      alert("견적을 확정했어요.");
    },
    onError: (err) => {
      alert(err.message ?? "견적 확정에 실패했습니다.");
    },
  });

  const detail: QuoteDetailView | null = data?.data
    ? adaptQuoteDetail(data.data)
    : null;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-line-100">
        <div className="mx-auto max-w-6xl px-5">
          <QuoteTabNav />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        {invalidId && (
          <div className="text-center text-secondary-red-200 pret-14-medium">
            잘못된 견적 ID입니다.
          </div>
        )}
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
        {!isLoading && !error && detail && (
          <div className="flex flex-col lg:grid lg:grid-cols-[2fr_1fr] lg:gap-10">
            {/*  카드 + 정보 */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h1 className="pret-xl-semibold text-black-300">견적 상세</h1>
              </div>

              <QuoteDetailCard
                status={detail.status}
                serviceType={detail.serviceType}
                isDesignatedRequest={detail.isDesignatedRequest}
                designatedLabel={detail.designatedLabel}
                description={detail.description}
                name={detail.name}
                profileImage={detail.profileImage}
                avatarSize="md"
                avatarResponsive={false}
                rating={detail.rating}
                reviewCount={detail.reviewCount}
                experience={detail.experience}
                confirmedCount={detail.confirmedCount}
                likeCount={detail.likeCount}
              />

              {/* 견적가 */}
              <div className="h-[1px] bg-line-100" />

              <div className="text-black-400 pret-2xl-semibold">
                <div className="text-black-300 pret-xl-semibold mb-3">
                  견적가
                </div>
                {detail.price.toLocaleString()}원
              </div>

              {/* 견적 정보 */}
              <div className="text-black-300 pret-lg-semibold mb-3">
                <h1 className="pret-xl-semibold text-black-300">견적 정보</h1>
              </div>
              <div className="rounded-[16px] border border-line-100 bg-background-100 px-5 py-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  <InfoRow
                    label="견적 요청일"
                    value={formatDate(detail.requestedAt)}
                  />
                  <InfoRow label="서비스" value={detail.serviceType ?? "-"} />
                  <InfoRow
                    label="이용일"
                    value={formatDateTime(detail.movingDateTime)}
                  />
                  <InfoRow label="출발지" value={detail.origin} />
                  <InfoRow label="도착지" value={detail.destination} />
                </div>
              </div>
            </div>

            {/* 확정 + 공유 */}
            <aside className="mt-6 lg:mt-0 flex flex-col gap-4">
              <Button
                text="견적 확정하기"
                onClick={() => acceptQuote()}
                disabled={invalidId || isAccepting}
                width="100%"
                className="hover:brightness-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-gray-400 pret-13-medium">{label}</span>
      <span className="text-black-300 pret-14-medium">{value}</span>
    </div>
  );
}
