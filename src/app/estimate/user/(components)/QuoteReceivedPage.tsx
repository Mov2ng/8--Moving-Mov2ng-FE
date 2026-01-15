"use client";

import { useApiQuery } from "@/hooks/useApiQuery";
import { apiClient } from "@/libs/apiClient";
import Link from "next/link";
import QuoteCard from "./QuoteCard";
import QuoteTabNav from "./QuoteTabNav";
import FilterDropdown from "@/components/common/FilterDropdown";
import { formatDateLabel, formatDateTime } from "@/utils/date";
import { useEffect, useState } from "react";
import { STALE_TIME } from "@/constants/query";
import { useRouter } from "next/navigation";
import { useI18n } from "@/libs/i18n/I18nProvider";

import type { ApiQuote, QuoteStatus } from "@/types/api/quotes";
import type { QuoteCardView } from "@/types/view/quote";
import { getServiceLabel } from "@/constants/profile.constants";

const statusMap: Record<QuoteStatus, "waiting" | "confirmed" | "rejected"> = {
  PENDING: "waiting",
  ACCEPTED: "confirmed",
  REJECTED: "rejected",
};

const ENDPOINT = "/request/user/estimates";

export default function QuoteReceivedPage() {
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED">("ALL");
  const [isCompact, setIsCompact] = useState(false);
  const router = useRouter();
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
      profileImage: "/assets/image/avatartion-1.png", // 임시 프로필 이미지
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
      movingDateTimeLabel: formatDateTime(item.request.moving_data),
      requestedAt: item.request.createdAt,
      departure: item.request.origin,
      arrival: item.request.destination,
      price: item.price,
    };
  };

  useEffect(() => {
    const calc = () => {
      if (typeof window === "undefined") return;
      setIsCompact(window.innerWidth < 769);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const confirmedLabel = isCompact
    ? t("filter_confirmed_compact")
    : t("filter_confirmed");
  const filterOptions = [
    { label: t("filter_all"), value: "ALL" },
    { label: confirmedLabel, value: "CONFIRMED" },
  ];
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
  const filterLabel = filter === "ALL" ? t("filter_all") : confirmedLabel;

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
      setTimeout(() => router.replace("/estimate/driver/received"), 0);
    }
  }, [error, router, t]);

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
            {t("loading")}
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
                  {t("estimate_info")}
                </h2>
                <div className="rounded-2xl bg-background-100 border border-line-100 px-6 py-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10">
                    <InfoRow
                      label={t("quote_request_date")}
                      value={formatDateLabel(first.requestedAt ?? "")}
                    />
                    <InfoRow label={t("service")} value={first.serviceType} />
                    <InfoRow
                      label={t("moving_date")}
                      value={first.movingDateTimeLabel ?? "-"}
                    />
                    <InfoRow label={t("departure")} value={first.departure} />
                    <InfoRow label={t("arrival")} value={first.arrival} />
                  </div>
                </div>
              </div>
            )}

            {/* 필터 영역 */}
            <div className="flex flex-col gap-2">
              <h2 className="text-black-400 pret-2xl-semibold">
                {t("estimate_list")}
              </h2>
              <div className="w-[190px] max-md:w-[127px]">
                <FilterDropdown
                  menuName={filterLabel}
                  menuList={filterOptions}
                  onClick={(menu) =>
                    setFilter(menu.value === "CONFIRMED" ? "CONFIRMED" : "ALL")
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
