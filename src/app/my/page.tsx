import React from 'react';

const ConfirmedQuotePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Logo and Navigation */}
          <div className="border-b px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                </div>
                <span className="text-2xl font-bold text-blue-600">무빙</span>
              </div>
              <div className="flex gap-8 text-base">
                <button className="text-gray-600 hover:text-gray-900">견적 요청</button>
                <button className="text-gray-600 hover:text-gray-900">거래내 첫기</button>
                <button className="font-bold text-gray-900">내 견적 관리</button>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <button className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm">참지니</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-8 py-10">
            <h2 className="text-2xl font-bold mb-8">견적 상세</h2>

            <div className="grid grid-cols-2 gap-16">
              {/* Left Column */}
              <div>
                {/* Status Badges */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm text-gray-600">확정 견적</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    </svg>
                    소형이사
                  </span>
                  <span className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 2v2H7v2H5v2H3v2H2v8h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h1V8h-2V6h-2V4h-2V2H9z"/>
                    </svg>
                    지정 견적 요청
                  </span>
                </div>

                <p className="text-gray-900 mb-8 text-lg">고객님의 물품을 안전하게 운송해 드립니다.</p>

                {/* Profile Section */}
                <div className="flex items-center gap-4 mb-12 pb-12 border-b">
                  <img 
                    src="https://via.placeholder.com/60" 
                    alt="Profile"
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-lg mb-1">캠프로 가자샵</div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium text-gray-900">5.0</span>
                        <span className="text-gray-400">(178)</span>
                      </span>
                      <span>견적 <span className="font-medium text-gray-900">7</span>건</span>
                      <span>고객수 <span className="font-medium text-gray-900">334</span>건 확정</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">136</span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="mb-12">
                  <h3 className="font-bold text-xl mb-6">견적가</h3>
                  <div className="text-4xl font-bold">180,000원</div>
                </div>

                {/* Quote Info Section */}
                <div>
                  <h3 className="font-bold text-xl mb-6">견적 정보</h3>
                  <div className="space-y-5">
                    <div className="flex">
                      <span className="w-32 text-gray-400">견적 요청일</span>
                      <span className="text-gray-900 font-medium">24.08.26</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-400">서비스</span>
                      <span className="text-gray-900 font-medium">사무실이사</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-400">이용일</span>
                      <span className="text-gray-900 font-medium">2024. 08. 26(월) 오전 10:00</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-400">출발지</span>
                      <span className="text-gray-900 font-medium">서울 중구 삼일대로 343</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-gray-400">도착지</span>
                      <span className="text-gray-900 font-medium">서울 강남구 선릉로 428</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Share Section */}
              <div>
                <h3 className="font-bold text-xl mb-6">견적서 공유하기</h3>
                <div className="flex gap-3">
                  <button className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  </button>
                  <button className="p-4 bg-yellow-400 rounded-full hover:bg-yellow-500 transition">
                  </button>
                  <button className="p-4 bg-blue-600 rounded-full hover:bg-blue-700 transition">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmedQuotePage;