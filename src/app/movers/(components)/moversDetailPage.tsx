"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ReviewPointBox from "./ReviewPointBox";
import ReviewList from "./ReviewList";
import FindDriverProfile from "./FindDriverProfile";
import RegionChip from "@/components/chips/RegionChip";
import Image from "next/image";
import Button from "@/components/common/button";
import Modal from "@/components/common/Modal";
import { Pagination } from "@/components/common/Pagination";
import {
  useGetMoverExtra,
  useGetMoverFull,
  usePostFavoriteMover,
  useDeleteFavoriteMover,
  usePostRequestDriver,
} from "@/hooks/useMover";
import Toast from "@/components/common/Toast";

// 무한 스크롤 캐시 데이터 타입
interface MoversPageData {
  list: Mover[];
  nextCursor: number | null;
  hasNext: boolean;
}

interface MoversInfiniteCache {
  pages: MoversPageData[];
  pageParams: (number | undefined)[];
}

interface MoversNormalCache {
  data: {
    list: Mover[];
  };
}
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { SERVICE_CATEGORIES, REGIONS } from "@/constants/profile.constants";

import type { ReviewType } from "@/types/driverProfileType";

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
  const { isGuest } = useAuth(); // 비회원 여부 확인
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // 로그인 모달 열기
  const [isToastOpen, setIsToastOpen] = useState(false); // 토스트 열기

  // 서비스 카테고리 라벨 매핑
  const SERVICE_CATEGORY_LABEL_MAP: Record<string, string> = Object.fromEntries(
    SERVICE_CATEGORIES.map((category) => [category.value, category.label])
  );

  // 지역 라벨 매핑
  const REGION_LABEL_MAP: Record<string, string> = Object.fromEntries(
    REGIONS.map((region) => [region.value, region.label])
  );

  const queryClient = useQueryClient();

  // 캐시된 movers 목록에서 해당 id의 mover 찾기
  const cachedMover = useMemo(() => {
    // 모든 movers 쿼리 캐시 검색
    const queries = queryClient.getQueriesData<
      MoversInfiniteCache | MoversNormalCache
    >({
      queryKey: ["movers"],
    });

    for (const [, data] of queries) {
      // useInfiniteQuery의 pages 구조 처리 (무한 스크롤 데이터)
      if (data && "pages" in data) {
        for (const page of data.pages) {
          const found = page?.list?.find(
            (mover: Mover) => mover.id === idNumber
          );
          if (found) return found;
        }
      }
      // 일반 useQuery의 data.list 구조 처리 (fallback)
      else if (data && "data" in data) {
        const found = data.data.list.find(
          (mover: Mover) => mover.id === idNumber
        );
        if (found) return found;
      }
    }
    return null;
  }, [queryClient, idNumber]);

  const hasExistingData = cachedMover !== null;

  // 전체 데이터 (캐시에 없을 때만 fetch)
  const { data: fullData, isLoading: isFullLoading } = useGetMoverFull(
    idNumber,
    {
      enabled: !hasExistingData,
    }
  );

  // 추가 데이터 (캐시에 있을 때만 fetch)
  const { data: extraData, isLoading: isExtraLoading } = useGetMoverExtra(
    idNumber,
    {
      enabled: hasExistingData,
    }
  );

  // 최종 사용할 데이터 결정
  const driver = hasExistingData
    ? { ...cachedMover, ...extraData?.data }
    : fullData?.data;

  const regionLabels = driver?.regions?.map(
    (region: string) => REGION_LABEL_MAP[region]
  );

  const serviceCategoryLabels = driver?.serviceCategories?.map(
    (category: string) => SERVICE_CATEGORY_LABEL_MAP[category]
  );

  // 로딩 상태
  const isLoading = hasExistingData ? isExtraLoading : isFullLoading;

  // ⚠️ 모든 hooks는 조건부 return 이전에 호출해야 함
  // 찜하기
  const { mutate: postFavoriteMover, isPending: isPostFavoriteMoverPending } =
    usePostFavoriteMover(idNumber);
  // 찜 취소
  const {
    mutate: deleteFavoriteMover,
    isPending: isDeleteFavoriteMoverPending,
  } = useDeleteFavoriteMover(idNumber);
  // 지정 견적 요청
  const { mutate: postRequestDriver, isPending: isPostRequestDriverPending } =
    usePostRequestDriver(idNumber);

  // 찜 상태 관리
  const [isFavorite, setIsFavorite] = useState(false);

  // 기사님 정보 로딩 후 찜 상태 설정
  useEffect(() => {
    if (driver?.isFavorite !== undefined) {
      setIsFavorite(driver.isFavorite);
    }
  }, [driver?.isFavorite]);

  // 기사님 찜하기 핸들러
  const handlePostFavoriteMover = () => {
    if (isGuest) {
      setIsModalOpen(true);
      return;
    }

    // 이미 찜한 상태면 삭제, 아니면 추가
    if (isFavorite) {
      deleteFavoriteMover(idNumber, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["movers"] });
          setIsFavorite(false); // 찜 취소
        },
      });
    } else {
      postFavoriteMover(idNumber, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["movers"] });
          setIsFavorite(true); // 찜 추가
        },
      });
    }
  };

  const handleRequestDriver = () => {
    if (isGuest) {
      setIsModalOpen(true);
      return;
    }

    // 이미 지정 견적 요청한 상태면 취소, 아니면 요청
    // me에 포함된 requests에 해당 기사님의 id가 있는지 확인 ??

    // 지정 견적 요청 로직 추가
    postRequestDriver(idNumber, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["movers"] });
        setIsToastOpen(true);
        setTimeout(() => {
          setIsToastOpen(false);
        }, 3000); 
      },
    });
  };

  const modalButtonClick = () => {
    router.push("/login");
  };

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

  return (
    <section className="flex gap-[117px] w-full pt-[56px] max-md:flex-col max-md:gap-[50px] max-md:px-18 max-sm:px-6 bg-gray-50">
      <Modal
        title="로그인 필요"
        content="로그인 후 이용해주세요."
        buttonText="확인"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        buttonClick={modalButtonClick}
      />
      {isToastOpen && (
        <Toast content="지정 견적 요청이 완료되었습니다." info={false} />
      )}
      <div className="flex flex-col gap-10 max-w-[955px] w-full">
        <FindDriverProfile
          name={driver.nickname}
          likeCount={driver.favoriteCount}
          rating={driver.rating}
          reviewCount={driver.reviewCount}
          driverYears={driver.driverYears}
          confirmedCount={driver.confirmCount}
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
            <RegionChip key={1} label={"전체"} size="md" selected={true} />
            {serviceCategoryLabels?.map((category: string) => (
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
            {regionLabels?.map((region: string) => (
              <RegionChip key={region} label={region} size="md" />
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-line-100" />

        <h2 className="pret-2xl-bold text-black-400">리뷰</h2>
        <ReviewPointBox
          rating={driver?.rating}
          reviewCount={driver?.reviewCount}
          reviewList={driver?.reviews}
        />
        <div>
          {driver?.reviews?.map((review: ReviewType) => (
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
          {/* 기사님 찜하기 버튼 */}
          <button
            onClick={handlePostFavoriteMover}
            className="flex items-center justify-center gap-[10px] w-full h-[54px] bg-gray-50 border border-line-200 rounded-2xl pret-xl-medium text-black cursor-pointer max-md:size-[54px]"
          >
            <Image
              src={
                isFavorite
                  ? "/assets/icon/ic-like-fill.svg"
                  : "/assets/icon/ic-like-default.svg"
              }
              alt="heart"
              width={24}
              height={24}
            />
            <span className="max-md:hidden">
              {isPostFavoriteMoverPending
                ? "처리 중..."
                : isFavorite
                ? "찜 완료"
                : "기사님 찜하기"}
            </span>
          </button>
          <Button
            text="지정 견적 요청"
            onClick={handleRequestDriver}
            disabled={isGuest ? true : false}
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
