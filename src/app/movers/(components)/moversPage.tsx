"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

import Search from "@/components/common/Search";
import SortDropdown from "@/components/common/SortDropdown";
import ServiceDropdown from "./ServiceDropdown";
import RegionDropdown from "./RegionDropdown";
import DriverList from "./FindDriverList";
import { useGetMovers } from "@/hooks/useMover";

import {
  moverSortOption,
  regionTypeOption,
  serviceTypeOption,
  type QuerySelectType,
} from "@/types/queryType";
import { DriverResponseType } from "@/types/driverProfileType";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/libs/i18n/I18nProvider";

export default function MoversPage() {
  // 언어 훅
  const { t } = useI18n();
  // 지역, 서비스 label / value로 분리해서 선택
  const [selectedRegion, setSelectedRegion] = useState<QuerySelectType>(
    regionTypeOption(t)[0]
  );
  const [selectedService, setSelectedService] = useState<QuerySelectType>(
    serviceTypeOption(t)[0]
  );
  const [keyword, setKeyword] = useState<string>("");
  const [sort, setSort] = useState<QuerySelectType>(moverSortOption(t)[0]);
  const { isGuest } = useAuth(); // 비회원 여부 확인

  // 무한 스크롤을 위한 ref
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data: movers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetMovers({
    keyword: keyword,
    region: selectedRegion.value,
    service: selectedService.value,
    sort: sort.value,
    limit: 20,
  });

  // 모든 페이지의 데이터를 하나의 배열로 합치기
  const allMovers = movers?.pages.flatMap((page) => page.list) ?? [];

  // Intersection Observer 설정
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const onClickReset = () => {
    setSelectedRegion(regionTypeOption(t)[0]);
    setSelectedService(serviceTypeOption(t)[0]);
  };

  return (
    <section className="max-md:px-18 max-sm:px-6 bg-gray-50">
      <div className="max-md:hidden">
        <p className="pret-2xl-semibold py-8">{t("driver_search")}</p>
      </div>
      <div className="flex gap-4 justify-between max-md:flex-col max-md:gap-0 max-md:relative max-md:pt-4">
        <div className="max-w-[328px] w-full flex flex-col gap-8 max-md:flex-row max-md:gap-3 max-md:absolute max-sm:gap-0.5">
          <div className="flex items-center justify-between border-b border-line-200 px-[10px] py-4 max-md:hidden">
            <p className="pret-xl-medium text-black">{t("filter")}</p>
            <button
              className="pret-lg-medium text-gray-300 cursor-pointer"
              onClick={onClickReset}
            >
              {t("reset")}
            </button>
          </div>
          <div>
            <p className="pret-2lg-medium text-black-400 mb-4 max-md:hidden">
              {t("select_region")}
            </p>
            <RegionDropdown
              regionList={regionTypeOption(t)}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
            />
          </div>
          <div>
            <p className="pret-2lg-medium text-black-400 mb-4 max-md:hidden">
              {t("select_service")}
            </p>
            <ServiceDropdown
              serviceList={serviceTypeOption(t)}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          </div>
          <div className="flex flex-col gap-4 mt-3.5 max-md:hidden">
            <p className="pret-xl-semibold text-black-400">{t("favorite_drivers")}</p>
            {isGuest ? (
              <></>
            ) : (
              <DriverList
                size="sm"
                key={1}
                id={1}
                name="이영훈"
                driverIntro="고객님의 물품을 안전하게 운송해 드립니다. (한줄소개란)"
                likeCount={234}
                rating={4.5}
                reviewCount={10}
                driverYears={10}
                confirmedCount={334}
                movingType={['SMALL', 'HOME']}
                imageSrc="/assets/image/avatartion-3.png"
              />
            )}
          </div>
        </div>
        <div className="max-w-[955px] w-full flex flex-col gap-8 max-md:gap-6">
          <div className="flex flex-col gap-6 items-end">
            <SortDropdown
              sortList={moverSortOption(t)}
              sort={sort}
              setSort={setSort}
            />
            <Search keyword={keyword} setKeyword={setKeyword} />
          </div>
          <div className="flex flex-col gap-12 max-md:gap-8 max-sm:gap-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : (
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
                  imageSrc={"/assets/image/avatartion-3.png"}
                  movingType={driver.serviceCategories}
                />
              ))
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
        </div>
      </div>
    </section>
  );
}
