"use client";

import FormField from "@/components/form/FormField";
import PasswordInput from "@/components/form/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BasicInfoFormValues,
  basicInfoSchema,
} from "@/libs/validation/basicInfoSchemas";
import { useUpdateBasicInfo } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";

/**
 * DriverBasicInfoForm: 기사님 기본 정보 수정 폼
 * @param initialData - 초기 데이터
 * @returns
 */
interface DriverBasicInfoFormProps {
  initialData?: {
    name?: string;
    email?: string;
    phoneNum?: string;
  };
}

export default function DriverBasicInfoForm({
  initialData,
}: DriverBasicInfoFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields, isValid },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    mode: "all",
    defaultValues: initialData
      ? {
          name: initialData.name || "",
          email: initialData.email || "",
          phoneNum: initialData.phoneNum || "",
          currentPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
        }
      : undefined,
  });

  const updateBasicInfoMutation = useUpdateBasicInfo();

  const onSubmit = async (data: BasicInfoFormValues) => {
    // 변경된 필드만 포함한 데이터 생성
    const submitData: any = {};

    // 이름: 변경된 경우
    if (data.name && data.name !== initialData?.name) {
      submitData.name = data.name;
    }

    // 전화번호: 변경된 경우
    if (data.phoneNum && data.phoneNum !== initialData?.phoneNum) {
      submitData.phoneNum = data.phoneNum;
    }

    // 비밀번호가 입력된 경우에만 비밀번호 필드 추가
    if (data.currentPassword && data.newPassword && data.newPasswordConfirm) {
      submitData.currentPassword = data.currentPassword;
      submitData.newPassword = data.newPassword;
      submitData.newPasswordConfirm = data.newPasswordConfirm;
    }

    await updateBasicInfoMutation.mutateAsync(submitData);
    alert("기본 정보 수정이 완료 되었습니다.");
    router.push("/profile");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* 기사님 기본정보 수정: PC에서는 2단, 모바일/태블릿에서는 1단 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-between">
        {/* 왼쪽 열: 이름, 이메일, 전화번호 */}
        <div className="flex flex-col gap-6">
          <FormField
            label="이름"
            type="text"
            register={register("name")}
            error={errors.name}
            placeholder="이름"
            touched={!!touchedFields.name}
          />
          <FormField
            label="이메일"
            type="text"
            register={register("email")}
            error={errors.email}
            placeholder="이메일"
            touched={!!touchedFields.email}
            disabled
          />
          <FormField
            label="전화번호"
            type="text"
            register={register("phoneNum")}
            error={errors.phoneNum}
            placeholder="전화번호"
            touched={!!touchedFields.phoneNum}
          />
        </div>

        {/* 오른쪽 열: 비밀번호 변경 */}
        <div className="flex flex-col gap-6">
          <FormField
            label="현재 비밀번호"
            register={register("currentPassword")}
            error={errors.currentPassword}
            touched={!!touchedFields.currentPassword}
          >
            <PasswordInput
              register={register("currentPassword")}
              placeholder="현재 비밀번호"
              error={errors.currentPassword}
              touched={!!touchedFields.currentPassword}
            />
          </FormField>
          <FormField
            label="새 비밀번호"
            register={register("newPassword")}
            error={errors.newPassword}
            touched={!!touchedFields.newPassword}
          >
            <PasswordInput
              register={register("newPassword")}
              placeholder="새 비밀번호"
              error={errors.newPassword}
              touched={!!touchedFields.newPassword}
            />
          </FormField>
          <FormField
            label="새 비밀번호 확인"
            register={register("newPasswordConfirm")}
            error={errors.newPasswordConfirm}
            touched={!!touchedFields.newPasswordConfirm}
          >
            <PasswordInput
              register={register("newPasswordConfirm")}
              placeholder="새 비밀번호 확인"
              error={errors.newPasswordConfirm}
              touched={!!touchedFields.newPasswordConfirm}
            />
          </FormField>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="mt-4 w-full h-12 rounded-xl bg-primary-blue-300 text-white pret-lg-semibold disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "수정 중..." : "수정하기"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

