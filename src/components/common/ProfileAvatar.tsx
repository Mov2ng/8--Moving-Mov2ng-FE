import Image from "next/image";

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
