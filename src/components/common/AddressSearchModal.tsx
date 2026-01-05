"use client";

import DaumPostcode, { Address } from "react-daum-postcode";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  onSelect: (result: {
    zonecode: string;
    address: string;
    roadAddress?: string;
    jibunAddress?: string;
    buildingName?: string;
    addressType?: string;
  }) => void;
};

export default function AddressSearchModal({
  open,
  title = "주소 검색",
  onClose,
  onSelect,
}: Props) {
  if (!open) return null;

  const handleComplete = (data: Address) => {
    // 도로명 주소 우선, 없으면 지번
    const addr = data.roadAddress || data.address;
    onSelect({
      zonecode: data.zonecode,
      address: addr,
      roadAddress: data.roadAddress,
      jibunAddress: data.jibunAddress,
      buildingName: data.buildingName,
      addressType: data.addressType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* overlay */}
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* modal */}
      <div className="relative w-[560px] rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-[16px] font-semibold text-[#111]">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-[13px] text-[#666] hover:bg-black/5"
          >
            닫기
          </button>
        </div>

        <div className="h-[520px] overflow-hidden rounded-b-2xl">
          <DaumPostcode
            onComplete={handleComplete}
            style={{ width: "100%", height: "100%" }}
            autoClose={false}
          />
        </div>
      </div>
    </div>
  );
}
