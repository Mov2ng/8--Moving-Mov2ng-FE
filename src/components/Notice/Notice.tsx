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
  const { isUser, isDriver } = useAuth();
  const [page] = useState(1);
  const pageSize = 10;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 사용자/기사 구분하여 알림 조회
  const { data: noticesData, refetch } = useApiQuery({
    queryKey: ["notices", isUser ? "user" : "driver", page, pageSize],
    queryFn: () => {
      if (isUser) {
        return noticeService.getUserNotices({ page, pageSize });
      } else if (isDriver) {
        return noticeService.getDriverNotices({ page, pageSize });
      }
      return Promise.resolve({ data: { items: [], page: 0, pageSize: 0, totalItems: 0, totalPages: 0 } });
    },
    enabled: isOpen && (isUser || isDriver),
  });

  // 알림 읽음 처리 mutation
  const readNoticeMutation = useApiMutation({
    mutationFn: (noticeId: number) => noticeService.readNotice(noticeId),
    onSuccess: () => {
      refetch();
    },
  });

  // 알림 클릭 시 읽음 처리
  const handleNoticeClick = (notice: Notice) => {
    const noticeId = parseInt(notice.noticeId, 10);
    if (!isNaN(noticeId)) {
      readNoticeMutation.mutate(noticeId);
    }
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        {notices.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="pret-lg-regular text-gray-400">알림이 없습니다</p>
          </div>
        ) : (
          <ul className="flex flex-col">
            {notices.map((notice: Notice, index: number) => (
              <li
                key={notice.noticeId}
                className={`px-6 py-4 cursor-pointer hover:bg-primary-blue-50 transition-colors ${
                  index !== notices.length - 1 ? "border-b border-line-100" : ""
                }`}
                onClick={() => handleNoticeClick(notice)}
              >
                <div className="flex flex-col gap-2">
                  {/* 알림 내용 */}
                  <p className="pret-lg-regular text-black-400">
                    {highlightKeywords(notice.content)}
                  </p>
                  {/* 시간 */}
                  <p className="pret-14-medium text-gray-400">
                    {formatRelativeTime(notice.noticeDate)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

