import React from 'react'
import Image from 'next/image'
import StarRating from './StarRating';

import type { ReviewType } from '@/types/driverProfileType';

export default function ReviewPointBox({ rating, reviewCount, reviewList }: { rating: number, reviewCount: number, reviewList: ReviewType[] }) {
  // 리뷰 rating 값 계산
  const ratingList = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
    ...reviewList.reduce((acc, curr) => {
      acc[curr.rating] = (acc[curr.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>),
  };
  

  return (
  <div className="flex items-center justify-center gap-[83px] max-w-[955px] w-full h-[296px] bg-background-200 rounded-4xl
  max-md:bg-transparent max-md:gap-0 max-md:justify-between
  max-sm:flex-col max-sm:gap-10 max-sm:h-auto">
    <div className="flex items-center justify-center flex-col gap-[15px]">
      <p className="text-[64px] font-bold text-black-400 max-md:text-[40px]">{rating} <span className="text-[38px] font-bold text-gray-100 max-md:text-[24px]"> / 5</span></p>
      <StarRating rating={rating} size={48} />
    </div>
    <div className="flex flex-col gap-[14px] max-w-[510px] w-full 
    max-md:bg-background-200 max-md:rounded-4xl max-md:px-[18px] max-md:py-4 max-md:gap-[6px]">
      {Object.entries(ratingList).reverse().map(([key, value]) => ( 
        <div className="flex items-center gap-[30px] h-8 max-md:gap-4" key={key}> 
          <p className="w-9 pret-xl-medium text-black-300 max-md:pret-14-medium">{key}점</p>
          <div className="max-w-[370px] w-full h-[8px] bg-background-300 rounded-[15px]">
            <div className="h-full bg-secondary-yellow-100 rounded-[15px]" style={{ width: `${(value / reviewCount) * 100}%` }}></div>
          </div>
          <span className="w-11 pret-xl-medium text-gray-300 max-md:pret-14-medium">{value}</span>
        </div>
      ))}
    </div>
  </div>
  );
}