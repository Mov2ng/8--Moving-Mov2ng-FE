import React, { useState } from "react";
import Image from "next/image";


export default function FilterDropdown({ menuName, menuList, menuSubList, onClick }: { menuName: string, menuList: string[], menuSubList?: string[], onClick: (menu: string) => void }) {

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const onClickMenu = (menu: string) => {
    onClick(menu);
    setIsOpen(false);
  };
  return (
    <div className="flex flex-col w-full max-md:w-[89px] relative">
        <button
          className={`w-full h-16 pret-2lg-medium text-black-400 flex items-center justify-between px-6 border rounded-2xl transition-all duration-300
            max-md:h-10 max-md:pret-14-medium max-md:px-0 max-md:justify-center max-md:gap-[6px] max-md:rounded-lg 
          ${isOpen ? "border-primary-blue-300 bg-primary-blue-50 text-primary-blue-300" : "border-gray-100 bg-gray-50 text-black-400"}`}

          onClick={toggleDropdown}
        >
          {menuName}
          {isOpen ? (
            <Image
              src="assets/icon/ic-chevron-down-blue.svg"
              alt="arrow-blue"
              width={36}
              height={36}
              className="transition-all duration-300 max-md:w-5 max-md:h-5"
            />
          ) : (
            <Image
              src="assets/icon/ic-chevron-down-black.svg"
              alt="arrow-black"
              width={36}
              height={36}
              className="transition-all duration-300 max-md:w-5 max-md:h-5"
            />
          )}
        </button>
        {isOpen && 
        <div className="absolute w-full max-h-[320px] overflow-y-scroll scrollbar-custom top-16 z-10 flex bg-gray-50 border border-gray-100 rounded-2xl shadow-[4px_4px_10px_0_rgba(224,224,224,0.25)] mt-2">
        <ul className="w-full h-full pret-2lg-medium text-black-400 flex flex-col items-center
        max-md:w-[89px] max-md:pret-14-medium max-md:px-[14px] max-md:rounded-lg 
        ">
            {menuList.map((menu) => (
              <li key={menu} className="w-full h-16 px-6 flex items-center max-md:h-9 max-md:px-0 hover:bg-primary-blue-50 hover:text-primary-blue-300 cursor-pointer" onClick={() => onClickMenu(menu)}>{menu}</li>
            ))}
        </ul>
        {menuSubList && (
          <ul className="w-full h-full pret-2lg-medium text-black-400 flex flex-col items-center border-l border-gray-100
          max-md:w-[89px] max-md:pret-14-medium max-md:px-[14px] max-md:rounded-lg 
          ">
            {menuSubList.map((menu) => (
              <li key={menu} className="w-full h-16 px-6 flex items-center max-md:h-9 max-md:px-0 hover:bg-primary-blue-50 hover:text-primary-blue-300 cursor-pointer" onClick={() => onClickMenu(menu)}>{menu}</li>
            ))}
          </ul>
        )}
        </div>}
    </div>  
  );
}
