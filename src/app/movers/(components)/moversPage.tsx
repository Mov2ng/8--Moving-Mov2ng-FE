"use client";

import React, { useState } from "react";

import Search from "@/components/common/Search";
import SortDropdown from "@/components/common/SortDropdown";
import ServiceDropdown from "./ServiceDropdown";
import RegionDropdown from "./RegionDropdown";
import DriverList from "./FindDriverList";

export default function MoversPage() {
  const sortList = ["리뷰 많은순", "평점 높은순", "경력 높은순", "확정 높은순"];
  const [selectedRegion, setSelectedRegion] = useState<string>("지역");
  const [selectedService, setSelectedService] = useState<string>("서비스");

  const onClickReset = () => {
    setSelectedRegion("지역");
    setSelectedService("서비스");
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
            <button className="pret-lg-medium text-gray-300 cursor-pointer" onClick={onClickReset}>
              초기화
            </button>
          </div>
          <div>
            <p className="pret-2lg-medium text-black-400 mb-4 max-md:hidden">
              지역을 선택해주세요
            </p>
            <RegionDropdown selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
          </div>
          <div>
            <p className="pret-2lg-medium text-black-400 mb-4 max-md:hidden">
              어떤 서비스가 필요하세요?
            </p>
            <ServiceDropdown selectedService={selectedService} setSelectedService={setSelectedService} />
          </div>
          <div className="flex flex-col gap-4 mt-3.5 max-md:hidden">
            <p className="pret-xl-semibold text-black-400">찜한 기사님</p>
            <DriverList
              size="sm"
              name="이영훈"
              likeCount={234}
              career={10}
              confirmedCount={334}
              imageSrc="/assets/image/avatartion-3.png"
            />
          </div>
        </div>
        <div className="max-w-[955px] w-full flex flex-col gap-8 max-md:gap-6">
          <div className="flex flex-col gap-6 items-end">
            <SortDropdown sortList={sortList} sort="리뷰 많은순" />
            <Search />
          </div>
          <div className="flex flex-col gap-12 max-md:gap-8 max-sm:gap-6">
            <DriverList
              size="md"
              name="이영훈"
              likeCount={234}
              career={10}
              confirmedCount={334}
              imageSrc="/assets/image/avatartion-3.png"
            />
            <DriverList
              size="md"
              name="이영훈"
              likeCount={234}
              career={10}
              confirmedCount={334}
              imageSrc="/assets/image/avatartion-3.png"
            />
            <DriverList
              size="md"
              name="이영훈"
              likeCount={234}
              career={10}
              confirmedCount={334}
              imageSrc="/assets/image/avatartion-3.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
