import { Suspense } from "react";
import PendingContainer from "./PendingContainer";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function PendingPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
      }
    >
      <PendingContainer />
    </Suspense>
  );
}
