import React from "react";
import StarRating from "./StarRating";

interface ReviewCardProps {
  username: string;
  date: string;
  rating: number; // 1-5
  content: string;
  isLast?: boolean;
}

export default function ReviewList({
  username,
  date,
  rating,
  content,
  isLast = false,
}: ReviewCardProps) {
  return (
    <article
      className={`
        w-full max-w-[955px] bg-white
        flex flex-col gap-6 
        py-8
        ${!isLast ? "border-b border-[#F2F2F2]" : ""}
      `}
    >
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        {/* User Info Row */}
        <div className="flex items-center gap-[14px]">
          <span className="pret-2lg-regular text-black-400">{username}</span>

          {/* Divider */}
          <div className="w-px h-[14px] bg-line-200" />

          <time className="pret-2lg-regular text-gray-300" dateTime={date}>
            {date}
          </time>
        </div>

        {/* Star Rating */}
        <StarRating rating={rating} size={20} />
      </div>

      {/* Review Content */}
      <p className="pret-2lg-regular text-[#2B2B2B] whitespace-pre-line">
        {content}
      </p>
    </article>
  );
}
