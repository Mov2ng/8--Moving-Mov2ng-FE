import React from "react";
import Image from "next/image";
import RatingPoints from "./RatingPoints";
export default function DriverProfile() {
  return (
    <div className="flex items-start gap-6 max-w-[907px] w-full h-[92px] px-4.5 py-4 bg-gray-50 border border-line-100 rounded-md">
      <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-3 border-black-300">
        <Image
          src="/assets/image/avatartion-3.png"
          alt="driver-profile"
          width={150}
          height={150}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full flex-1">
        <p className="pret-2lg-medium text-black-300 mb-2">이영훈 기사님</p>
        <div className="flex items-center gap-4 pret-16-medium">
          <RatingPoints rating={4.5} count={10} />
          <span className="text-line-200">|</span>
          <p className="flex items-center gap-[6px]">
            <span className="text-gray-300">경력</span>
            <span className="text-black-300">10년 이상</span>
          </p>
          <span className="text-line-200">|</span>
          <p className="flex items-center gap-[6px]">
            <span className="text-black-300">334건</span>
            <span className="text-gray-300">확정</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Image src="/assets/icon/ic-like-active.svg" alt="like" width={24} height={24} />
        <p className="pret-2lg-medium text-black-400">234</p>
      </div>
    </div>
  );
}
