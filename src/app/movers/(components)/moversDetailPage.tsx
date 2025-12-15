import React from "react";
import ReviewPointBox from "./ReviewPointBox";
import ReviewList from "./ReviewList";
import FindDriverProfile from "./FindDriverProfile";
import RegionChip from "@/components/chips/RegionChip";
import Image from "next/image";
import Button from "@/components/common/button";
import { Pagination } from "@/components/common/Pagination";

// ReviewCardList Component for multiple reviews
interface Review {
  id: string | number;
  username: string;
  date: string;
  rating: number;
  content: string;
}

// Example usage data
export const exampleReviews: Review[] = [
  {
    id: 1,
    username: "kim****",
    date: "2024-07-01",
    rating: 5,
    content: `듣던대로 정말 친절하시고 물건도 잘 옮겨주셨어요~~
나중에 또 짐 옮길 일 있으면 김코드 기사님께 부탁드릴 예정입니다!!
비 오는데 꼼꼼히 잘 해주셔서 감사드립니다 :)`,
  },
  {
    id: 2,
    username: "park***",
    date: "2024-06-28",
    rating: 4,
    content: `시간 약속 잘 지켜주시고, 물건도 소중하게 다뤄주셨습니다.
전반적으로 만족스러운 서비스였어요!`,
  },
  {
    id: 3,
    username: "lee****",
    date: "2024-06-15",
    rating: 5,
    content: `이사 전문 업체답게 정말 프로페셔널하게 작업해주셨습니다.
무거운 가구도 안전하게 옮겨주시고, 벽이나 바닥에 흠집 하나 없이 완벽하게 마무리해주셨어요.
다음에도 꼭 이용할게요! 강력 추천합니다 👍`,
  },
];

export default function MoversDetailPage({ id }: { id: string }) {
  return (
    <section className="flex gap-[117px] w-full pt-[56px] max-md:flex-col max-md:gap-[50px] max-md:px-18 max-sm:px-6">
      <div className="flex flex-col gap-10 max-w-[955px] w-full">
        <FindDriverProfile
          name="김코드 기사님"
          likeCount={100}
          career={10}
          confirmedCount={100}
          size="md"
        />
        <div className="w-full h-px bg-line-100" />
        <div className="flex flex-col gap-8">
          <h2 className="pret-2xl-bold text-black-400">상세설명</h2>
          <p className="pret-2lg-regular text-black-400">
            안녕하세요. 이사업계 경력 7년으로 안전한 이사를 도와드리는
            김코드입니다. 고객님의 물품을 소중하고 안전하게 운송하여 드립니다.
            소형이사 및 가정이사 서비스를 제공하며 서비스 가능 지역은 서울과
            경기권입니다.
          </p>
        </div>

        <div className="w-full h-px bg-line-100" />

        <div className="flex flex-col gap-8">
          <h2 className="pret-2xl-bold text-black-400">제공 서비스</h2>
          <div className="flex gap-3">
            <RegionChip label="소형이사" size="md" selected={true} />
            <RegionChip label="가정이사" size="md" selected={true} />
          </div>
        </div>

        <div className="w-full h-px bg-line-100" />

        <div className="flex flex-col gap-8">
          <h2 className="pret-2xl-bold text-black-400">서비스 가능 지역</h2>
          <div className="flex gap-3">
            <RegionChip label="서울" size="md" />
            <RegionChip label="경기" size="md" />
          </div>
        </div>

        <div className="w-full h-px bg-line-100" />

        <h2 className="pret-2xl-bold text-black-400">리뷰</h2>
        <ReviewPointBox />
        <div>
          {exampleReviews.map((review) => (
            <ReviewList key={review.id} {...review} />
          ))}
          <Pagination page={1} />
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-8 w-[354px] max-md:w-full max-md:h-[54px] max-md:gap-2 max-md:flex-row">
          <h2 className="pret-xl-semibold text-black-400 max-md:hidden">
            김코드 기사님에게 지정 견적을 요청해보세요!
          </h2>
          <button className="flex items-center justify-center gap-[10px] w-full h-[54px] bg-gray-50 border border-line-200 rounded-2xl pret-xl-medium text-black cursor-pointer max-md:size-[54px]">
            <Image
              src="/assets/icon/ic-like-active.svg"
              alt="heart"
              width={24}
              height={24}
            />
            <span className="max-md:hidden">기사님 찜하기</span>
          </button>
          <Button text="지정 견적 요청" disabled={false} width="full" className="flex items-center justify-center max-md:w-full max-md:h-full" />
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
