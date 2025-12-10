import MovingTypeChip from '@/components/chips/MovingTypeChip'
import React from 'react'
import DriverProfile from './DriverProfile'

export default function DriverList() {
  return (
    <div className="max-w-[955px] w-full flex flex-col gap-4 px-6 py-5 border border-line-100 rounded-2xl bg-gray-50 shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.14),_2px_2px_10px_0_rgba(220,220,220,0.14)]
">
      <div className="flex gap-3">
        <MovingTypeChip
          label="소형이사"
          iconSrc="assets/icon/ic-box.svg"
          size="md"
        />
        <MovingTypeChip
          label="지정 견적 요청"
          iconSrc="assets/icon/ic-File-dock-fill.svg"
          size="md"
          variant="rd"
        />
      </div>
      <div className='w-full pret-2xl-semibold text-black-300 '>고객님의 물품을 안전하게 운송해 드립니다. (한줄소개란)</div>
      <DriverProfile />
    </div>
  )
}