import MovingTypeChip from '@/components/chips/MovingTypeChip'
import React from 'react'
import FindDriverProfile from './FindDriverProfile'
import { useRouter } from 'next/navigation';

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

type MovingType = 'SMALL' | 'HOME' | 'OFFICE';

const MOVING_TYPE: Record<
  MovingType,
  { label: string; imgUrl: string }
> = {
  SMALL: {
    label: '소형이사',
    imgUrl: '/assets/icon/ic-box.svg',
  },
  HOME: {
    label: '가정이사',
    imgUrl: '/assets/icon/ic-home-fill.svg',
  },
  OFFICE: {
    label: '사무실이사',
    imgUrl: '/assets/icon/ic-office-fill.svg',
  },
};

export default function DriverList({ size = 'md', id, name, driverIntro, likeCount, rating, reviewCount, driverYears, confirmedCount, imageSrc, movingType }: DriverListProps) {
  
  const router = useRouter();
  const handleClick = () => {
    router.push(`/movers/${id}`);
  };

  const movingItems = movingType.map((type: string) => {
    return MOVING_TYPE[type as MovingType];
  });


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