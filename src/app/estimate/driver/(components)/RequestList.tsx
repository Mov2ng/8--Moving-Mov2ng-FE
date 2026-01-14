import React from "react";
import { RequestItem, RequestCard } from "./RequestsCard";

export const RequestList: React.FC<{
  items: RequestItem[];
  onReject?: (requestId: number) => void;
}> = ({ items, onReject }) => {
  return (
    <div className="p-5 space-y-4">
      {items.map((it) => (
        <RequestCard key={it.requestId} item={it} onReject={onReject} />
      ))}
    </div>
  );
};