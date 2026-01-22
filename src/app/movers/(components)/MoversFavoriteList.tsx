import React from 'react'
import { useGetFavoriteMovers } from '@/hooks/useMover';
import FavoriteDriverCard from './FavoriteDriverCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

import type { ApiFavoriteDriver } from '@/types/view/favorite';


interface MoversFavoriteListProps {
  t: (key: any) => string;
  isGuest: boolean;
}

function MoversFavoriteList({ t, isGuest }: MoversFavoriteListProps) {
  const { data: favoriteMoversData, isPending: isFavoriteMoversPending } = useGetFavoriteMovers();
  const favoriteMovers = favoriteMoversData?.data;

  return (
    <div className="flex flex-col gap-4 mt-3.5 max-md:hidden">
      <p className="pret-xl-semibold text-black-400">{t("favorite_drivers")}</p>
      {!isGuest && 
        isFavoriteMoversPending ? (
          <LoadingSpinner />
        ) : (
          favoriteMovers?.map((fav: ApiFavoriteDriver) => (
            <FavoriteDriverCard
              key={fav.id}
              id={fav.id ?? 0}
              name={fav.nickname ?? ''}
              profileImage={fav.profileImage || '/assets/image/avatartion-3.png'}
              rating={fav.rating}
              reviewCount={fav.ratingCount}
              experience={fav.careerYears}
              confirmedCount={fav.confirmedCount}
              likeCount={fav.favoriteCount}
            />
          ))
        )
      }
    </div>
  )
}

export default MoversFavoriteList