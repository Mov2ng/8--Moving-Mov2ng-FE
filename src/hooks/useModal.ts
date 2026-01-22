"use client";
import { useState, useCallback } from "react";

interface ModalState {
  title: string;
  content: string;
  buttonText: string;
  isOpen: boolean;
  buttonClick: () => void;
}

/**
 * Modal을 쉽게 사용하기 위한 커스텀 훅
 * 
 * @example
 * const { modalState, showModal, closeModal } = useModal();
 * 
 * const handleClick = () => {
 *   showModal({
 *     title: "확인",
 *     content: "정말 삭제하시겠습니까?",
 *     buttonText: "삭제",
 *     buttonClick: () => {
 *       // 삭제 로직
 *       closeModal();
 *     }
 *   });
 * };
 * 
 * return <Modal ModalState={modalState} setIsOpen={setModalState} />;
 */
export function useModal() {
  const [modalState, setModalState] = useState<ModalState>({
    title: "",
    content: "",
    buttonText: "",
    isOpen: false,
    buttonClick: () => {},
  });

  const showModal = useCallback((config: {
    title: string;
    content: string;
    buttonText: string;
    buttonClick: () => void;
  }) => {
    setModalState({
      ...config,
      isOpen: true,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      title: "",
      content: "",
      buttonText: "",
      isOpen: false,
      buttonClick: () => {},
    });
  }, []);

  return {
    modalState,
    setModalState,
    showModal,
    closeModal,
  };
}
