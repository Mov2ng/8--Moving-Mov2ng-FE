"use client";


import React from "react";
import { Sidebar } from "../(components)/SideBar";
import { SearchBar } from "../(components)/SearchBar";
import { RequestList } from "../(components)/RequestList";
import type { RequestItem } from "../(components)/RequestsCard";


export default function ReceivedPage() {
const SAMPLE_REQUESTS: RequestItem[] = [
{
id: 1,
name: "김연서",
moveType: "소형이사",
tags: ["지정 견적 요청"],
timeAgo: "1시간 전",
date: "2024. 07. 01(월)",
from: "인천시 남동구",
to: "경기도 수원시",
},
{
id: 2,
name: "김연서",
moveType: "소형이사",
tags: ["지정 견적 요청"],
timeAgo: "2시간 전",
date: "2024. 07. 01(월)",
from: "인천시 남동구",
to: "경기도 수원시",
},
];


return (
<div className="w-full min-h-screen bg-gray-50">


<div className="max-w-[1400px] mx-auto px-6 py-8">
<div className="flex gap-6">
<Sidebar />


<main className="flex-1">
<div className="bg-white rounded-lg shadow-sm">
<SearchBar />
<RequestList items={SAMPLE_REQUESTS} />
</div>
</main>
</div>
</div>
</div>
);
}