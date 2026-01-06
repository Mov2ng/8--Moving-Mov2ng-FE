import React, { useState } from "react";
import Image from "next/image";

import type { QuerySelectType } from "@/types/queryType";

export default function SortDropdown({
  sortList,
  sort,
  setSort,
}: {
  sortList: QuerySelectType[];
  sort: QuerySelectType;
  setSort: (sort: QuerySelectType) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const onClickSort = (sort: QuerySelectType) => {
    setSort(sort);
    setIsOpen(false);
  };
  return (
    <div className="flex flex-col w-[114px] max-md:w-[91px] relative">
      <button
        className="flex items-center justify-center gap-[10px] w-[114px] h-10 pret-14-semibold text-black-400
        max-md:gap-0.5 max-md:w-[91px] max-md:h-8 max-md:pret-xs-semibold"
        onClick={toggleDropdown}
      >
        {sort.label}
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
          {sortList.map((item) => (
            <li
              key={item.value}
              className="flex items-center w-full h-10 pret-14-medium text-black-400 px-[10px] cursor-pointer mt-0.5 max-md:h-8 max-md:pret-xs-medium max-md:px-2"
              onClick={() => onClickSort(item)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
