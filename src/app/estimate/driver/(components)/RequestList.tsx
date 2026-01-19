import React from "react";
import { RequestItem, RequestCard } from "./RequestsCard";

export const RequestList: React.FC<{
  items: RequestItem[];
  onReject?: (item: RequestItem) => void;
  onSendEstimate?: (item: RequestItem) => void;
}> = ({ items, onReject, onSendEstimate }) => {
  console.log("RequestList - items:", items);
  console.log("RequestList - items.length:", items.length);
  console.log("RequestList - Array.isArray(items):", Array.isArray(items));

  if (!items || !Array.isArray(items) || items.length === 0) {
    return null; // 상위 컴포넌트에서 처리
  }

  return (
    <div className="p-5">
      <div className="mb-4 text-[14px] text-gray-700">
        전체 {items.length}건
      </div>
      <div className="space-y-4">
        {items.map((it) => {
          if (!it || !it.requestId) {
            console.warn("RequestList - invalid item:", it);
            return null;
          }
          console.log("RequestList - mapping item:", it);
          return (
            <RequestCard
              key={it.requestId}
              item={it}
              onReject={onReject}
              onSendEstimate={onSendEstimate}
            />
          );
        })}
      </div>
    </div>
  );
};