import MovingTypeChip from '@/components/chips/MovingTypeChip'
import React from 'react'
import DriverProfile from './FindDriverProfile'

export default function DriverList({ size = 'md', name, likeCount, career, confirmedCount, imageSrc }: { size?: 'sm' | 'md', name: string, likeCount: number, career: number, confirmedCount: number, imageSrc?: string }) {
  return (
    <div className={`max-w-[955px] flex flex-col border border-line-100 rounded-2xl bg-gray-50 shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.14),_2px_2px_10px_0_rgba(220,220,220,0.14)]
        ${size === 'sm' ? 'gap-[14px] w-[328px] px-[14px] py-4' : 'gap-4 w-full px-6 py-5'}`}>
      <div className={`flex gap-3 ${size === 'sm' ? 'gap-2' : 'gap-3'}`}>
        <MovingTypeChip
          label="소형이사"
          iconSrc="assets/icon/ic-box.svg"
          size={size === 'sm' ? 'sm' : 'md'}
        />
        <MovingTypeChip
          label="지정 견적 요청"
          iconSrc="assets/icon/ic-File-dock-fill.svg"
          size={size === 'sm' ? 'sm' : 'md'}
          variant="rd"
        />
      </div>
      <div className={`w-full text-black-300 ${size === 'sm' ? 'pret-14-semibold' : 'pret-2xl-semibold max-md:pret-14-semibold'}`} >고객님의 물품을 안전하게 운송해 드립니다. (한줄소개란)</div>
      <DriverProfile name={name} likeCount={likeCount} career={career} confirmedCount={confirmedCount} imageSrc={imageSrc} size={size} />
    </div>
  )
}