export type DriverResponseType = {
  id: number;
  nickname: string;
  driverYears: number;
  driverIntro: string;
  driverContent: string;
  favoriteCount: number;
  estimateCount: number;
  serviceCategories: string[];
  createdAt: string;
  regions: string[];
  rating: number;
  reviewCount: number;
  confirmCount: number;
  isFavorite: boolean;
};

export type ReviewType = {
  id: number;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  }
};