"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { driverRequestService } from "@/services/driverRequestService";
import {
  useAcceptEstimate,
  useUpdateEstimate,
  useDeleteRequest,
} from "@/hooks/useDriverRequest";
import { useAuth } from "@/hooks/useAuth";
import type { DriverRequestDetail } from "@/types/api/driverRequest";
import { formatDateLabel } from "@/utils/date";
import { useQueryClient } from "@tanstack/react-query";

export default function PendingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const requestId = Number(params.id);
  const { me, isLoading: authLoading, isDriver } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [data, setData] = useState<DriverRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [requestReason, setRequestReason] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const acceptEstimateMutation = useAcceptEstimate();
  const updateEstimateMutation = useUpdateEstimate();
  const deleteRequestMutation = useDeleteRequest();

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

        if (!res) {
          setError("요청을 찾을 수 없습니다.");
        } else {
          setData(res);
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

  const handleSendEstimate = async () => {
    if (!price || price <= 0) {
      alert("견적 금액을 입력해주세요.");
      return;
    }

    try {
      await acceptEstimateMutation.mutateAsync({
        userId: me?.id,
        requestId,
        price,
        requestReason: requestReason || "견적 제출합니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["driverRequests"] });
      alert("견적이 제출되었습니다.");
      router.push("/estimate/driver/pending");
    } catch (error) {
      console.error("견적 수락 실패:", error);
      alert("견적 제출 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateEstimate = async () => {
    if (!price || price <= 0) {
      alert("견적 금액을 입력해주세요.");
      return;
    }

    try {
      await updateEstimateMutation.mutateAsync({
        userId: me?.id,
        requestId,
        status: "ACCEPTED",
        price,
        requestReason: requestReason || "견적 수정합니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["driverRequests"] });
      alert("견적이 수정되었습니다.");
      setIsEditing(false);
      router.push("/estimate/driver/pending");
    } catch (error) {
      console.error("견적 수정 실패:", error);
      alert("견적 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = async () => {
    if (!confirm("정말 취소하시겠습니까?")) return;

    try {
      await deleteRequestMutation.mutateAsync({
        userId: me?.id,
        requestId,
      });
      queryClient.invalidateQueries({ queryKey: ["driverRequests"] });
      alert("요청이 취소되었습니다.");
      router.push("/estimate/driver/pending");
    } catch (error) {
      console.error("요청 취소 실패:", error);
      alert("요청 취소 중 오류가 발생했습니다.");
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

  if (error || !data) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="max-w-[900px] mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-red-500">에러: {error || "데이터 없음"}</div>
            <Link
              href="/estimate/driver/pending"
              className="mt-4 inline-block text-sm text-blue-500"
            >
              목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              내 견적 관리 상세 — #{data.requestId}
            </h3>
            <Link
              href="/estimate/driver/pending"
              className="text-sm text-blue-500"
            >
              목록으로
            </Link>
          </div>

          <div className="space-y-3 text-[14px] text-gray-700 mb-6">
            <div>고객명: {data.userId}</div>
            <div>
              이사일: {data.movingDate ? formatDateLabel(data.movingDate) : "-"}
            </div>
            <div>출발: {data.origin}</div>
            <div>도착: {data.destination}</div>
          </div>

          {isEditing ? (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  견적 금액 (원)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:border-blue-500"
                  placeholder="견적 금액을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사유
                </label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:border-blue-500"
                  placeholder="견적 사유를 입력하세요"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateEstimate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  수정 완료
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  견적 금액 (원)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:border-blue-500"
                  placeholder="견적 금액을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사유
                </label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:border-blue-500"
                  placeholder="견적 사유를 입력하세요"
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {isEditing ? null : (
              <>
                <button
                  onClick={handleSendEstimate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  견적 보내기 ✎
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                >
                  견적 수정
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  견적 취소
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
