"use client";

import React, { useState } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("received");
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">무빙</span>
              </div>
              <span className="text-xl font-bold text-gray-900">무빙</span>
            </div>
            <nav className="flex gap-6">
              <button
                className={`text-[15px] font-semibold pb-1 ${
                  activeTab === "received"
                    ? "text-gray-900 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("received")}
              >
                받은 요청
              </button>
              <button
                className={`text-[15px] ${
                  activeTab === "manage"
                    ? "text-gray-900 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("manage")}
              >
                내 견적 관리
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-700">김다라</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="w-[240px] flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">
                이사 유형
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="small"
                    defaultChecked
                    className="w-4 h-4 text-blue-500 rounded"
                  />
                  <label htmlFor="small" className="text-[14px] text-gray-700 flex-1">
                    소형이사
                  </label>
                  <span className="text-[13px] text-blue-500 font-medium">(10)</span>
                </li>
                <li className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="home"
                    defaultChecked
                    className="w-4 h-4 text-blue-500 rounded"
                  />
                  <label htmlFor="home" className="text-[14px] text-gray-700 flex-1">
                    가정이사
                  </label>
                  <span className="text-[13px] text-blue-500 font-medium">(2)</span>
                </li>
                <li className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="office"
                    className="w-4 h-4 text-blue-500 rounded"
                  />
                  <label htmlFor="office" className="text-[14px] text-gray-700 flex-1">
                    사무실이사
                  </label>
                  <span className="text-[13px] text-blue-500 font-medium">(8)</span>
                </li>
              </ul>

              <div className="h-px bg-gray-200 my-5" />

              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">
                필터
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="area"
                    defaultChecked
                    className="w-4 h-4 text-blue-500 rounded"
                  />
                  <label htmlFor="area" className="text-[14px] text-gray-700 flex-1">
                    서비스 가능 지역
                  </label>
                  <span className="text-[13px] text-blue-500 font-medium">(10)</span>
                </li>
                <li className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="designated"
                    defaultChecked
                    className="w-4 h-4 text-blue-500 rounded"
                  />
                  <label htmlFor="designated" className="text-[14px] text-gray-700 flex-1">
                    지정 견적 요청
                  </label>
                  <span className="text-[13px] text-blue-500 font-medium">(10)</span>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Search and Filter Bar */}
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="어떤 고객님을 찾고 계세요?"
                      className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button className="px-4 h-10 text-[14px] text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    견적 현황 <span className="text-blue-500">▼</span>
                  </button>
                  <button className="px-4 h-10 text-[14px] text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    최신 제출순 <span className="text-blue-500">▼</span>
                  </button>
                </div>
              </div>

              {/* Request Cards */}
              <div className="p-5 space-y-4">
                {/* Card 1 */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[12px] font-medium rounded">
                        소형이사
                      </span>
                      <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[12px] font-medium rounded">
                        지정 견적 요청
                      </span>
                    </div>
                    <span className="text-[13px] text-gray-400">1시간 전</span>
                  </div>

                  <h4 className="text-[16px] font-semibold text-gray-900 mb-4">
                    김연서 고객님
                  </h4>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-[14px]">
                      <span className="text-gray-500 w-12">이사일</span>
                      <span className="text-gray-900">2024. 07. 01(월)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px]">
                      <span className="text-gray-500 w-12">출발</span>
                      <span className="text-gray-900">인천시 남동구</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px]">
                      <span className="text-gray-500 w-12">도착</span>
                      <span className="text-gray-900">경기도 수원시</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 h-11 bg-blue-500 text-white rounded-lg font-semibold text-[14px] hover:bg-blue-600 flex items-center justify-center gap-1">
                      견적 보내기 ✎
                    </button>
                    <button className="flex-1 h-11 border border-blue-500 text-blue-500 rounded-lg font-semibold text-[14px] hover:bg-blue-50">
                      반려
                    </button>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[12px] font-medium rounded">
                        소형이사
                      </span>
                      <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[12px] font-medium rounded">
                        지정 견적 요청
                      </span>
                    </div>
                    <span className="text-[13px] text-gray-400">2시간 전</span>
                  </div>

                  <h4 className="text-[16px] font-semibold text-gray-900 mb-4">
                    김연서 고객님
                  </h4>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-[14px]">
                      <span className="text-gray-500 w-12">이사일</span>
                      <span className="text-gray-900">2024. 07. 01(월)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px]">
                      <span className="text-gray-500 w-12">출발</span>
                      <span className="text-gray-900">인천시 남동구</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px]">
                      <span className="text-gray-500 w-12">도착</span>
                      <span className="text-gray-900">경기도 수원시</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 h-11 bg-blue-500 text-white rounded-lg font-semibold text-[14px] hover:bg-blue-600 flex items-center justify-center gap-1">
                      견적 보내기 ✎
                    </button>
                    <button className="flex-1 h-11 border border-blue-500 text-blue-500 rounded-lg font-semibold text-[14px] hover:bg-blue-50">
                      반려
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}