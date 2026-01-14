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

export default function ReceivedDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const requestId = Number(params.id);
  const { me, isLoading: authLoading, isDriver } = useAuth();
  const [data, setData] = useState<DriverRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const acceptEstimateMutation = useAcceptEstimate();
  const rejectEstimateMutation = useRejectEstimate();

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
        else setData(res);
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

  const handleSendEstimate = async () => {
    try {
      await acceptEstimateMutation.mutateAsync({
        userId: me?.id,
        requestId,
        price: 100000,
        requestReason: "견적 제출합니다.",
      });
      router.push("/estimate/driver/received");
    } catch (error) {
      console.error("견적 수락 실패:", error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectEstimateMutation.mutateAsync({
        userId: me?.id,
        requestId,
        requestReason: "반려합니다.",
      });
      router.push("/estimate/driver/received");
    } catch (error) {
      console.error("견적 반려 실패:", error);
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
              href="/driver/received"
              className="text-sm text-blue-500"
            >
              목록으로
            </Link>
          </div>

          <div className="space-y-3 text-[14px] text-gray-700">
            <div>고객명: {data.userId}</div>
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
    </div>
  );
}
