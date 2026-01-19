"use client";

import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { apiClient } from "@/libs/apiClient";
import QuoteCard from "./QuoteCard";
import QuoteTabNav from "./QuoteTabNav";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { formatDateLabel } from "@/utils/date";
import { STALE_TIME } from "@/constants/query";
import { useI18n } from "@/libs/i18n/I18nProvider";
import ConfirmQuoteModal from "./ConfirmQuoteModal";
import { moverService } from "@/services/moverService";

import type { ApiQuote, QuoteStatus } from "@/types/api/quotes";
import type { QuoteCardView } from "@/types/view/quote";
import { getServiceLabel } from "@/constants/profile.constants";

const statusMap: Record<QuoteStatus, "waiting" | "confirmed" | "rejected"> = {
  PENDING: "waiting",
  ACCEPTED: "confirmed",
  COMPLETED: "confirmed",
  REJECTED: "rejected",
};

const ENDPOINT = "/request/user/estimates";

export default function QuotePendingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const adaptQuote = (item: ApiQuote): QuoteCardView => {
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
      name: item.driver.nickname,
      profileImage: "/assets/image/avatartion-1.png", // 임시 프로필 이미지지
      rating: item.driver.rating ?? 0,
      reviewCount: item.driver.reviewCount ?? 0,
      experience: item.driver.driver_years ?? 0,
      confirmedCount: item.driver.confirmedCount ?? 0,
      likeCount: item.driver.likeCount ?? 0,
      status: statusMap[item.status],
      serviceType,
      isDesignatedRequest: item.isRequest ?? false,
      designatedLabel: t("designated_quote_full"),
      movingDate: formatDateLabel(item.request.moving_data),
      requestedAt: item.request.createdAt,
      departure: item.request.origin,
      arrival: item.request.destination,
      price: item.price,
    };
  };
  const [confirmId, setConfirmId] = useState<number | null>(null);
  // 각 driver.id별 찜하기 상태 관리
  const [favoriteStates, setFavoriteStates] = useState<
    Map<number, { isFavorite: boolean; isPending: boolean }>
  >(new Map());

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
        query: { status: "ACCEPTED" },
      });
    },
    staleTime: STALE_TIME.ESTIMATE, // 30초 캐싱
  });

  const quotes: QuoteCardView[] = data?.data ? data.data.map(adaptQuote) : [];
  const summary = quotes[0];

  // API 응답에서 찜하기 초기 상태 계산 (useMemo로 계산하여 useEffect 없이 처리)
  const initialFavoriteStates = useMemo(() => {
    const states = new Map<
      number,
      { isFavorite: boolean; isPending: boolean }
    >();

    if (data?.data) {
      data.data.forEach((quote: ApiQuote) => {
        const driverId = quote.driver.id;
        const driverWithFavorite = quote.driver as ApiQuote["driver"] & {
          isFavorite?: boolean;
        };
        if (driverWithFavorite.isFavorite !== undefined) {
          states.set(driverId, {
            isFavorite: driverWithFavorite.isFavorite,
            isPending: false,
          });
        }
      });
    }

    return states;
  }, [data]);

  // 초기 상태와 사용자 액션으로 변경된 상태를 병합
  const mergedFavoriteStates = useMemo(() => {
    const merged = new Map(initialFavoriteStates);
    // 사용자가 변경한 상태가 있으면 우선 적용
    favoriteStates.forEach((value, key) => {
      merged.set(key, value);
    });
    return merged;
  }, [initialFavoriteStates, favoriteStates]);

  // 찜하기/찜 취소 mutation
  const { mutate: toggleFavorite } = useApiMutation<
    { success: boolean; message: string },
    number,
    Error
  >({
    mutationFn: async (driverId: number) => {
      const currentState = favoriteStates.get(driverId);
      const isFavorite = currentState?.isFavorite ?? false;

      if (isFavorite) {
        return moverService.deleteFavoriteMover(driverId);
      } else {
        return moverService.postFavoriteMover(driverId);
      }
    },
    onSuccess: (_, driverId) => {
      const currentState = favoriteStates.get(driverId);
      const isFavorite = currentState?.isFavorite ?? false;

      setFavoriteStates((prev) => {
        const newMap = new Map(prev);
        newMap.set(driverId, {
          isFavorite: !isFavorite,
          isPending: false,
        });
        return newMap;
      });
      queryClient.invalidateQueries({ queryKey: ["movers"] });
    },
    onError: (_, driverId) => {
      // 실패 시 원래 상태로 복구
      setFavoriteStates((prev) => {
        const newMap = new Map(prev);
        const currentState = prev.get(driverId);
        if (currentState) {
          newMap.set(driverId, {
            isFavorite: currentState.isFavorite,
            isPending: false,
          });
        }
        return newMap;
      });
    },
  });

  // 찜하기 핸들러 생성 함수
  const createFavoriteHandler = (driverId: number) => {
    return () => {
      const currentState = favoriteStates.get(driverId);
      const isFavorite = currentState?.isFavorite ?? false;

      // 상태 업데이트
      setFavoriteStates((prev) => {
        const newMap = new Map(prev);
        newMap.set(driverId, {
          isFavorite: !isFavorite,
          isPending: true,
        });
        return newMap;
      });

      toggleFavorite(driverId);
    };
  };

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
      alert(t("forbidden_user"));
      setTimeout(() => router.replace("/estimate/driver/pending"), 0);
    }
  }, [error, router, t]);

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
        <header className="bg-white">
          <div className="border-b border-line-100">
            <div className="mx-auto max-w-6xl px-5">
              <QuoteTabNav />
            </div>
          </div>
          {summary && (
            <div className="mx-auto max-w-6xl px-5 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ">
              <div className="flex flex-col gap-1">
                <span className="text-primary-black-400 pret-xl-semibold">
                  {summary.serviceType || t("service_type_unknown")}
                </span>
                <span className="text-gray-400 pret-14-medium">
                  {t("quote_request_date")}:{" "}
                  {summary.requestedAt
                    ? formatDateLabel(summary.requestedAt)
                    : "-"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-black-300 pret-15-medium">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-gray-300 pret-13-medium">
                    {t("departure")}
                  </span>
                  <span className="text-primary-black-400">
                    {summary.departure}
                  </span>
                </div>
                <div className="flex items-center text-primary-black-300">
                  →
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-gray-300 pret-13-medium">
                    {t("arrival")}
                  </span>
                  <span className="text-primary-black-400">
                    {summary.arrival}
                  </span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-gray-300 pret-13-medium">
                    {t("moving_date")}
                  </span>
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
              {t("loading")}
            </div>
          )}
          {error && (
            <div className="text-center text-secondary-red-200 pret-14-medium">
              {error.message}
            </div>
          )}
          {!isLoading && !error && quotes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 gap-4 text-center text-gray-400 pret-14-medium">
              <Image
                src="/assets/image/img-empty-blue.png"
                alt="empty"
                width={120}
                height={120}
                priority
              />
              <div>{t("empty_pending_quotes")}</div>
            </div>
          )}
          {!isLoading && !error && quotes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quotes.map((quote) => {
                const driverId = data?.data?.find(
                  (q: ApiQuote) => q.id === quote.id
                )?.driver.id;
                const favoriteState = driverId
                  ? mergedFavoriteStates.get(driverId)
                  : undefined;

                return (
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
                );
              })}
            </div>
          )}
        </main>
      </div>

      <ConfirmQuoteModal
        open={confirmId !== null}
        onCancel={() => setConfirmId(null)}
        onConfirm={() => acceptQuote()}
        isSubmitting={isAccepting}
      />
    </>
  );
}
