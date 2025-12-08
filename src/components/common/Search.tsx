import React from 'react'
import Image from 'next/image'

export default function Search() {
  return (
    <div className='flex items-center gap-2 max-w-[955px] w-full rounded-2xl bg-background-200 px-4 py-[14px]
    lg:px-6
    '>
      <Image src='/icons/search.svg' alt='search' width={20} height={20} />
      <input type='text' placeholder='텍스트를 입력해주세요.' className='w-full h-full bg-transparent outline-none' />
    </div>
  )
}