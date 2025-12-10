import Image from "next/image";

type AvatarSize = "sm" | "md" | "lg";

interface ProfileAvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  /** 반응형 크기 적용 여부 (기본: 비활성) */
  responsive?: boolean;
}

const sizeMap: Record<AvatarSize, { container: string; image: number }> = {
  sm: { container: "w-10 h-10", image: 40 },
  md: { container: "w-14 h-14", image: 56 },
  lg: { container: "w-20 h-20", image: 80 },
};

const responsiveMap: Record<AvatarSize, string> = {
  sm: "sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16",
  md: "sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-20 lg:h-20",
  lg: "sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-24 lg:h-24",
};

export default function ProfileAvatar({
  src = "/assets/image/img-profile.png",
  alt = "프로필 이미지",
  size = "md",
  className = "",
  responsive = true,
}: ProfileAvatarProps) {
  const { container, image } = sizeMap[size];

  return (
    <div
      className={`
        relative
        ${container}
        ${responsive ? responsiveMap[size] : ""}
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
      <Image
        src={src}
        alt={alt}
        width={image}
        height={image}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
