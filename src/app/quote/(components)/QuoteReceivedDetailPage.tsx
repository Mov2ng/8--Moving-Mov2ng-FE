"use client";

import { useApiQuery } from "@/hooks/useApiQuery";
import { apiClient } from "@/libs/apiClient";
import QuoteDetailCard from "./QuoteDetailCard";
import QuoteTabNav from "./QuoteTabNav";
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

type QuoteReceivedDetailPageProps = {
  estimateId: number;
};

const ENDPOINT = "/request/user/quotes";

export default function QuoteReceivedDetailPage({
  estimateId,
}: QuoteReceivedDetailPageProps) {
  const id = estimateId;
  const invalidId = Number.isNaN(id);

  const { data, isLoading, error } = useApiQuery<
    { success: boolean; message: string; data: ApiQuoteDetail },
    Error
  >({
    queryKey: ["quote", "received", id],
    queryFn: async () => apiClient(`${ENDPOINT}/${id}`, { method: "GET" }),
    staleTime: 1000 * 30,
    enabled: !invalidId,
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
          <div className="flex flex-col gap-6">
            <h1 className="text-black-400 pret-2xl-semibold">견적 상세</h1>

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
              <div className="text-black-300 pret-xl-semibold mb-3">견적가</div>
              {detail.price.toLocaleString()}원
            </div>

            <div className="h-[1px] bg-line-100" />

            {/* 견적 정보 */}
            <div>
              <h2 className="text-black-400 pret-2xl-semibold mb-4">
                견적 정보
              </h2>
              <div className="rounded-2xl bg-background-100 border border-line-100 px-6 py-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10">
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

            {/* 공유 버튼은 추후 추가 */}
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
