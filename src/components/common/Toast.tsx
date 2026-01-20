"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const DURATION = 3000; // 3초 토스트 지속 시간
const ANIMATION_DURATION = 500; // 0.5초 토스트 애니메이션 지속 시간

export default function Toast({
  content,
  info = false,
}: {
  content: string;
  info?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // content가 비어있으면 무시
    if (!content || content.trim() === "") {
      return;
    }

    // 새로운 content가 들어오면 표시
    setIsVisible(true);
    setIsClosing(false);

    // DURATION 후 닫기 애니메이션 시작
    const closeTimer = setTimeout(() => {
      setIsClosing(true);
    }, DURATION);

    // 애니메이션 완료 후 숨김
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, DURATION + ANIMATION_DURATION);

    return () => {
      clearTimeout(closeTimer);
      clearTimeout(hideTimer);
    };
  }, [content]);

  // content가 없거나 visible 상태가 아니면 렌더링하지 않음
  if (!isVisible || !content) {
    return null;
  }

  return (
    <div
      className={`flex items-center max-w-[955px] w-full border border-primary-blue-200 rounded-xl bg-primary-blue-100 
      py-[18px] px-[24px] gap-4 fixed top-20 left-0 right-0 mx-auto z-50
      max-sm:gap-2 max-sm:px-[24px] max-sm:py-[10px]
      ${isClosing ? 'animate-fade-out-up' : 'animate-fade-in-up'}`}
    >
      {info && (
        <Image
          src="/assets/icon/ic-info-blue.svg"
          alt="info"
          width={24}
          height={24}
          className="w-6 h-6 max-sm:w-4 max-sm:h-4"
        />
      )}
      <p className="text-lg max-sm:text-sm font-semibold text-primary-blue-300">
        {content}
      </p>
    </div>
  );
}
