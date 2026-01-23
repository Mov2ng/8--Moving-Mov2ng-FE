"use client";
import { useState, useCallback } from "react";

/**
 * Toast를 쉽게 사용하기 위한 커스텀 훅
 * 
 * @example
 * const { toastContent, showToast } = useToast();
 * 
 * const handleClick = () => {
 *   showToast("복사되었습니다!");
 * };
 * 
 * return <Toast content={toastContent} />;
 */
export function useToast() {
  const [toastContent, setToastContent] = useState("");

  /**
   * Toast 메시지 표시
   */
  const showToast = useCallback((message: string) => {
    // 빈 문자열로 초기화
    setToastContent("");
    
    // 다음 렌더링 사이클에서 메시지 설정
    setTimeout(() => {
      setToastContent(message);
    }, 0);
  }, []);

  /**
   * Toast 숨김 (수동으로 닫고 싶을 때)
   */
  const hideToast = useCallback(() => {
    setToastContent("");
  }, []);

  return {
    toastContent,
    showToast,
    hideToast,
  };
}

