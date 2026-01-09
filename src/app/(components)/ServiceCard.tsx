import Image from "next/image";
import React from "react";

export type ServiceType = "small" | "home" | "business";

interface ServiceCardProps {
  type: ServiceType;
  className?: string;
}

const serviceData = {
  small: {
    title: "소형이사",
    subtitle: "원룸, 투룸, 20평대 미만",
    bgColor: "bg-primary-blue-100",
    illustration: "assets/image/img-landing-1.svg",
  },
  home: {
    title: "가정이사",
    subtitle: "쓰리룸, 20평대 미만",
    bgColor: "bg-gray-50",
    illustration: "assets/image/img-landing-2.svg",
  },
  business: {
    title: "기업, 사무실 이사",
    subtitle: "사무실, 상업공간",
    bgColor: "bg-gray-50",
    illustration: "assets/image/img-landing-3.svg",
  },
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  type,
  className = "",
}) => {
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
