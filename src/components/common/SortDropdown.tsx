import React, { useState } from "react";
import Image from "next/image";

export default function SortDropdown({
  sortList,
  sort,
}: {
  sortList: string[];
  sort: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className="flex flex-col w-[114px] max-md:w-[91px] relative">
      <button
        className="flex items-center justify-center gap-[10px] w-[114px] h-10 pret-14-semibold text-black-400
        max-md:gap-0.5 max-md:w-[91px] max-md:h-8 max-md:pret-xs-semibold"
        onClick={toggleDropdown}
      >
        {sort}
        <Image
          src="assets/icon/ic-chevron-down.svg"
          alt="arrow-down"
          width={20}
          height={20}
        />
      </button>
      {isOpen && (
        <ul className="flex flex-col w-[114px] border border-line-200 rounded-[8px] absolute top-12 bg-gray-50
        max-md:w-[91px]">
          {sortList.map((sort) => (
            <li
              key={sort}
              className="flex items-center w-full h-10 pret-14-medium text-black-400 px-[10px] mt-0.5 max-md:h-8 max-md:pret-xs-medium max-md:px-2"
            >
              {sort}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
