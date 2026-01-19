"use client";

import Image from "next/image";
import { useApiQuery } from "@/hooks/useApiQuery";
import { apiClient } from "@/libs/apiClient";
import QuoteDetailCard from "./QuoteDetailCard";
import QuoteTabNav from "./QuoteTabNav";
import { formatDate, formatDateTime } from "@/utils/date";
import { useState, useEffect } from "react";
import { STALE_TIME } from "@/constants/query";
import { useI18n } from "@/libs/i18n/I18nProvider";
import { useQueryClient } from "@tanstack/react-query";
import { usePostFavoriteMover, useDeleteFavoriteMover } from "@/hooks/useMover";

import type { QuoteDetailView } from "@/types/view/quote";
import type { ApiQuoteDetail, QuoteStatus } from "@/types/api/quotes";
import { getServiceLabel } from "@/constants/profile.constants";

const statusMap: Record<QuoteStatus, "waiting" | "confirmed" | "rejected"> = {
  PENDING: "waiting",
  ACCEPTED: "confirmed",
  COMPLETED: "confirmed",
  REJECTED: "rejected",
};

type QuoteReceivedDetailPageProps = {
  estimateId: number;
};

const ENDPOINT = "/request/user/estimates";

export default function QuoteReceivedDetailPage({
  estimateId,
}: QuoteReceivedDetailPageProps) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const id = estimateId;
  const invalidId = Number.isNaN(id);

  const { data, isLoading, error } = useApiQuery<
    { success: boolean; message: string; data: ApiQuoteDetail },
    Error
  >({
    queryKey: ["quote", "received", id],
    queryFn: async () => apiClient(`${ENDPOINT}/${id}`, { method: "GET" }),
    staleTime: STALE_TIME.ESTIMATE,
    enabled: !invalidId,
  });

  const detail: QuoteDetailView | null = data?.data
    ? (() => {
        const adaptQuoteDetail = (item: ApiQuoteDetail): QuoteDetailView => {
          const driverId = item.driver?.id ?? item.driver_id ?? undefined;
          const movingTypeMap: Record<string, string> = {
            SMALL: t("moving_type_small"),
            HOME: t("moving_type_home"),
            OFFICE: t("moving_type_office"),
          };
          const serviceType =
            movingTypeMap[item.request.moving_type] ??
            getServiceLabel(item.request.moving_type);

          return {
            id: item.id,
            driverId,
            status: statusMap[item.status],
            serviceType,
            isDesignatedRequest: item.isRequest ?? false,
            designatedLabel: t("designated_quote_full"),
            description: item.driver?.driver_intro ?? "",
            name: item.driver.nickname ?? "-",
            profileImage: "/assets/image/avatartion-1.png", // 임시 프로필 이미지
            rating: item.driver.rating ?? 0,
            reviewCount: item.driver.reviewCount ?? 0,
            experience: item.driver.driver_years ?? 0,
            confirmedCount: item.driver.confirmedCount ?? 0,
            likeCount: item.driver.likeCount ?? 0,
            isFavorite: item.driver.likes
              ? item.driver.likes.length > 0
              : undefined,
            price: item.price,
            requestedAt: item.request?.createdAt ?? item.createdAt ?? "",
            movingDateTime: item.request?.moving_data ?? "",
            origin: item.request?.origin ?? "-",
            destination: item.request?.destination ?? "-",
          };
        };
        return adaptQuoteDetail(data.data);
      })()
    : null;

  // driver 객체
  const driver = data?.data?.driver;

  // driver.isFavorite 직접 확인 (백엔드에서 보내주는 데이터)
  const driverIsFavorite = (driver as typeof driver & { isFavorite?: boolean })
    ?.isFavorite;

  // 찜 상태 관리
  const [isFavorite, setIsFavorite] = useState(false);

  // 기사님 정보 로딩 후 찜 상태 설정
  useEffect(() => {
    // API 응답에서 isFavorite 확인
    if (driverIsFavorite !== undefined) {
      setIsFavorite(driverIsFavorite);
    }
    // fallback: likes 배열 확인 (백엔드에서 isFavorite를 보내주지 않는 경우)
    else if (driver?.likes && Array.isArray(driver.likes)) {
      setIsFavorite(driver.likes.length > 0);
    }
  }, [driverIsFavorite, driver?.likes]);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/estimate/user/received/${id}`
      : undefined;

  const getCopyText = () => {
    if (!shareUrl) return "";
    return detail
      ? `${t("moving_date")}: ${formatDateTime(detail.movingDateTime)}\n${t(
          "quote_price_title"
        )}: ${detail.price.toLocaleString()}원\n${shareUrl}`
      : shareUrl;
  };

  const handleCopyLink = () => {
    const copyText = getCopyText();
    if (!copyText) return;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(copyText)
        .then(() => {
          alert(t("share_copy_success"));
        })
        .catch(() => {
          alert(t("share_copy_fail"));
        });
      return;
    }
    alert(t("share_not_supported"));
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
      alert(t("kakao_app_key_missing"));
      return;
    }

    if (!kakao) {
      alert(t("share_kakao_not_ready"));
      return;
    }

    if (!kakao.isInitialized()) {
      kakao.init(kakaoAppKey);
    }

    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: t("share_title"),
        description: t("share_received_desc"),
        imageUrl: `${window.location.origin}/assets/image/share-kakao-thumb.png`,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: t("share_view_quote"),
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

  // 찜하기
  const { mutate: postFavoriteMover, isPending: isPostFavoriteMoverPending } =
    usePostFavoriteMover(detail?.driverId ?? 0);
  // 찜 취소
  const {
    mutate: deleteFavoriteMover,
    isPending: isDeleteFavoriteMoverPending,
  } = useDeleteFavoriteMover(detail?.driverId ?? 0);

  // 기사님 찜하기 핸들러
  const handleToggleFavorite = () => {
    if (!detail?.driverId) return;

    // 이미 찜한 상태면 삭제, 아니면 추가
    if (isFavorite) {
      deleteFavoriteMover(detail.driverId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["movers"] });
          setIsFavorite(false); // 찜 취소
        },
      });
    } else {
      postFavoriteMover(detail.driverId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["movers"] });
          setIsFavorite(true); // 찜 추가
        },
      });
    }
  };

  const isFavoritePending =
    isPostFavoriteMoverPending || isDeleteFavoriteMoverPending;

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
            {t("invalid_estimate")}
          </div>
        )}
        {isLoading && (
          <div className="text-center text-gray-400 pret-14-medium">
            {t("loading")}
          </div>
        )}
        {error && (
          <div className="text-center text-secondary-red-200 pret-14-medium">
            {error.message}
          </div>
        )}
        {!isLoading && !error && detail && (
          <div className="flex flex-col lg:grid lg:grid-cols-[2fr_1fr] lg:gap-10">
            <div className="flex flex-col gap-6">
              <h1 className="text-black-400 pret-2xl-semibold">
                {t("quote_detail_title")}
              </h1>

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
                  {t("quote_price_title")}
                </div>
                {detail.price.toLocaleString()}원
              </div>

              <div className="h-[1px] bg-line-100" />

              {/* 견적 정보 */}
              <div>
                <h2 className="text-black-400 pret-2xl-semibold mb-4">
                  {t("estimate_info")}
                </h2>
                <div className="rounded-2xl bg-background-100 border border-line-100 px-6 py-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10">
                    <InfoRow
                      label={t("quote_request_date")}
                      value={formatDate(detail.requestedAt)}
                    />
                    <InfoRow
                      label={t("service")}
                      value={detail.serviceType ?? "-"}
                    />
                    <InfoRow
                      label={t("moving_date")}
                      value={formatDateTime(detail.movingDateTime)}
                    />
                    <InfoRow label={t("departure")} value={detail.origin} />
                    <InfoRow label={t("arrival")} value={detail.destination} />
                  </div>
                </div>
              </div>
            </div>

            <aside className="hidden lg:flex flex-col gap-4 mt-6 lg:mt-0">
              <button
                type="button"
                onClick={handleToggleFavorite}
                disabled={isFavoritePending || !detail?.driverId}
                className="inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-line-200 bg-white text-black-400 hover:bg-background-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Image
                  src={
                    isFavorite
                      ? "/assets/icon/ic-like-fill.svg"
                      : "/assets/icon/ic-like-default.svg"
                  }
                  alt="찜하기"
                  width={20}
                  height={20}
                />
                <span className="pret-xl-semibold leading-8">
                  {isFavoritePending
                    ? t("processing")
                    : isFavorite
                    ? t("favorite_completed")
                    : t("favorite_driver")}
                </span>
              </button>
              <div className="flex flex-col gap-3">
                <span className="pret-lg-semibold text-black-300">
                  {t("share_quote")}
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
            onClick={handleToggleFavorite}
            disabled={isFavoritePending || !detail?.driverId}
            className="size-12 rounded-2xl border border-line-200 bg-white flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label={
              isFavoritePending
                ? t("processing")
                : isFavorite
                ? t("favorite_completed")
                : t("favorite_driver")
            }
          >
            <Image
              src={
                isFavorite
                  ? "/assets/icon/ic-like-fill.svg"
                  : "/assets/icon/ic-like-default.svg"
              }
              alt="찜하기"
              width={24}
              height={24}
            />
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 h-[54px] rounded-2xl bg-primary-blue-300 text-white pret-xl-semibold flex items-center justify-center hover:brightness-105 transition-all"
          >
            {t("share_quote")}
          </button>
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
