"use client";


import React from "react";
import { Sidebar } from "../(components)/SideBar";
import { SearchBar } from "../(components)/SearchBar";
import { RequestList } from "../(components)/RequestList";
import type { RequestItem } from "../(components)/RequestsCard";


export default function PendingPage() {
const SAMPLE_PENDING: RequestItem[] = [
{
id: 11,
name: "박철수",
moveType: "가정이사",
tags: ["지정 견적 요청"],
timeAgo: "하루 전",
date: "2024. 08. 20(화)",
from: "서울시 강남구",
to: "경기도 용인시",
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
<RequestList items={SAMPLE_PENDING} />
</div>
</main>
</div>
</div>
</div>
);
}