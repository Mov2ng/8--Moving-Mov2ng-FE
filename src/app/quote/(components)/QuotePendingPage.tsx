"use client";

import { useApiQuery } from "@/hooks/useApiQuery";
import { apiClient } from "@/libs/apiClient";
import QuoteCard from "./QuoteCard";
import QuoteTabNav from "./QuoteTabNav";

type QuoteStatus = "PENDING" | "ACCEPTED" | "REJECTED";

type ApiQuote = {
  id: number;
  request_id: number;
  driver_id: number;
  status: QuoteStatus;
  request_reson: string | null;
  isRequest: boolean;
  price: number;
  createdAt: string;
  updatedAt: string;
  request: {
    id: number;
    user_id: string;
    moving_type: "SMALL" | "HOME" | "OFFICE";
    moving_data: string;
    origin: string;
    destination: string;
    createdAt: string;
    updatedAt: string;
  };
  driver: {
    id: number;
    user_id: string;
    nickname: string;
    driver_years: number | null;
    driver_intro: string | null;
    driver_content: string | null;
    isDelete: boolean;
    createdAt: string;
    updatedAt: string;
    review?: { rating: number }[];
    likes?: { id: number }[];
    estimates?: { id: number }[];
    _count?: { review?: number; likes?: number };
    rating?: number;
    reviewCount?: number;
    likeCount?: number;
    confirmedCount?: number;
    user: {
      id: string;
      name: string;
      email: string;
      phone_number: string;
    };
  };
};

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

const formatDateLabel = (iso: string) => {
  const d = new Date(iso);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(d.getDate()).padStart(2, "0")}(${days[d.getDay()]})`;
};

const adaptQuote = (item: ApiQuote) => ({
  id: item.id,
  name: item.driver.user.name,
  profileImage: "/assets/image/avatartion-1.png", // 임시 프로필 이미지지
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
  departure: item.request.origin,
  arrival: item.request.destination,
  price: item.price,
});

type QuoteView = ReturnType<typeof adaptQuote>;

const ENDPOINT = "/request/user/quotes";

export default function QuotePendingPage() {
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
        query: { status: "PENDING" },
      });
    },
    staleTime: 1000 * 30, // 30초 캐싱
  });

  const quotes: QuoteView[] = data?.data ? data.data.map(adaptQuote) : [];

  return (
    <div className="min-h-screen bg-background-200">
      <header className="bg-white">
        <div className="mx-auto max-w-6xl px-5">
          <QuoteTabNav />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quotes.map((quote) => (
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
                onConfirm={() => console.log("견적 확정하기", quote.id)}
                onDetail={() => console.log("상세보기", quote.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
