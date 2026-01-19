import Image from "next/image";
import ReviewPointBox from "@/app/movers/(components)/ReviewPointBox";
import ReviewList from "@/app/movers/(components)/ReviewList";
import { Pagination } from "@/components/common/Pagination";
import type { ReviewType } from "@/types/driverProfileType";

interface ReviewSectionProps {
  rating?: number;
  reviewCount?: number;
  reviewList?: ReviewType[];
  reviews?: ReviewType[];
  page?: number;
}

/**
 * ReviewSection: 리뷰 섹션 공통 컴포넌트
 * @param rating 별점
 * @param reviewCount 리뷰 개수
 * @param reviewList 리뷰 리스트
 * @param reviews 리뷰 리스트
 * @param page 페이지
 * @returns
 */
export default function ReviewSection({
  rating = 0,
  reviewCount = 0,
  reviewList = [],
  reviews = [],
  page = 1,
}: ReviewSectionProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="pret-2xl-bold text-black-400">리뷰</h2>
      <ReviewPointBox
        rating={rating}
        reviewCount={reviewCount}
        reviewList={reviewList}
      />
      <div>
        {reviews && reviews.length > 0 ? (
          <>
            {reviews.map((review: ReviewType, index: number) => (
              <ReviewList
                key={review.id}
                username={review.user.name}
                date={review.createdAt}
                rating={review.rating}
                content={review.content}
                isLast={index === reviews.length - 1}
              />
            ))}
            <Pagination page={page} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-8 py-8">
            <div className="relative w-[184px] h-[136px]">
              <Image
                src="/assets/image/img-empty-blue.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 pret-2xl-regular text-center">
              아직 등록된 리뷰가 없어요!
            </p>
          </div>
        )}
      </div>
      <Pagination page={page} />
    </div>
  );
}
