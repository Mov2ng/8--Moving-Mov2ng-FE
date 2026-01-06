"use client";

import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { apiClient } from "@/libs/apiClient";
import QuoteDetailCard from "./QuoteDetailCard";
import QuoteTabNav from "./QuoteTabNav";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/common/button";
import { formatDate, formatDateTime } from "@/utils/date";
import Image from "next/image";
import { useState } from "react";
import { STALE_TIME } from "@/constants/query";

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

const adaptQuoteDetail = (item: ApiQuoteDetail): QuoteDetailView => {
  const driverId = item.driver?.id ?? item.driver_id ?? undefined;
  return {
    id: item.id,
    driverId,
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
    isFavorite: item.driver.likes ? item.driver.likes.length > 0 : undefined,
    price: item.price,
    requestedAt: item.request?.createdAt ?? item.createdAt ?? "",
    movingDateTime: item.request?.moving_data ?? "",
    origin: item.request?.origin ?? "-",
    destination: item.request?.destination ?? "-",
  };
};

type QuotePendingDetailPageProps = {
  estimateId: number;
};
const ENDPOINT = "/request/user/estimates";
export default function QuotePendingDetailPage({
  estimateId,
}: QuotePendingDetailPageProps) {
  const queryClient = useQueryClient();
  const [favoriteOverride, setFavoriteOverride] = useState<boolean | undefined>(
    undefined
  );
  const id = estimateId;
  const invalidId = Number.isNaN(id);

  const { data, isLoading, error } = useApiQuery<
    { success: boolean; message: string; data: ApiQuoteDetail },
    Error
  >({
    queryKey: ["quote", "pending", id],
    queryFn: async () =>
      apiClient(`${ENDPOINT}/${id}/pending`, { method: "GET" }),
    staleTime: STALE_TIME.ESTIMATE,
    enabled: !invalidId,
  });

  const { mutate: acceptQuote, isPending: isAccepting } = useApiMutation<
    { success: boolean; message: string },
    void,
    Error
  >({
    mutationFn: async () =>
      apiClient(`${ENDPOINT}/${id}/pending/accept`, {
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

  const isFavorite = favoriteOverride ?? detail?.isFavorite ?? false;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/estimate/user/pending/${id}` // 도메인 환경에서 테스트할 때는 도메인 주소를 사용
      : undefined;

  const getCopyText = () => {
    if (!shareUrl) return "";
    return detail
      ? `이사일: ${formatDateTime(
          detail.movingDateTime
        )}\n견적가: ${detail.price.toLocaleString()}원\n${shareUrl}`
      : shareUrl;
  };

  const handleCopyLink = () => {
    const copyText = getCopyText();
    if (!copyText) return;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(copyText)
        .then(() => {
          alert("견적 요약을 복사했어요. 메신저에 붙여넣기 하세요.");
        })
        .catch(() => {
          alert("클립보드 복사에 실패했어요.");
        });
      return;
    }
    alert("공유를 지원하지 않는 브라우저입니다.");
  };

  const handleShareKakao = () => {
    if (!shareUrl) return;
    type KakaoSDK = {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (config: Record<string, unknown>) => void;
      };
    };
    const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
    const kakao =
      typeof window !== "undefined"
        ? (window as typeof window & { Kakao?: KakaoSDK }).Kakao ?? null
        : null;

    if (!kakaoAppKey) {
      alert("NEXT_PUBLIC_KAKAO_APP_KEY가 설정되지 않았습니다.");
      return;
    }

    if (!kakao) {
      alert(
        "카카오 SDK가 아직 로드되지 않았어요. 새로고침 후 다시 시도해 주세요."
      );
      return;
    }

    if (!kakao.isInitialized()) {
      kakao.init(kakaoAppKey);
    }

    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "견적서 공유",
        description: "받은 견적서를 확인해 주세요.",
        imageUrl: `${window.location.origin}/assets/image/share-kakao-thumb.png`,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: "견적서 보기",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  };

  const handleShareFacebook = () => {
    const copyText = getCopyText();
    if (copyText && navigator.clipboard) {
      navigator.clipboard.writeText(copyText).catch(() => {
        // 복사 실패는 무시하고 공유 계속 진행
      });
    }
    if (!shareUrl) return;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const { mutate: toggleFavorite, isPending: isTogglingFavorite } =
    useApiMutation<
      { success: boolean; message?: string; data?: { isFavorite?: boolean } },
      void,
      Error
    >({
      mutationFn: async () => {
        if (!detail?.driverId) throw new Error("driverId를 찾을 수 없습니다.");
        const method = isFavorite ? "DELETE" : "POST";
        return apiClient(`/movers/${detail.driverId}/favorite`, {
          method,
        });
      },
      onSuccess: (res) => {
        setFavoriteOverride((prev) =>
          res.data?.isFavorite !== undefined ? res.data.isFavorite : !prev
        );
        if (res.message) alert(res.message);
      },
      onError: (err) => {
        alert(err.message ?? "찜하기 처리중 오류 발생.");
      },
    });

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-line-100">
        <div className="mx-auto max-w-6xl px-5">
          <QuoteTabNav />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8 pb-32 lg:pb-8">
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
            <aside className="hidden lg:flex flex-col gap-4 mt-6 lg:mt-0">
              <button
                type="button"
                onClick={() => toggleFavorite()}
                disabled={isTogglingFavorite || !detail?.driverId}
                className="inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-line-200 bg-white text-black-400 hover:bg-background-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Image
                  src={
                    isFavorite
                      ? "/assets/icon/ic-like-active.svg"
                      : "/assets/icon/ic-like-default.svg"
                  }
                  alt="찜하기"
                  width={20}
                  height={20}
                />
                <span className="pret-xl-semibold leading-8">
                  기사님 찜하기
                </span>
              </button>
              <Button
                text="견적 확정하기"
                onClick={() => acceptQuote()}
                disabled={invalidId || isAccepting}
                width="100%"
                className="hover:brightness-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <div className="flex flex-col gap-3">
                <span className="pret-lg-semibold text-black-300">
                  견적서 공유하기
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="size-14 rounded-2xl bg-white border border-line-100 flex items-center justify-center"
                    aria-label="링크 복사"
                  >
                    <Image
                      src="/assets/icon/ic-clip.svg"
                      alt="링크 복사"
                      width={28}
                      height={28}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareKakao}
                    className="size-14 rounded-2xl bg-[#FAE100] flex items-center justify-center"
                    aria-label="카카오톡 공유"
                  >
                    <Image
                      src="/assets/icon/ic-kakao.svg"
                      alt="카카오톡 공유"
                      width={28}
                      height={28}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareFacebook}
                    className="size-14 rounded-2xl bg-[#4285F4] flex items-center justify-center"
                    aria-label="페이스북 공유"
                  >
                    <Image
                      src="/assets/icon/ic-facebook.svg"
                      alt="페이스북 공유"
                      width={28}
                      height={28}
                    />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* 태블릿 모바일 버전 */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-line-100 px-5 py-3">
        <div className="mx-auto max-w-6xl flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleFavorite()}
            disabled={isTogglingFavorite || !detail?.driverId}
            className="size-12 rounded-2xl border border-line-200 bg-white flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="찜하기"
          >
            <Image
              src={
                isFavorite
                  ? "/assets/icon/ic-like-active.svg"
                  : "/assets/icon/ic-like-default.svg"
              }
              alt="찜하기"
              width={24}
              height={24}
            />
          </button>
          <Button
            text="견적 확정하기"
            onClick={() => acceptQuote()}
            disabled={invalidId || isAccepting}
            width="100%"
            className="h-[54px] flex-1 flex items-center justify-center pret-xl-semibold leading-6 text-black-400 hover:brightness-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
      </div>
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
