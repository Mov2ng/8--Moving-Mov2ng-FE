"use client";
import React, { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ReviewPointBox from "./ReviewPointBox";
import ReviewList from "./ReviewList";
import FindDriverProfile from "./FindDriverProfile";
import RegionChip from "@/components/chips/RegionChip";
import Image from "next/image";
import Button from "@/components/common/button";
import { Pagination } from "@/components/common/Pagination";
import { useGetMoverExtra, useGetMoverFull, usePostFavoriteMover } from "@/hooks/useMover";
import { useParams } from "next/navigation";

import { ReviewType } from "@/types/driverProfileType";

interface Mover {
  id: number;
  name: string;
  likeCount: number;
  rating: number;
  reviewCount: number;
  driverYears: number;
  confirmedCount: number;
  serviceCategories: string[];
  regions: string[];
  driverIntro?: string;
  driverContent?: string;
}

interface MoversCache {
  data?: {
    list?: Mover[];
  };
}

export default function MoversDetailPage() {
  const { id } = useParams<{ id: string }>();
  const idNumber = parseInt(id);

  const queryClient = useQueryClient();

  // 캐시된 movers 목록에서 해당 id의 mover 찾기
  const cachedMover = useMemo(() => {
    // 모든 movers 쿼리 캐시 검색
    const queries = queryClient.getQueriesData<MoversCache>({
      queryKey: ["movers"],
    });

    for (const [, data] of queries) {
      const found = data?.data?.list?.find((mover: Mover) => mover.id === idNumber);
      if (found) return found;
    }
    return null;
  }, [queryClient, idNumber]);


  const hasExistingData = cachedMover !== null;

  // 전체 데이터 (캐시에 없을 때만 fetch)
  const { data: fullData, isLoading: isFullLoading } = useGetMoverFull(idNumber, {
    enabled: !hasExistingData,
  });

  // 추가 데이터 (캐시에 있을 때만 fetch)
  const { data: extraData, isLoading: isExtraLoading } = useGetMoverExtra(idNumber, {
    enabled: hasExistingData,
  });

  // 최종 사용할 데이터 결정
  const driver = hasExistingData
    ? { ...cachedMover, ...extraData?.data }
    : fullData?.data;

  // 로딩 상태
  const isLoading = hasExistingData ? isExtraLoading : isFullLoading;

  // 로딩 UI 표시
  if (isLoading) {
    return (
      <section className="flex gap-[117px] w-full pt-[56px] max-md:flex-col max-md:gap-[50px] max-md:px-18 max-sm:px-6">
        <div className="flex flex-col gap-10 max-w-[955px] w-full items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-blue-300 border-t-transparent" />
          <p className="pret-lg-medium text-gray-400">로딩 중...</p>
        </div>
      </section>
    );
  }

  if (!driver) {
    return <div>데이터가 없습니다.</div>;
  }

  const { mutate: postFavoriteMover, isPending: isPostFavoriteMoverPending } = usePostFavoriteMover(idNumber);
  
  // 기사님 찜하기 핸들러 -> 오류 처리 필요
  const handlePostFavoriteMover = () => {
    postFavoriteMover(idNumber, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["movers"] });
      },
    });
  };

  return (
    <section className="flex gap-[117px] w-full pt-[56px] max-md:flex-col max-md:gap-[50px] max-md:px-18 max-sm:px-6">
      <div className="flex flex-col gap-10 max-w-[955px] w-full">
        <FindDriverProfile
          name={driver.name}
          likeCount={driver.likeCount}
          rating={driver.rating}
          reviewCount={driver.reviewCount}
          driverYears={driver.driverYears}
          confirmedCount={driver.confirmedCount}
          size="md"
        />

        <div className="w-full h-px bg-line-100" />
        <div className="flex flex-col gap-8">
          <h2 className="pret-2xl-bold text-black-400">상세설명</h2>
          <p className="pret-2lg-regular text-black-400">
            {driver?.driverContent}
          </p>
        </div>

        <div className="w-full h-px bg-line-100" />

        <div className="flex flex-col gap-8">
          <h2 className="pret-2xl-bold text-black-400">제공 서비스</h2>
          <div className="flex gap-3">
            {driver?.serviceCategories?.map((category: string) => (
              <RegionChip
                key={category}
                label={category}
                size="md"
                selected={true}
              />
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-line-100" />

        <div className="flex flex-col gap-8">
          <h2 className="pret-2xl-bold text-black-400">서비스 가능 지역</h2>
          <div className="flex gap-3">
            {driver?.regions?.map((region: string) => (
              <RegionChip key={region} label={region} size="md" />
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-line-100" />

        <h2 className="pret-2xl-bold text-black-400">리뷰</h2>
        <ReviewPointBox
          rating={driver?.rating}
          reviewCount={driver?.reviewCount}
          reviewList={driver?.reviewList}
        />
        <div>
          {driver?.reviewList?.map((review: ReviewType) => (
            <ReviewList
              key={review.id}
              username={review.user.name}
              date={review.createdAt}
              rating={review.rating}
              content={review.content}
            />
          ))}
          <Pagination page={1} />
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-8 w-[354px] max-md:w-full max-md:h-[54px] max-md:gap-2 max-md:flex-row">
          <h2 className="pret-xl-semibold text-black-400 max-md:hidden">
            김코드 기사님에게 지정 견적을 요청해보세요!
          </h2>
          {/* 기사님 찜하기 버튼 성공 시 버튼 상태 변경 필요 */}
          <button onClick={handlePostFavoriteMover} className="flex items-center justify-center gap-[10px] w-full h-[54px] bg-gray-50 border border-line-200 rounded-2xl pret-xl-medium text-black cursor-pointer max-md:size-[54px]">
            <Image
              src="/assets/icon/ic-like-active.svg"
              alt="heart"
              width={24}
              height={24}
            />
            <span className="max-md:hidden">기사님 찜하기</span>
          </button>
          <Button
            text="지정 견적 요청"
            disabled={false}
            width="full"
            className="flex items-center justify-center max-md:w-full max-md:h-full"
          />
        </div>
        <div className="w-full h-px bg-line-100" />
        <div className="flex flex-col gap-[22px] max-md:hidden">
          <h2 className="pret-xl-semibold text-black-400">
            나만 알기엔 아쉬운 기사님인가요?
          </h2>
          <div className="flex gap-4">
            <button className="size-16 bg-gray-50 border border-line-200 rounded-2xl flex items-center justify-center">
              <Image
                src="/assets/icon/ic-clip.svg"
                alt="clip"
                width={36}
                height={36}
              />
            </button>
            <button className="size-16 bg-[#FAE100] rounded-2xl flex items-center justify-center">
              <Image
                src="/assets/icon/ic-kakao.svg"
                alt="kakao"
                width={36}
                height={36}
              />
            </button>
            <button className="size-16 bg-[#4285F4] rounded-2xl flex items-center justify-center">
              <Image
                src="/assets/icon/ic-facebook.svg"
                alt="facebook"
                width={36}
                height={36}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
