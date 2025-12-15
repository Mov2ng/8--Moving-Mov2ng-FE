import React from 'react'
import ReviewPointBox from './ReviewPointBox'
import ReviewList, { ReviewCardList } from './ReviewList'
// ReviewCardList Component for multiple reviews
interface Review {
  id: string | number;
  username: string;
  date: string;
  rating: number;
  content: string;
}

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

export default function MoversDetailPage({ id }: { id: string }) {
  return (
    <div>
      <ReviewPointBox />
      <ReviewCardList reviews={exampleReviews} />
    </div>
  )
}
