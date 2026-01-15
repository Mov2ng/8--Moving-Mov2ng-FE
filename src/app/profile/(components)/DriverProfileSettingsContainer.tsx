"use client";

import { useAuth } from "@/hooks/useAuth";
import DriverBasicInfoForm from "@/components/profile/DriverBasicInfoForm";

/**
 * DriverProfileSettingsContainer: 기사님 기본 정보 수정 페이지 컨테이너
 * - 사용자 기본 정보를 불러와 DriverBasicInfoForm에 전달
 * @returns
 */
export default function DriverProfileSettingsContainer() {
  const { me, isLoading } = useAuth();
  console.log("me: ", me);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-blue-300 border-t-transparent" />
      </div>
    );
  }

  if (!me) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 mt-10">
      <div className="text-[32px] font-semibold">기본 정보 수정</div>
      <div className="text-xl text-black-200">기본 정보를 수정해주세요.</div>
      <hr className="border-line-100" />
      <DriverBasicInfoForm
        initialData={{
          name: me.name,
          email: me.email,
          phoneNum: me.phone_number,
        }}
      />
    </div>
  );
}
