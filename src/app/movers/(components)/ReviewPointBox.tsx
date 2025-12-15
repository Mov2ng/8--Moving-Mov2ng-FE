import React from 'react'
import Image from 'next/image'
export default function ReviewPointBox() {
  // 임시 리뷰 rating값
  const ratingList = {
    5: 170,
    4: 8,
    3: 0,
    2: 0,
    1: 0,
  }
  // total 리뷰 건수
  const totalRating = Object.values(ratingList).reduce((acc, curr) => acc + curr, 0);

  return (
  <div className="flex items-center justify-center gap-[83px] max-w-[955px] w-full h-[296px] bg-background-200 rounded-4xl">
    <div className="flex items-center flex-col gap-[15px]">
      <p className="text-[64px] font-bold text-black-400">5.0 <span className="text-[38px] font-bold text-gray-100"> / 5</span></p>
      <div className="flex items-center">
        <Image src="/assets/icon/ic-star-active.svg" alt="star" width={48} height={48} />
        <Image src="/assets/icon/ic-star-active.svg" alt="star" width={48} height={48} />
        <Image src="/assets/icon/ic-star-active.svg" alt="star" width={48} height={48} />
        <Image src="/assets/icon/ic-star-active.svg" alt="star" width={48} height={48} />
        <Image src="/assets/icon/ic-star-active.svg" alt="star" width={48} height={48} />
      </div>
    </div>
    <div className="flex flex-col gap-[14px] max-w-[510px] w-full">
      {Object.entries(ratingList).reverse().map(([key, value]) => ( 
        <div className="flex items-center gap-[30px] h-8"> 
          <p className="w-9 pret-xl-medium text-black-300">{key}점</p>
          <div className="max-w-[370px] w-full h-[8px] bg-background-300 rounded-[15px]">
            <div className="h-full bg-secondary-yellow-100 rounded-[15px]" style={{ width: `${(value / totalRating) * 100}%` }}></div>
          </div>
          <span className="w-11 pret-xl-medium text-gray-300">{value}</span>
        </div>
      ))}
    </div>
  </div>
  );
}