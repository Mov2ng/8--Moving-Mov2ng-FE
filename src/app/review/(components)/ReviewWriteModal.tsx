import { useMemo, useState } from "react";
import Image from "next/image";
import MovingTypeChip from "@/components/chips/MovingTypeChip";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import Button from "@/components/common/button";
import {
  DEFAULT_SERVICE_ICON,
  SERVICE_ICON_MAP,
  SERVICE_LABEL_SHORT_MAP,
  isServiceTypeKey,
} from "@/constants/serviceType";
import type { ReviewItem } from "@/types/view/review";

interface ReviewWriteModalProps {
  open: boolean;
  onClose: () => void;
  item?: ReviewItem | null;
  onSubmit?: (payload: {
    rating: number;
    content: string;
    item: ReviewItem;
  }) => void;
  isSubmitting?: boolean;
}

export default function ReviewWriteModal({
  open,
  onClose,
  item,
  onSubmit,
  isSubmitting = false,
}: ReviewWriteModalProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const iconSrc = useMemo(() => {
    if (item?.serviceType && isServiceTypeKey(item.serviceType)) {
      return SERVICE_ICON_MAP[item.serviceType];
    }
    return DEFAULT_SERVICE_ICON;
  }, [item]);

  const shortLabel = useMemo(() => {
    if (item?.serviceType && isServiceTypeKey(item.serviceType)) {
      return SERVICE_LABEL_SHORT_MAP[item.serviceType];
    }
    return item?.serviceType ?? "";
  }, [item]);

  if (!open || !item) return null;

  const disabled = isSubmitting || rating === 0 || content.trim().length < 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60">
      <div className="inline-flex flex-col items-start gap-10 w-full max-w-[560px] bg-white rounded-[20px] shadow-lg border border-line-100 px-6 pt-8 pb-10 relative">
        <div className="flex items-start justify-between w-full">
          <div className="text-primary-black-400 pret-2xl-semibold">
            리뷰 쓰기
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="text-gray-300 hover:text-black-300"
          >
            ×
          </button>
        </div>

        {/* 태그 영역 */}
        <div className="flex flex-wrap gap-2 w-full">
          {item.serviceType && (
            <>
              <div className="lg:hidden">
                <MovingTypeChip
                  label={shortLabel}
                  iconSrc={iconSrc}
                  size="sm"
                  variant="bl"
                />
              </div>
              <div className="hidden lg:inline-flex">
                <MovingTypeChip
                  label={item.serviceType}
                  iconSrc={iconSrc}
                  size="sm"
                  variant="bl"
                />
              </div>
            </>
          )}
          {item.isDesignatedRequest && (
            <MovingTypeChip
              label={item.designatedLabel ?? "지정 견적 요청"}
              iconSrc="/icons/redfile.svg"
              size="sm"
              variant="rd"
            />
          )}
        </div>

        {/* 기사/견적 정보 박스 */}
        <div className="w-full border border-line-100 rounded-xl p-4 flex items-center gap-4 bg-white">
          <ProfileAvatar
            src={item.profileImage}
            alt={item.name}
            size="md"
            responsive={false}
          />
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-primary-black-400 pret-xl-semibold leading-6">
              {item.name}
            </div>
            <div className="flex items-center gap-3 text-black-300 pret-15-medium flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-gray-300">이사일</span>
                <span className="text-black-400">{item.movingDate}</span>
              </div>
              <span className="text-line-200">|</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-300">견적가</span>
                <span className="text-black-400">
                  {item.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 평점 선택 */}
        <div className="w-full">
          <div className="text-primary-black-400 pret-16-semibold mb-3">
            평점을 선택해 주세요
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= rating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                  aria-label={`별 ${star}점`}
                >
                  <Image
                    src={
                      active
                        ? "/assets/icon/ic-star-active.svg"
                        : "/assets/icon/ic-star-default.svg"
                    }
                    alt={active ? "선택된 별" : "선택되지 않은 별"}
                    width={32}
                    height={32}
                    unoptimized
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full border-t border-line-100" />

        {/* 후기 입력 */}
        <div className="w-full">
          <div className="text-primary-black-400 pret-16-semibold mb-3">
            상세 후기를 작성해 주세요
          </div>
          <textarea
            className="w-full min-h-[140px] rounded-xl border border-line-100 bg-background-100 px-4 py-3 text-black-300 pret-15-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue-200"
            placeholder="최소 10자 이상 입력해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="text-right text-gray-300 pret-13-medium mt-1">
            {content.trim().length}자 / 최소 10자
          </div>
        </div>

        <Button
          text="리뷰 등록"
          variant="solid"
          width="100%"
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            if (onSubmit) onSubmit({ rating, content: content.trim(), item });
            onClose();
          }}
        />
      </div>
    </div>
  );
}
