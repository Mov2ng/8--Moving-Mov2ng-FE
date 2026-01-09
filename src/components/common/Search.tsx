import React from 'react'
import Image from 'next/image'

export default function Search({ keyword, setKeyword }: { keyword: string; setKeyword: (keyword: string) => void }) {
  return (
    <div className='flex items-center gap-2 max-w-[955px] w-full rounded-2xl bg-background-200 px-6 py-[14px]
    max-md:px-4 
    '>
      <Image src='assets/icon/ic-search.svg' alt='search' width={36} height={36} className='max-md:w-6 max-md:h-6'/>
      <input type='text' placeholder='텍스트를 입력해주세요.' className='w-full h-full bg-transparent outline-none' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
    </div>
  )
}