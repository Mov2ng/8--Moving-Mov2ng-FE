"use client";

import React from "react";

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-[#F7F7F7] flex flex-col items-center py-10">
      {/* Header */}
      <header className="w-full max-w-[1200px] h-16 bg-white shadow-sm flex items-center px-6 rounded-xl">
        <div className="text-[22px] font-bold text-[#1B92FF]">무빙</div>
        <div className="ml-10 flex gap-6 text-[16px]">
          <div className="font-semibold">받은 요청</div>
          <div className="text-gray-500">내 견적 관리</div>
        </div>
        <div className="ml-auto flex items-center gap-4 text-gray-600">
          <div className="w-6 h-6 bg-gray-300 rounded-full" />
          <div>김다라</div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="w-full max-w-[1200px] mt-10 flex gap-10">
        {/* Left Sidebar */}
        <aside className="w-[220px] bg-white rounded-xl shadow-sm p-6">
          <div className="font-semibold mb-4">이사 유형</div>
          <ul className="text-[14px] flex flex-col gap-3">
            <li className="flex justify-between">
              <span>소형이사</span>
              <span className="text-[#1B92FF] font-medium">10</span>
            </li>
            <li className="flex justify-between">
              <span>가정이사</span>
              <span className="text-[#1B92FF] font-medium">2</span>
            </li>
            <li className="flex justify-between">
              <span>사무실이사</span>
              <span className="text-[#1B92FF] font-medium">8</span>
            </li>
          </ul>

          <div className="h-[1px] bg-gray-200 my-6" />

          <div className="font-semibold mb-4">필터</div>
          <ul className="text-[14px] flex flex-col gap-3">
            <li className="flex justify-between">
              <span>서비스 가능 지역</span>
              <span className="text-[#1B92FF] font-medium">10</span>
            </li>
            <li className="flex justify-between">
              <span>지정 견적 요청</span>
              <span className="text-[#1B92FF] font-medium">10</span>
            </li>
          </ul>
        </aside>

        {/* Content Section */}
        <section className="flex-1">
          <div className="bg-white w-full rounded-xl shadow-sm p-6">
            {/* Search Bar */}
            <div className="w-full mb-6">
              <input
                type="text"
                placeholder="어떤 고객님을 찾고 계세요?"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            {/* Request Cards (2 examples) */}
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-5 mb-6"
              >
                {/* Tag */}
                <div className="flex items-center gap-2 mb-3 text-[12px]">
                  <span className="px-2 py-1 bg-[#1B92FF]/10 text-[#1B92FF] rounded-md font-medium">
                    소형이사
                  </span>
                  <span className="px-2 py-1 bg-[#FF7A7A]/10 text-[#FF5A5A] rounded-md font-medium">
                    지정 견적 요청
                  </span>
                </div>

                {/* Customer Name */}
                <div className="text-[16px] font-semibold mb-3">김연서 고객님</div>

                {/* Info Row */}
                <div className="flex flex-wrap gap-2 text-[14px] text-gray-600 mb-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-md">이사일 2024.07.01</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-md">출발 서울시 중구</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-md">도착 경기도 수원시</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 h-12 bg-[#1B92FF] text-white rounded-lg font-semibold text-[14px]">
                    견적 보내기 ✎
                  </button>
                  <button className="flex-1 h-12 border border-[#1B92FF] text-[#1B92FF] rounded-lg font-semibold text-[14px] bg-white">
                    반려
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
