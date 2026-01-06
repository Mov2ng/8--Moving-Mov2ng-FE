import React from "react";
import Link from "next/link";


export interface RequestItem {
id: number;
name: string;
moveType: string;
tags?: string[];
timeAgo: string;
date: string;
from: string;
to: string;
}


export const RequestCard: React.FC<{ item: RequestItem }> = ({ item }) => {
return (
<div className="border border-gray-200 rounded-lg p-5">
<div className="flex items-start justify-between mb-3">
<div className="flex items-center gap-2">
<span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[12px] font-medium rounded">{item.moveType}</span>
{item.tags?.map((t) => (
<span key={t} className="px-2.5 py-1 bg-red-50 text-red-500 text-[12px] font-medium rounded">
{t}
</span>
))}
</div>
<span className="text-[13px] text-gray-400">{item.timeAgo}</span>
</div>


<h4 className="text-[16px] font-semibold text-gray-900 mb-4">{item.name} 고객님</h4>


<div className="space-y-2 mb-4">
<div className="flex items-center gap-2 text-[14px]">
<span className="text-gray-500 w-12">이사일</span>
<span className="text-gray-900">{item.date}</span>
</div>
<div className="flex items-center gap-2 text-[14px]">
<span className="text-gray-500 w-12">출발</span>
<span className="text-gray-900">{item.from}</span>
</div>
<div className="flex items-center gap-2 text-[14px]">
<span className="text-gray-500 w-12">도착</span>
<span className="text-gray-900">{item.to}</span>
</div>
</div>


<div className="flex gap-3">
<Link href={`/driver/received/${item.id}`} className="flex-1 h-11 bg-blue-500 text-white rounded-lg font-semibold text-[14px] hover:bg-blue-600 flex items-center justify-center gap-1">
견적 보내기 ✎
</Link>
<button className="flex-1 h-11 border border-blue-500 text-blue-500 rounded-lg font-semibold text-[14px] hover:bg-blue-50">반려</button>
</div>
</div>
);
};