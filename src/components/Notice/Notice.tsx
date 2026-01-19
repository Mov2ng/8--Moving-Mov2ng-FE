"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { noticeService } from "@/services/noticeService";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import type { Notice } from "@/types/api/notice";

interface NoticeProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 알림 내용에서 특정 키워드를 하이라이트하는 함수
 * 이미지에서 보면 "소형이사 견적", "견적", "경기(일산)", "서울(영등포)" 등이 파란색으로 하이라이트됨
 */
function highlightKeywords(text: string): React.ReactNode {
  // 하이라이트할 키워드 패턴들
  const patterns = [
    /소형이사\s*견적/g,
    /견적/g,
    /경기\([^)]+\)/g,
    /서울\([^)]+\)/g,
    /[가-힣]+\([^)]+\)/g, // 일반적인 지역명(괄호) 패턴
  ];

  let parts: Array<{ text: string; highlight: boolean }> = [{ text, highlight: false }];

  patterns.forEach((pattern) => {
    const newParts: Array<{ text: string; highlight: boolean }> = [];
    parts.forEach((part) => {
      if (part.highlight) {
        newParts.push(part);
        return;
      }

      const matches = Array.from(part.text.matchAll(new RegExp(pattern.source, "g")));
      if (matches.length === 0) {
        newParts.push(part);
        return;
      }

      let lastIndex = 0;
      matches.forEach((match) => {
        if (match.index !== undefined) {
          // 매치 전 텍스트
          if (match.index > lastIndex) {
            newParts.push({
              text: part.text.slice(lastIndex, match.index),
              highlight: false,
            });
          }
          // 매치된 텍스트 (하이라이트)
          newParts.push({
            text: match[0],
            highlight: true,
          });
          lastIndex = match.index + match[0].length;
        }
      });
      // 남은 텍스트
      if (lastIndex < part.text.length) {
        newParts.push({
          text: part.text.slice(lastIndex),
          highlight: false,
        });
      }
    });
    parts = newParts;
  });

  return (
    <>
      {parts.map((part, index) =>
        part.highlight ? (
          <span key={index} className="text-primary-blue-300 font-semibold">
            {part.text}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </>
  );
}

export default function Notice({ isOpen, onClose }: NoticeProps) {
  const { me, role } = useAuth();
  const [page] = useState(1);
  const pageSize = 10;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [readNoticeIds, setReadNoticeIds] = useState<Set<string>>(new Set());
  const [deletedNoticeIds, setDeletedNoticeIds] = useState<Set<string>>(new Set());

  // role에 따라 알림 조회 (USER면 유저 알림, DRIVER면 기사 알림)
  const { data: noticesData, refetch } = useApiQuery({
    queryKey: ["notices", role, me?.id, page, pageSize],
    queryFn: () => {
      if (role === "USER" && me?.id) {
        return noticeService.getUserNotices({ userId: me.id, page, pageSize });
      } else if (role === "DRIVER" && me?.id) {
        return noticeService.getDriverNotices({ userId: me.id, page, pageSize });
      }
      return Promise.resolve({ data: { items: [], page: 0, pageSize: 0, totalItems: 0, totalPages: 0 } });
    },
    enabled: isOpen && (role === "USER" || role === "DRIVER") && !!me?.id,
  });

  // 알림 읽음 처리 mutation
  const readNoticeMutation = useApiMutation({
    mutationFn: (noticeId: number) => noticeService.readNotice(noticeId),
    onSuccess: () => {
      refetch();
    },
  });

  // 알림 삭제 mutation
  const deleteNoticeMutation = useApiMutation({
    mutationFn: (noticeId: number) => noticeService.deleteNotice(noticeId),
    onSuccess: () => {
      // API 성공 후 refetch (로컬 상태는 이미 업데이트됨)
      refetch();
    },
  });

  // 알림 클릭 시 읽음 처리
  const handleNoticeClick = (notice: Notice) => {
    const noticeId = parseInt(notice.noticeId, 10);
    if (!isNaN(noticeId) && !notice.isRead && !readNoticeIds.has(notice.noticeId)) {
      // 즉시 UI에 반영 (낙관적 업데이트)
      setReadNoticeIds((prev) => new Set(prev).add(notice.noticeId));
      // API 호출
      readNoticeMutation.mutate(noticeId);
    }
  };

  // 알림 삭제 처리
  const handleDeleteNotice = (
    e: React.MouseEvent,
    notice: Notice
  ) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    e.preventDefault(); // 기본 동작 방지
    const noticeId = parseInt(notice.noticeId, 10);
    if (!isNaN(noticeId)) {
      // 즉시 UI에서 제거 (낙관적 업데이트)
      setDeletedNoticeIds((prev) => new Set(prev).add(notice.noticeId));
      // API 호출
      deleteNoticeMutation.mutate(noticeId);
    }
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // 삭제 버튼 클릭은 무시
      if (
        target instanceof Element &&
        (target.closest('button[aria-label="알림 삭제"]') ||
          target.closest('img[alt="삭제"]'))
      ) {
        return;
      }
      
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const notices = noticesData?.data?.items || [];
  
  // 삭제된 알림 필터링
  const visibleNotices = notices.filter(
    (notice) => !deletedNoticeIds.has(notice.noticeId)
  );

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-[400px] bg-gray-50 rounded-2xl border border-line-100 shadow-[4px_4px_10px_0_rgba(224,224,224,0.25)] z-50"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-line-100">
        <h2 className="pret-2xl-semibold text-black-400">알림</h2>
        <button
          onClick={onClose}
          className="cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="닫기"
        >
          <Image
            src="/assets/icon/ic-cancel.svg"
            alt="닫기"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* 알림 목록 */}
      <div className="max-h-[500px] overflow-y-auto">
        {visibleNotices.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="pret-lg-regular text-gray-400">알림이 없습니다</p>
          </div>
        ) : (
          <ul className="flex flex-col">
            {visibleNotices.map((notice: Notice, index: number) => {
              const isRead = notice.isRead || readNoticeIds.has(notice.noticeId);
              return (
                <li
                  key={notice.noticeId}
                  className={`px-6 py-4 cursor-pointer hover:bg-primary-blue-50 transition-colors relative ${
                    index !== visibleNotices.length - 1 ? "border-b border-line-100" : ""
                  }`}
                  onClick={() => handleNoticeClick(notice)}
                >
                  <div className="flex flex-col gap-2">
                    {/* 알림 내용 */}
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`pret-lg-regular flex-1 ${
                          isRead ? "text-gray-400" : "text-black-400"
                        }`}
                      >
                        {highlightKeywords(notice.content)}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isRead && (
                          <span className="text-[12px] text-gray-400">읽음</span>
                        )}
                        <button
                          onClick={(e) => handleDeleteNotice(e, notice)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="알림 삭제"
                          title="알림 삭제"
                        >
                          <Image
                            src="/assets/icon/ic-cancel.svg"
                            alt="삭제"
                            width={16}
                            height={16}
                          />
                        </button>
                      </div>
                    </div>
                    {/* 시간 */}
                    <p className="pret-14-medium text-gray-400">
                      {formatRelativeTime(notice.noticeDate)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

