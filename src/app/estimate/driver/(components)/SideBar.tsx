import React from "react";


export const Sidebar: React.FC = () => {
return (
<aside className="w-[240px] flex-shrink-0">
<div className="bg-white rounded-lg shadow-sm p-5">
<h3 className="text-[15px] font-semibold text-gray-900 mb-4">이사 유형</h3>
<ul className="space-y-3">
<li className="flex items-center gap-2">
<input type="checkbox" id="small" defaultChecked className="w-4 h-4 text-blue-500 rounded" />
<label htmlFor="small" className="text-[14px] text-gray-700 flex-1">
소형이사
</label>
<span className="text-[13px] text-blue-500 font-medium">(10)</span>
</li>
<li className="flex items-center gap-2">
<input type="checkbox" id="home" defaultChecked className="w-4 h-4 text-blue-500 rounded" />
<label htmlFor="home" className="text-[14px] text-gray-700 flex-1">
가정이사
</label>
<span className="text-[13px] text-blue-500 font-medium">(2)</span>
</li>
<li className="flex items-center gap-2">
<input type="checkbox" id="office" className="w-4 h-4 text-blue-500 rounded" />
<label htmlFor="office" className="text-[14px] text-gray-700 flex-1">
사무실이사
</label>
<span className="text-[13px] text-blue-500 font-medium">(8)</span>
</li>
</ul>


<div className="h-px bg-gray-200 my-5" />


<h3 className="text-[15px] font-semibold text-gray-900 mb-4">필터</h3>
<ul className="space-y-3">
<li className="flex items-center gap-2">
<input type="checkbox" id="area" defaultChecked className="w-4 h-4 text-blue-500 rounded" />
<label htmlFor="area" className="text-[14px] text-gray-700 flex-1">
서비스 가능 지역
</label>
<span className="text-[13px] text-blue-500 font-medium">(10)</span>
</li>
<li className="flex items-center gap-2">
<input type="checkbox" id="designated" defaultChecked className="w-4 h-4 text-blue-500 rounded" />
<label htmlFor="designated" className="text-[14px] text-gray-700 flex-1">
지정 견적 요청
</label>
<span className="text-[13px] text-blue-500 font-medium">(10)</span>
</li>
</ul>
</div>
</aside>
);
};