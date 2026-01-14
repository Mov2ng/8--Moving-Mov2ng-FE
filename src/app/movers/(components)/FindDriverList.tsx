import MovingTypeChip from '@/components/chips/MovingTypeChip'
import React from 'react'
import FindDriverProfile from './FindDriverProfile'
import { useRouter } from 'next/navigation';
import { SERVICE_CATEGORY_INFO } from '@/constants/profile.constants';

interface DriverListProps {
  size?: 'sm' | 'md';
  id: number;
  name: string;
  driverIntro: string;
  likeCount: number;
  rating: number;
  reviewCount: number;
  driverYears: number;
  confirmedCount: number;
  movingType: string[];
  imageSrc?: string;
}

export default function DriverList({ size = 'md', id, name, driverIntro, likeCount, rating, reviewCount, driverYears, confirmedCount, imageSrc, movingType }: DriverListProps) {
  
  const router = useRouter();
  const handleClick = () => {
    router.push(`/movers/${id}`);
  };

  const movingItems = movingType
    .map((type: string) => SERVICE_CATEGORY_INFO[type])
    .filter(Boolean);


  return (
    <div onClick={handleClick} className={`max-w-[955px] flex flex-col border border-line-100 rounded-2xl bg-gray-50 cursor-pointer shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.14),_2px_2px_10px_0_rgba(220,220,220,0.14)]
        ${size === 'sm' ? 'gap-[14px] w-[328px] px-[14px] py-4' : 'gap-4 w-full px-6 py-5'}`}>
      <div className={`flex gap-3 ${size === 'sm' ? 'gap-2' : 'gap-3'}`}>
        {movingItems.map(({label, imgUrl}) => (
          <MovingTypeChip
            label={label}
            iconSrc={imgUrl}
            size={size === 'sm' ? 'sm' : 'md'}
          />
        ))}
        <MovingTypeChip
          label="지정 견적 요청"
          iconSrc="assets/icon/ic-File-dock-fill.svg"
          size={size === 'sm' ? 'sm' : 'md'}
          variant="rd"
        />
      </div>
      <div className={`w-full text-black-300 ${size === 'sm' ? 'pret-14-semibold' : 'pret-2xl-semibold max-md:pret-14-semibold'}`} >{driverIntro}</div>
      <FindDriverProfile name={name} likeCount={likeCount} rating={rating} reviewCount={reviewCount} driverYears={driverYears} confirmedCount={confirmedCount} imageSrc={imageSrc} size={size} />
    </div>
  )
}