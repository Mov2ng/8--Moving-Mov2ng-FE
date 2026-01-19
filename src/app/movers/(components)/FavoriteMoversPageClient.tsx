"use client";

import { useApiQuery } from "@/hooks/useApiQuery";
import { apiClient } from "@/libs/apiClient";
import FavoriteDriverCard from "./FavoriteDriverCard";
import Image from "next/image";
import { useI18n } from "@/libs/i18n/I18nProvider";

import type {
  ApiFavoriteDriver,
  FavoriteDriverView,
} from "@/types/view/favorite";
import { getServiceLabel } from "@/constants/profile.constants";

export default function FavoriteMoversPageClient() {
  const { t } = useI18n();

  const adaptFavorite = (item: ApiFavoriteDriver): FavoriteDriverView => {
    const serviceType = item.category
      ? item.category === "SMALL"
        ? t("moving_type_small")
        : item.category === "HOME"
        ? t("moving_type_home")
        : item.category === "OFFICE"
        ? t("moving_type_office")
        : getServiceLabel(item.category)
      : "";

    return {
      id: item.id ?? 0,
      name: item.nickname ?? t("driver_suffix"),
      profileImage: item.profileImage ?? "/assets/image/avatartion-1.png",
      serviceType,
      driverYears: item.careerYears ?? 0,
      rating: item.rating ?? 0,
      reviewCount: item.ratingCount ?? 0,
      likeCount: item.favoriteCount ?? 0,
      confirmedCount: item.confirmedCount ?? 0,
    };
  };
  const { data, isLoading, error } = useApiQuery<
    { success: boolean; message?: string; data: ApiFavoriteDriver[] },
    Error
  >({
    queryKey: ["movers", "favorites"],
    queryFn: async () =>
      apiClient("/movers/favorites", {
        method: "GET",
      }),
    staleTime: 1000 * 30,
  });

  const favorites: FavoriteDriverView[] = Array.isArray(data?.data)
    ? data!.data.map(adaptFavorite).filter((fav) => fav.id !== 0)
    : [];

  return (
    <div className="min-h-screen bg-background-200">
      <header className="bg-white border-b border-line-100">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <h1 className="pret-2xl-semibold text-primary-black-400">
            {t("favorite_drivers_title")}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 flex flex-col gap-6">
        {isLoading && (
          <div className="text-center text-gray-400 pret-15-medium py-10">
            {t("loading")}
          </div>
        )}
        {error && (
          <div className="text-center text-secondary-red-200 pret-15-medium py-10">
            {error.message}
          </div>
        )}

        {!isLoading && !error && favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 gap-4">
            <Image
              src="/assets/image/img-empty-blue.png"
              alt={t("empty_favorite_drivers")}
              width={120}
              height={120}
              priority
            />
            <div className="text-gray-400 pret-16-medium">
              {t("empty_favorite_drivers")}
            </div>
          </div>
        )}

        {!isLoading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {favorites.map((fav) => (
              <FavoriteDriverCard
                key={fav.id}
                serviceType={fav.serviceType}
                name={fav.name}
                profileImage={fav.profileImage}
                rating={fav.rating}
                reviewCount={fav.reviewCount}
                experience={fav.driverYears}
                confirmedCount={fav.confirmedCount}
                likeCount={fav.likeCount}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
