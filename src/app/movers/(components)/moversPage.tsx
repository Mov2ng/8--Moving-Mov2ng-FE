"use client";

import React, { useState } from "react";
import Toast from "@/components/common/Toast";
import Search from "@/components/common/Search";
import SortDropdown from "@/components/common/SortDropdown";
import ServiceDropdown from "./ServiceDropdown";
import RegionDropdown from "./RegionDropdown";
import DriverList from "./FindDriverList";
import DriverProfile from "@/components/molecules/DriverProfile";

export default function MoversPage() {
  const sortList = ["리뷰 많은순", "평점 높은순", "경력 높은순", "확정 높은순"];

  return (
    <section>
      <div>
        <p className="pret-2xl-semibold py-8">기사님 찾기</p>
      </div>
      <div className="flex gap-4 justify-between">
        <div className="max-w-[328px] w-full flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-line-200 px-[10px] py-4">
            <p className="pret-xl-medium text-black">필터</p>
            <button className="pret-lg-medium text-gray-300 cursor-pointer">
              초기화
            </button>
          </div>
          <div>
            <p className="pret-2lg-medium text-black-400 mb-4">
              지역을 선택해주세요
            </p>
            <RegionDropdown />
          </div>
          <div>
            <p className="pret-2lg-medium text-black-400 mb-4">
              어떤 서비스가 필요하세요?
            </p>
            <ServiceDropdown />
          </div>
          <div className="flex flex-col gap-4 mt-3.5">
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
        <div className="max-w-[955px] w-full flex flex-col gap-8">
          <div className="flex flex-col gap-6 items-end">
            <SortDropdown sortList={sortList} sort="리뷰 많은순" />
            <Search />
          </div>
          <div className="flex flex-col gap-12">
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
