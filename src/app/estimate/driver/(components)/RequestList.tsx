import React from "react";
import { RequestItem, RequestCard } from "./RequestsCard";
import { useI18n } from "@/libs/i18n/I18nProvider";

export const RequestList: React.FC<{
  items: RequestItem[];
  onReject?: (item: RequestItem) => void;
  onSendEstimate?: (item: RequestItem) => void;
}> = ({ items, onReject, onSendEstimate }) => {
  const { t } = useI18n();
  
  console.log("RequestList - items:", items);
  console.log("RequestList - items.length:", items.length);
  console.log("RequestList - Array.isArray(items):", Array.isArray(items));

  if (!items || !Array.isArray(items) || items.length === 0) {
    return null; // 상위 컴포넌트에서 처리
  }

  return (
    <div className="p-5">
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