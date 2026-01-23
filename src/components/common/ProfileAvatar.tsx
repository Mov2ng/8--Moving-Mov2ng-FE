"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { DEFAULT_AVATAR_IMAGE } from "@/constants/profile.constants";

type AvatarSize = "xs" | "sm" | "md" | "lg";

interface ProfileAvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  responsive?: boolean;
}

const sizeMap: Record<AvatarSize, { container: string; image: number }> = {
  xs: { container: "w-[36px] h-[36px]", image: 36 },
  sm: { container: "w-[64px] h-[64px]", image: 64 },
  md: { container: "w-[70px] h-[70px]", image: 70 },
  lg: { container: "w-[100px] h-[100px]", image: 100 },
};

const responsiveClasses =
  "sm:w-[64px] sm:h-[64px] md:w-[70px] md:h-[70px] lg:w-[100px] lg:h-[100px]";

export default function ProfileAvatar({
  src = DEFAULT_AVATAR_IMAGE,
  alt = "프로필 이미지",
  size = "md",
  className = "",
  responsive = true,
}: ProfileAvatarProps) {
  const { container, image } = sizeMap[size];
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [displaySrc, setDisplaySrc] = useState<string>(src || DEFAULT_AVATAR_IMAGE);

  // src가 변경되면 로딩 상태 리셋
  useEffect(() => {
    const newSrc = src || DEFAULT_AVATAR_IMAGE;
    if (newSrc !== displaySrc) {
      setDisplaySrc(newSrc);
      setImageLoaded(false);
      setImageError(false);
    }
  }, [src, displaySrc]);

  // 기본 이미지인지 확인
  const isDefaultImage = !src || src === DEFAULT_AVATAR_IMAGE || src.includes("img-profile.png");
  
  // 실제 프로필 이미지가 있고 기본 이미지가 아닐 때만 로딩 상태 관리
  const isCustomImage = src && !isDefaultImage;

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
    setDisplaySrc(DEFAULT_AVATAR_IMAGE);
    // 에러 발생 시 기본 이미지로 전환하고 로드 완료 처리
    setTimeout(() => {
      setImageLoaded(true);
    }, 0);
  };

  // 기본 이미지이거나 이미 로드된 경우 즉시 표시, 커스텀 이미지는 로드 완료 후 표시
  const shouldShowImage = isDefaultImage || imageLoaded || imageError;
  const imageOpacity = (isDefaultImage || imageLoaded || imageError) ? "opacity-100" : "opacity-0";

  return (
    <div
      className={`
        relative
        ${container}
        ${responsive ? responsiveClasses : ""}
        border-2 border-black-300
        rounded-full
        overflow-hidden
        bg-background-100 
        flex
        items-center
        justify-center
        shrink-0
        ${className}
      `}
    >
      {/* 로딩 중일 때는 배경색만 표시 (깜빡임 방지) */}
      {isCustomImage && !imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-background-100" />
      )}
      
      {/* 이미지 항상 렌더링 (로드 이벤트를 받기 위해) */}
      <Image
        src={displaySrc}
        alt={alt}
        width={image}
        height={image}
        className={`w-full h-full object-cover ${imageOpacity} transition-opacity duration-150`}
        onLoad={handleLoad}
        onError={handleError}
        priority={isDefaultImage} // 기본 이미지는 우선 로드
      />
    </div>
  );
}
