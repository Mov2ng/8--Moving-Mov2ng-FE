import React from "react";
import Image from "next/image";
import RatingPoints from "./RatingPoints";

interface FindDriverProfileProps {
  name: string;
  likeCount: number;
  rating: number;
  reviewCount: number;
  driverYears: number;
  confirmedCount: number;
  imageSrc?: string;
  size?: 'sm' | 'md';
}

export default function FindDriverProfile({ name, likeCount, rating, reviewCount, driverYears, confirmedCount, imageSrc, size = 'md' }: FindDriverProfileProps) {
  return (
    <div className={`flex items-center max-w-[907px] w-full h-[92px] max-md:h-[78px] bg-gray-50 border border-line-100 rounded-md
        ${size === 'sm' ? 'gap-3 p-[10px]' : 'gap-6 px-4.5 py-4 max-md:p-[10px] max-md:gap-3'}`}>
      <div className={`rounded-full overflow-hidden border-3 border-black-300
        ${size === 'sm' ? 'w-12 h-12' : 'w-[60px] h-[60px]'}`}>
        <Image
          src={`${imageSrc || '/assets/image/avatartion-3.png'}`}  
          alt="driver-profile"
          width={150}
          height={150}
          className="w-full h-full object-cover"
        />
      </div>  
      <div className="w-full flex-1">
      <div className="flex items-center justify-between">
        <p className={`text-black-300 mb-2 ${size === 'sm' ? 'pret-14-semibold' : 'pret-2lg-medium max-md:pret-14-semibold'}`}>{name} 기사님</p>
        <div className="flex items-center gap-1">
          <Image src="/assets/icon/ic-like-active.svg" alt="like" width={24} height={24} />
          <p className={`text-black-400 ${size === 'sm' ? 'pret-13-medium' : 'pret-2lg-medium max-md:pret-13-medium'}`}>{likeCount}</p>
        </div>
      </div>
        <div className={`flex items-center ${size === 'sm' ? 'pret-13-medium gap-0.5' : 'pret-16-medium gap-4 max-md:pret-13-medium max-md:gap-0.5'}`}>
          <RatingPoints rating={rating} count={reviewCount} size={size} />
          <span className="text-line-200">|</span>
          <p className={`flex items-center ${size === 'sm' ? 'gap-1' : 'gap-[6px] max-md:gap-1'}`}>
            <span className="text-gray-300">경력</span>
            <span className="text-black-300">{driverYears}년</span>
          </p>
          <span className="text-line-200">|</span>
          <p className={`flex items-center ${size === 'sm' ? 'gap-1' : 'gap-[6px] max-md:gap-1'}`}>
            <span className="text-black-300">{confirmedCount}건</span>
            <span className="text-gray-300">확정</span>
          </p>
        </div>
      </div>
    </div>
  );
}