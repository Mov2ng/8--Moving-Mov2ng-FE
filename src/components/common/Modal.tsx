import Image from 'next/image'
import React, { useState } from 'react'

function Modal({ title, content, buttonText, isOpen, setIsOpen, buttonClick }: { title: string, content: string, buttonText: string, isOpen: boolean, setIsOpen: (isOpen: boolean) => void, buttonClick: () => void }) { 
  return (
    isOpen && (
    <div className="fixed top-0 left-0 w-full h-full bg-[#141414]/50 flex justify-center items-center z-50">
      <div className='py-8 px-6 w-[680px] flex flex-col gap-10 bg-white rounded-4xl'>
        <p className="flex justify-between items-center pret-2xl-semibold text-black-400">
          {title} 
          <Image src="/assets/icon/ic-cancel.svg" alt="cancel" width={36} height={36} onClick={() => setIsOpen(false)} className="cursor-pointer"></Image>
        </p>
        <p className="pret-2lg-medium text-black-400">{content}</p>
        <button className="w-full pret-xl-semibold text-gray-50 bg-primary-blue-300 p-4 rounded-2xl cursor-pointer"
        onClick={buttonClick}>
          {buttonText}
        </button>
      </div>
    </div>
    )
  )
}

export default Modal