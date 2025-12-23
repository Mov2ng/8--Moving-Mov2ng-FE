export interface QuoteDetailCardProps {
  // 태그
  status?: "waiting" | "confirmed" | "rejected";
  serviceType?: string;
  isDesignatedRequest?: boolean;
  designatedLabel?: string;
  // 소개 문구
  description: string;
  // 기사 정보
  name: string;
  profileImage: string;
  avatarSize?: "sm" | "md" | "lg";
  avatarResponsive?: boolean;
  rating?: number;
  reviewCount?: number;
  experience?: number;
  confirmedCount?: number;
  likeCount?: number;
  // 견적 금액
  price?: number;
}

export interface QuoteCardView {
  id: number;
  name: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  experience: number;
  confirmedCount: number;
  likeCount: number;
  status: "waiting" | "confirmed" | "rejected";
  serviceType: string;
  isDesignatedRequest: boolean;
  designatedLabel: string;
  movingDate: string;
  movingDateTimeLabel?: string;
  requestedAt?: string;
  departure: string;
  arrival: string;
  price: number;
}

export interface QuoteDetailView {
  id: number;
  status: "waiting" | "confirmed" | "rejected";
  serviceType: string;
  isDesignatedRequest: boolean;
  designatedLabel: string;
  description: string;
  name: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  experience: number;
  confirmedCount: number;
  likeCount: number;
  price: number;
  requestedAt: string;
  movingDateTime: string;
  origin: string;
  destination: string;
}
