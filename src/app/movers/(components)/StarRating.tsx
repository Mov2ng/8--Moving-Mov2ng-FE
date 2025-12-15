import Image from "next/image";
import React from "react";

export default function StarRating({ rating, size = 20 }: { rating: number, size?: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon key={index} size={size} filled={index < rating} />
      ))}
    </div>
  );
}

const StarIcon = ({
  size = 20,
  filled = true,
}: {
  size?: number;
  filled?: boolean;
}) => (
  <Image
    src={
      filled
        ? "/assets/icon/ic-star-active.svg"
        : "/assets/icon/ic-star-default.svg"
    }
    alt="star"
    width={size}
    height={size}
  />
);
