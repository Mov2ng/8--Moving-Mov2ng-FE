export type ApiFavoriteDriver = {
  id?: number;
  nickname?: string;
  careerYears?: number;
  rating?: number;
  ratingCount?: number;
  confirmedCount?: number;
  favoriteCount?: number;
  category?: string | null;
  isFavorite?: boolean;
  profileImage?: string;
};

export type FavoriteDriverView = {
  id: number;
  name: string;
  profileImage: string;
  serviceType: string;
  driverYears: number;
  rating: number;
  reviewCount: number;
  likeCount: number;
  confirmedCount: number;
};
