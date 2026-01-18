export type QuoteStatus = "PENDING" | "ACCEPTED" | "COMPLETED" | "REJECTED";

export type ApiQuote = {
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

export type ApiQuoteDetail = ApiQuote;
