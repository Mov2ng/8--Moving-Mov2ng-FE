export type DriverEstimate = {
  id: number;
  nickname: string;
  driver_intro: string;
  driver_years: number;
  likeCount: number;
  rating: number;
  reviewCount: number;
  confirmedCount: number;
}

export type Estimate = {
  id: number;
  driver: DriverEstimate; 
  price: number;
  request: {
    moving_type: string;
    moving_data: string;
    origin: string;
    destination: string;
    createdAt: string;
  };
  status: string;
}