export type ReviewItem = {
  id: number;
  driverId?: number;
  serviceType: string;
  isDesignatedRequest?: boolean;
  designatedLabel?: string;
  name: string;
  profileImage: string;
  movingDate: string;
  price: number;
  reviewEnabled?: boolean;
  reviewButtonText?: string;
};

export type ApiWritableReview = {
  id: number;
  price?: number;
  request: {
    moving_data: string;
    moving_type?: string;
  };
  driver: {
    id?: number;
    nickname?: string;
    profileImage?: string;
    user?: {
      name?: string;
    };
  };
};

export type ApiWrittenReview = {
  id: number;
  price?: number;
  driver_id?: number;
  user_id?: string;
  review_title?: string;
  review_content?: string;
  rating?: number;
  createdAt?: string;
  request?: {
    moving_type?: string;
    moving_data?: string;
    price?: number;
    isDesignatedRequest?: boolean;
  };
  driver: {
    nickname?: string;
    driver_years?: number;
    driver_intro?: string;
    driver_content?: string;
    profileImage?: string;
    user?: {
      name?: string;
      email?: string;
      phone_number?: string;
    };
    estimates?: {
      id: number;
      price?: number;
      status?: string;
      request?: {
        id?: number;
        moving_type?: string;
        moving_data?: string;
      };
    }[];
  };
};

export type ReviewWrittenItem = {
  id: number;
  serviceType: string;
  isDesignatedRequest?: boolean;
  designatedLabel?: string;
  createdAt?: string;
  name: string;
  profileImage: string;
  movingDate: string;
  price: number;
  rating: number;
  reviewText: string;
  reviewTitle?: string;
};
