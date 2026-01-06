"use client";


import React from "react";
import Link from "next/link";


export default function PendingDetailPage({ params }: { params: { id: string } }) {
const id = params?.id ?? "-";


return (
<div className="w-full min-h-screen bg-gray-50">
<div className="max-w-[900px] mx-auto px-6 py-8">
<div className="bg-white rounded-lg shadow-sm p-6">
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-semibold">내 견적 관리 상세 — #{id}</h3>
<Link href="/driver/pending" className="text-sm text-blue-500">목록으로</Link>
</div>


<div className="space-y-3 text-[14px] text-gray-700">
<div>고객명: 박철수</div>
<div>이사일: 2024. 08. 20(화)</div>
<div>출발: 서울시 강남구</div>
<div>도착: 경기도 용인시</div>
</div>


<div className="mt-6 flex gap-3">
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg">견적 수정</button>
<button className="px-4 py-2 border border-gray-300 rounded-lg">견적 취소</button>
</div>
</div>
</div>
</div>
);
}