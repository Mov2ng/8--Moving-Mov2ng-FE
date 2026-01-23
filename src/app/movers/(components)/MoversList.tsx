import LoadingSpinner from '@/components/common/LoadingSpinner'
import { DriverResponseType } from '@/types/driverProfileType'
import React, { useRef } from 'react'
import DriverList from './FindDriverList';
import { useI18n } from '@/libs/i18n/I18nProvider';

interface MoversListProps {
  allMovers: DriverResponseType[];
  isPending: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

function MoversList({ allMovers, isPending, isFetchingNextPage, hasNextPage, loadMoreRef }: MoversListProps) {
  const { t } = useI18n();


  return (
    <div className="flex flex-col gap-12 max-md:gap-8 max-sm:gap-6">
      {isPending ? (
        <LoadingSpinner />
      ) : allMovers.length > 0 ? (
        allMovers.map((driver: DriverResponseType) => (
          <DriverList
            size="md"
            key={driver.id}
            id={driver.id}
            name={driver.nickname}
            driverIntro={driver.driverIntro}
            likeCount={driver.favoriteCount}
            rating={driver.rating}
            reviewCount={driver.reviewCount}
            driverYears={driver.driverYears}
            confirmedCount={driver.confirmCount}
            imageSrc={driver.profileImage}
            movingType={driver.serviceCategories}
          />
        ))
      ) : (
        <div className="flex justify-center items-center py-4">
          <p className="text-center text-gray-400 pret-md-regular">
            {t("no_results_found")}
          </p>
        </div>
      )}
      {/* 무한 스크롤 감지 영역 */}
      <div ref={loadMoreRef} className="w-full h-4" />
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
      {!hasNextPage && allMovers.length > 0 && (
        <p className="text-center text-gray-400 pret-md-regular py-4">
          {t("all_drivers_loaded")}
        </p>
      )}
    </div>
  )
}

export default MoversList