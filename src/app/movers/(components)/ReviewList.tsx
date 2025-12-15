// import React from 'react'

// export default function ReviewList() {
//   return (
//     <div>

//     </div>
//   );
// }

import React from 'react';

interface ReviewCardProps {
  username: string;
  date: string;
  rating: number; // 1-5
  content: string;
  isLast?: boolean;
}

// Star Icon Component
const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg 
    className="w-5 h-5" 
    viewBox="0 0 20 20" 
    fill={filled ? '#FFC149' : '#E6E6E6'} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 2L12.09 7.26L17.82 7.64L13.46 11.38L14.82 17L10 14.04L5.18 17L6.54 11.38L2.18 7.64L7.91 7.26L10 2Z" />
  </svg>
);

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5" role="img" aria-label={`별점 ${rating}점`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <StarIcon key={star} filled={star <= rating} />
    ))}
  </div>
);

// Main ReviewCard Component
export const ReviewCard: React.FC<ReviewCardProps> = ({
  username,
  date,
  rating,
  content,
  isLast = false,
}) => {
  return (
    <article 
      className={`
        w-full max-w-[955px] bg-white
        flex flex-col gap-6 
        py-8 px-8
        ${!isLast ? 'border-b border-[#F2F2F2]' : ''}
      `}
    >
      {/* Header Section */}
      <header className="flex flex-col gap-2">
        {/* User Info Row */}
        <div className="flex items-center gap-[14px]">
          <span className="text-lg font-normal text-[#1F1F1F]">
            {username}
          </span>
          
          {/* Divider */}
          <div className="w-px h-[14px] bg-[#E6E6E6]" />
          
          <time 
            className="text-lg font-normal text-[#ABABAB]" 
            dateTime={date}
          >
            {date}
          </time>
        </div>
        
        {/* Star Rating */}
        <StarRating rating={rating} />
      </header>
      
      {/* Review Content */}
      <p className="text-lg font-normal text-[#2B2B2B] leading-[1.44] whitespace-pre-line">
        {content}
      </p>
    </article>
  );
};

// ReviewCardList Component for multiple reviews
interface Review {
  id: string | number;
  username: string;
  date: string;
  rating: number;
  content: string;
}

interface ReviewCardListProps {
  reviews: Review[];
}

export const ReviewCardList: React.FC<ReviewCardListProps> = ({ reviews }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {reviews.map((review, index) => (
        <ReviewCard
          key={review.id}
          username={review.username}
          date={review.date}
          rating={review.rating}
          content={review.content}
          isLast={index === reviews.length - 1}
        />
      ))}
    </div>
  );
};

// Example usage data
export const exampleReviews: Review[] = [
  {
    id: 1,
    username: 'kim****',
    date: '2024-07-01',
    rating: 5,
    content: `듣던대로 정말 친절하시고 물건도 잘 옮겨주셨어요~~
나중에 또 짐 옮길 일 있으면 김코드 기사님께 부탁드릴 예정입니다!!
비 오는데 꼼꼼히 잘 해주셔서 감사드립니다 :)`,
  },
  {
    id: 2,
    username: 'park***',
    date: '2024-06-28',
    rating: 4,
    content: `시간 약속 잘 지켜주시고, 물건도 소중하게 다뤄주셨습니다.
전반적으로 만족스러운 서비스였어요!`,
  },
  {
    id: 3,
    username: 'lee****',
    date: '2024-06-15',
    rating: 5,
    content: `이사 전문 업체답게 정말 프로페셔널하게 작업해주셨습니다.
무거운 가구도 안전하게 옮겨주시고, 벽이나 바닥에 흠집 하나 없이 완벽하게 마무리해주셨어요.
다음에도 꼭 이용할게요! 강력 추천합니다 👍`,
  },
];

export default ReviewCard;
