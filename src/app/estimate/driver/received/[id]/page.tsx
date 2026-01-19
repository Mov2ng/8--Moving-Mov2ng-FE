"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { driverRequestService } from "@/services/driverRequestService";
import {
  useAcceptEstimate,
  useRejectEstimate,
} from "@/hooks/useDriverRequest";
import { useAuth } from "@/hooks/useAuth";
import type { DriverRequestDetail } from "@/types/api/driverRequest";
import SendEstimateModal from "@/app/estimate/driver/(components)/SendEstimateModal";
import RejectEstimateModal from "@/app/estimate/driver/(components)/RejectEstimateModal";
import { parseServerError } from "@/utils/parseServerError";

export default function ReceivedDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const requestId = Number(params.id);
  const { me, isLoading: authLoading, isDriver } = useAuth();
  const [data, setData] = useState<DriverRequestDetail | null>(null);
  const [isDesignated, setIsDesignated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const acceptEstimateMutation = useAcceptEstimate();
  const rejectEstimateMutation = useRejectEstimate();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (Number.isNaN(requestId) || !me?.id) {
        setError("유효하지 않은 요청 ID 또는 로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const res = await driverRequestService.getDriverRequestById({
          userId: me.id,
          requestId,
        });
        if (!mounted) return;

        if (!res) setError("요청을 찾을 수 없습니다.");
        else {
          setData(res);
          setIsDesignated((res as DriverRequestDetail & { isDesignated?: boolean }).isDesignated ?? false);
        }
      } catch (e) {
        console.error(e);
        setError("데이터 로드 실패");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (!authLoading && me && isDriver) {
      load();
    } else if (!authLoading && me && !isDriver) {
      setError("기사님만 접근 가능한 페이지입니다.");
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [requestId, me, authLoading, isDriver]);

  const handleSendEstimate = () => {
    setIsSendModalOpen(true);
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const handleSendEstimateSubmit = async (payload: {
    price: number;
    requestReason: string;
  }) => {
    try {
      await acceptEstimateMutation.mutateAsync({
        userId: me?.id,
        requestId,
        price: payload.price,
        requestReason: payload.requestReason,
      });
      setIsSendModalOpen(false);
      router.push("/estimate/driver/received");
    } catch (error) {
      console.error("견적 수락 실패:", error);
      
      // 에러 메시지 추출
      const parsedError = parseServerError(error);
      let errorMessage = parsedError?.message || "견적 보내기에 실패했습니다. 다시 시도해주세요.";
      
      // 한국어 메시지로 변환
      if (errorMessage.includes("Estimate already decided")) {
        errorMessage = "이미 처리된 견적 요청입니다.";
      } else if (errorMessage.includes("already decided")) {
        errorMessage = "이미 결정된 견적입니다.";
      }
      
      alert(errorMessage);
    }
  };

  const handleRejectSubmit = async (payload: { requestReason: string }) => {
    try {
      await rejectEstimateMutation.mutateAsync({
        userId: me?.id,
        requestId,
        requestReason: payload.requestReason,
      });
      setIsRejectModalOpen(false);
      router.push("/estimate/driver/received");
    } catch (error) {
      console.error("견적 반려 실패:", error);
      
      // 에러 메시지 추출
      const parsedError = parseServerError(error);
      let errorMessage = parsedError?.message || "반려 처리에 실패했습니다. 다시 시도해주세요.";
      
      // 한국어 메시지로 변환
      if (errorMessage.includes("Estimate already decided")) {
        errorMessage = "이미 처리된 견적 요청입니다.";
      } else if (errorMessage.includes("already decided")) {
        errorMessage = "이미 결정된 견적입니다.";
      }
      
      alert(errorMessage);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div>로그인이 필요합니다.</div>
      </div>
    );
  }

  if (!isDriver) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div>기사님만 접근 가능한 페이지입니다.</div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-500">에러: {error}</div>;
  if (!data) return <div className="p-6">데이터 없음</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              견적 요청 상세 — #{data.requestId}
            </h3>
            <Link
              href="/estimate/driver/received"
              className="text-sm text-blue-500"
            >
              목록으로
            </Link>
          </div>

          <div className="space-y-3 text-[14px] text-gray-700">
            <div>고객명: {data.userName}</div>
            <div>
              이사일: {new Date(data.movingDate).toLocaleString()}
            </div>
            <div>출발: {data.origin}</div>
            <div>도착: {data.destination}</div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSendEstimate}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              견적 보내기 ✎
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              반려
            </button>
          </div>
        </div>
      </div>

      {/* 견적 보내기 모달 */}
      <SendEstimateModal
        open={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        data={data}
        onSubmit={handleSendEstimateSubmit}
        isSubmitting={acceptEstimateMutation.isPending}
        isDesignated={isDesignated}
      />

      {/* 반려 모달 */}
      <RejectEstimateModal
        open={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        data={data}
        onSubmit={handleRejectSubmit}
        isSubmitting={rejectEstimateMutation.isPending}
        isDesignated={isDesignated}
      />
    </div>
  );
}
