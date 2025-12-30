"use client";

import React, { useEffect, useState } from "react";

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

export default function MoversPage() {
  // 지역, 서비스 label / value로 분리해서 선택
  const [selectedRegion, setSelectedRegion] = useState<QuerySelectType>(
    regionTypeOption[0]
  );
  const [selectedService, setSelectedService] = useState<QuerySelectType>(
    serviceTypeOption[0]
  );
  const [keyword, setKeyword] = useState<string>("");
  const [cursor, setCursor] = useState<number>(0);
  const [sort, setSort] = useState<QuerySelectType>(moverSortOption[0]);

  const { data: movers } = useGetMovers({
    keyword: keyword,
    region: selectedRegion.value,
    service: selectedService.value,
    sort: sort.value,
    cursor: cursor,
    limit: 20,
  });

  useEffect(() => {
    console.log(movers?.data);
    setCursor(movers?.data.id ?? 0);
  }, [keyword, selectedRegion, selectedService, sort, movers]);

  const onClickReset = () => {
    setSelectedRegion(regionTypeOption[0]);
    setSelectedService(serviceTypeOption[0]);
  };

  return (
    <section className="max-md:px-18 max-sm:px-6">
      <div className="max-md:hidden">
        <p className="pret-2xl-semibold py-8">기사님 찾기</p>
      </div>
      <div className="flex gap-4 justify-between max-md:flex-col max-md:gap-0 max-md:relative max-md:pt-4">
        <div className="max-w-[328px] w-full flex flex-col gap-8 max-md:flex-row max-md:gap-3 max-md:absolute max-sm:gap-0.5">
          <div className="flex items-center justify-between border-b border-line-200 px-[10px] py-4 max-md:hidden">
            <p className="pret-xl-medium text-black">필터</p>
            <button
              className="pret-lg-medium text-gray-300 cursor-pointer"
              onClick={onClickReset}
            >
              초기화
            </button>
          </div>
          <div>
            <p className="pret-2lg-medium text-black-400 mb-4 max-md:hidden">
              지역을 선택해주세요
            </p>
            <RegionDropdown
              regionList={regionTypeOption}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
            />
          </div>
          <div>
            <p className="pret-2lg-medium text-black-400 mb-4 max-md:hidden">
              어떤 서비스가 필요하세요?
            </p>
            <ServiceDropdown
              serviceList={serviceTypeOption}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          </div>
          <div className="flex flex-col gap-4 mt-3.5 max-md:hidden">
            <p className="pret-xl-semibold text-black-400">찜한 기사님</p>
            <DriverList
              size="sm"
              id={1}
              name="이영훈"
              driverIntro="고객님의 물품을 안전하게 운송해 드립니다. (한줄소개란)"
              likeCount={234}
              rating={4.5}
              reviewCount={10}
              driverYears={10}
              confirmedCount={334}
              imageSrc="/assets/image/avatartion-3.png"
            />
          </div>
        </div>
        <div className="max-w-[955px] w-full flex flex-col gap-8 max-md:gap-6">
          <div className="flex flex-col gap-6 items-end">
            <SortDropdown
              sortList={moverSortOption}
              sort={sort}
              setSort={setSort}
            />
            <Search keyword={keyword} setKeyword={setKeyword} />
          </div>
          <div className="flex flex-col gap-12 max-md:gap-8 max-sm:gap-6">
            {movers?.data.map((driver: DriverResponseType) => (
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
                confirmedCount={driver.estimateCount}
                imageSrc={"/assets/image/avatartion-3.png"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
