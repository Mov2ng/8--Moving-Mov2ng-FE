"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

import Search from "@/components/common/Search";
import SortDropdown from "@/components/common/SortDropdown";
import MoversFilter from "./MoversFilter";
import MoversFavoriteList from "./MoversFavoriteList";
import { useGetMovers } from "@/hooks/useMover";

import {
  moverSortOption,
  regionTypeOption,
  serviceTypeOption,
  type QuerySelectType,
} from "@/types/queryType";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/libs/i18n/I18nProvider";
import MoversList from "./MoversList";

export default function MoversPage() {
  // 언어 훅
  const { t, locale } = useI18n();
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

  // 언어가 변경될 때 선택된 옵션들을 업데이트
  useEffect(() => {
    const regionOptions = regionTypeOption(t);
    const serviceOptions = serviceTypeOption(t);
    const sortOptions = moverSortOption(t);

    // 현재 선택된 value를 유지하면서 label만 업데이트
    setSelectedRegion((prev) => {
      const newOption = regionOptions.find((opt) => opt.value === prev.value);
      return newOption || regionOptions[0];
    });

    setSelectedService((prev) => {
      const newOption = serviceOptions.find((opt) => opt.value === prev.value);
      return newOption || serviceOptions[0];
    });

    setSort((prev) => {
      const newOption = sortOptions.find((opt) => opt.value === prev.value);
      return newOption || sortOptions[0];
    });
  }, [locale, t]);

  // 무한 스크롤을 위한 ref
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data: movers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
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
    setKeyword("");
    setSort(moverSortOption(t)[0]);
  };

  return (
    <section className="px-10 max-md:px-18 max-sm:px-6 bg-gray-50">
      <div className="max-md:hidden">
        <p className="pret-2xl-semibold py-8">{t("driver_search")}</p>
      </div>
      <div className="flex gap-4 justify-between max-md:flex-col max-md:gap-0 max-md:relative max-md:pt-4">
        <div className="sticky top-0 self-start max-w-[328px] w-full flex flex-col gap-8 max-md:flex-row max-md:gap-3 max-md:absolute max-md:top-3 max-sm:gap-1">
          <MoversFilter t={t} onClickReset={onClickReset} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} selectedService={selectedService} setSelectedService={setSelectedService} />
          <MoversFavoriteList t={t} isGuest={isGuest} />
        </div>
        <div className="max-w-[955px] w-full flex flex-col gap-8 max-md:gap-6">
          <div className="w-full flex flex-col gap-6 items-end bg-gray-50">
            <SortDropdown
              sortList={moverSortOption(t)}
              sort={sort}
              setSort={setSort}
            />
            <Search keyword={keyword} setKeyword={setKeyword} />
          </div>
          <MoversList allMovers={allMovers} isPending={isPending} isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} loadMoreRef={loadMoreRef} />
        </div>
      </div>
    </section>
  );
}
