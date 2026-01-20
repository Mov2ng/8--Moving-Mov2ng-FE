// 찜한 기사님 카드
import DriverProfile from "@/components/common/DriverProfile";
import MovingTypeChip from "@/components/chips/MovingTypeChip";
import { useI18n } from "@/libs/i18n/I18nProvider";
import Link from "next/link";
import { useGetViewPresignedUrl } from "@/hooks/useFileService";

interface FavoriteDriverCardProps {
  id: number;
  // 이사 유형
  serviceType?: string;
  // 기사 정보
  name: string;
  profileImage: string;
  avatarSize?: "sm" | "md" | "lg";
  avatarResponsive?: boolean;
  rating?: number;
  reviewCount?: number;
  experience?: number;
  confirmedCount?: number;
  likeCount?: number;
}

const serviceIconMap: Record<string, string> = {
  소형이사: "/icons/box.svg",
  가정이사: "/icons/home.svg",
  사무실이사: "/icons/office.svg",
};

const serviceLabelShortMap: Record<string, string> = {
  소형이사: "소형",
  가정이사: "가정",
  사무실이사: "사무실",
};

export default function FavoriteDriverCard({
  id,
  serviceType,
  name,
  profileImage,
  avatarSize = "md",
  avatarResponsive = false,
  rating,
  reviewCount,
  experience,
  confirmedCount,
  likeCount,
}: FavoriteDriverCardProps) {
  const { t } = useI18n();
  const { data: profileImageUrl } = useGetViewPresignedUrl(profileImage);

  const iconSrc =
    serviceType && serviceIconMap[serviceType]
      ? serviceIconMap[serviceType]
      : "/icons/box.svg";
  const shortLabel =
    serviceType && serviceLabelShortMap[serviceType]
      ? serviceLabelShortMap[serviceType]
      : serviceType ?? "";

  return (
    <Link 
      href={`/movers/${id}`}
      className="bg-gray-50 rounded-2xl p-4 shadow-sm border border-line-100 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow block"
    >
      {serviceType && (
        <div className="flex gap-2">
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
              label={serviceType}
              iconSrc={iconSrc}
              size="sm"
              variant="bl"
            />
          </div>
        </div>
      )}

      <DriverProfile
        name={name}
        profileImage={profileImageUrl || '/assets/image/avatartion-3.png'}
        avatarSize={avatarSize}
        avatarResponsive={avatarResponsive}
        nameSuffix={t("driver_suffix")}
        rating={rating}
        reviewCount={reviewCount}
        experience={experience}
        confirmedCount={confirmedCount}
        likeCount={likeCount}
      />
    </Link>
  );
}
