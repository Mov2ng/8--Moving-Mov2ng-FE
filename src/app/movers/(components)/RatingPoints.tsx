import React from 'react'
import Image from 'next/image'
export default function RatingPoints({ rating, count, size = 'md' }: { rating: number, count: number, size?: 'sm' | 'md' }) {
  return (  
    <div className='flex items-center gap-[6px] max-md:gap-0.5'>
      <Image src="assets/icon/ic-star-active.svg" alt="star" width={24} height={24} className={`max-md:w-5 max-md:h-5 max-sm:w-4 max-sm:h-4 ${size === 'sm' ? 'w-[18px] h-[18px]' : 'w-6 h-6'}`} />
      <span className='pret-16-medium text-black-300 max-md:pret-13-medium'>{rating}</span>
      <span className='pret-16-medium text-gray-300 max-md:pret-13-medium'>({count})</span>
    </div>
  )
}