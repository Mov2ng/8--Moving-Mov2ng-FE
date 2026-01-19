"use client";

import Image from "next/image";
import React from "react";
import { useI18n } from "@/libs/i18n/I18nProvider";

export type ServiceType = "small" | "home" | "business";

interface ServiceCardProps {
  type: ServiceType;
  className?: string;
}

export const ServiceCard = ({
  type,
  className = "",
}: ServiceCardProps) => {
  const { t } = useI18n();

  const serviceData = {
    small: {
      title: t("service_small_title"),
      subtitle: t("service_small_subtitle"),
      bgColor: "bg-primary-blue-100",
      illustration: "assets/image/img-landing-1.svg",
    },
    home: {
      title: t("service_home_title"),
      subtitle: t("service_home_subtitle"),
      bgColor: "bg-gray-50",
      illustration: "assets/image/img-landing-2.svg",
    },
    business: {
      title: t("service_business_title"),
      subtitle: t("service_business_subtitle"),
      bgColor: "bg-gray-50",
      illustration: "assets/image/img-landing-3.svg",
    },
  };

  const { title, subtitle, bgColor } = serviceData[type];
  const Illustration = serviceData[type].illustration;

  return (
    <div
      className={`
        relative overflow-hidden rounded-4xl shadow-[4px_4px_10px_0_rgba(225,225,225,0.1)] w-full h-full 
        ${bgColor}
        ${className}
      `}
    >
      {/* Text Content */}
      <div className="mx-10 my-10 z-10">
        <h3 className="pret-2xl-semibold md:pret-xl-semibold sm:pret-2lg-semibold text-black-400 mb-2">
          {title}
        </h3>
        <p className="pret-xl-regular md:pret-lg-regular sm:pret-14-regular text-gray-400">
          {subtitle}
        </p>
      </div>

      {/* Illustration */}
      <div
        className='absolute bottom-0 right-1 max-sm:w-[55%] max-sm:h-[75%]'
      >
        <Image src={Illustration} alt={title} width={400} height={400} />
      </div>
    </div>
  );
};

export default ServiceCard;
