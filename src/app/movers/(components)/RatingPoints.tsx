import React from 'react'
import Image from 'next/image'
export default function RatingPoints({ rating, count }: { rating: number, count: number }) {
  return (  
    <div className='flex items-center gap-[6px]'>
      <Image src="assets/icon/ic-star-active.svg" alt="star" width={24} height={24} className='w-6 h-6 max-md:w-5 max-md:h-5' />
      <span className='pret-16-medium text-black-300 max-md:pret-13-medium'>{rating}</span>
      <span className='pret-16-medium text-gray-300 max-md:pret-13-medium'>({count})</span>
    </div>
  )
}