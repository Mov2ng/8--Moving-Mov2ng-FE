"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import MoveTypeSelect from "@/app/quote/request/_components/MoveTypeSelect";
import DatePicker from "@/components/DatePicker/DatePicker";
import AddressSearchModal from "@/components/common/AddressSearchModal";
import { useQuoteRequestStore, MOVING_TYPE_MAP } from "../store";
import type { MovingType, SimpleAddress } from "../store";
import { useI18n } from "@/libs/i18n/I18nProvider";
import { useCreateEstimate } from "../api";

// 오늘 날짜와 비교하기 위해 시간을 제거하고 날짜만 비교하는 함수
function isDateBeforeToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  return compareDate < today;
}

export default function QuoteRequestEditPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useI18n();

  const requestId = params.id as string;

  const step = useQuoteRequestStore((s) => s.step);
  const movingType = useQuoteRequestStore((s) => s.movingType);
  const savedDate = useQuoteRequestStore((s) => s.date);
  const savedAddress = useQuoteRequestStore((s) => s.address);
  
  const setStep = useQuoteRequestStore((s) => s.setStep);
  const setMovingType = useQuoteRequestStore((s) => s.setMovingType);
  const setDate = useQuoteRequestStore((s) => s.setDate);
  const setAddress = useQuoteRequestStore((s) => s.setAddress);

  // Step 2: Date state
  const [dateValue, setDateValue] = useState<Date | null>(savedDate ?? null);

  // Step 3: Address state
  const [from, setFrom] = useState<SimpleAddress | null>(
    () => (savedAddress ? savedAddress.origin : null)
  );
  const [to, setTo] = useState<SimpleAddress | null>(
    () => (savedAddress ? savedAddress.destination : null)
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [target, setTarget] = useState<"from" | "to">("from");

  // Step 4: API mutation
  const {
    mutate: updateEstimateMutation,
    isPending,
    error,
  } = useCreateEstimate(); // TODO: updateEstimate API가 있다면 그걸 사용

  // Step 1: Moving Type Options
  const OPTIONS = [
    { 
      value: "소형이사" as MovingType, 
      title: t("quote_request_moving_type_small"), 
      desc: t("quote_request_moving_type_small_desc") 
    },
    { 
      value: "가정이사" as MovingType, 
      title: t("quote_request_moving_type_home"), 
      desc: t("quote_request_moving_type_home_desc") 
    },
    { 
      value: "사무실이사" as MovingType, 
      title: t("quote_request_moving_type_office"), 
      desc: t("quote_request_moving_type_office_desc") 
    },
  ] satisfies Array<{ value: MovingType; title: string; desc: string }>;

  // TODO: requestId로 기존 데이터 로드
  useEffect(() => {
    // 여기에 requestId로 기존 견적 요청 데이터를 불러와서 store에 설정하는 로직 추가
    // 예: fetch(`/api/requests/${requestId}`).then(...)
  }, [requestId]);

  // Step 2: Date validation
  const dateError = useMemo(() => {
    if (!dateValue) return "";
    if (isDateBeforeToday(dateValue)) {
      return t("quote_request_date_error");
    }
    return "";
  }, [dateValue, t]);

  const isValidDate = useMemo(() => {
    if (!dateValue) return false;
    return !isDateBeforeToday(dateValue);
  }, [dateValue]);

  // Step 3: Address validation
  const canNextAddress = useMemo(() => {
    return !!movingType && !!savedDate && !!from && !!to;
  }, [movingType, savedDate, from, to]);

  // Submit validation - 주소가 입력되면 제출 가능
  const canSubmit = useMemo(() => {
    return !!movingType && !!savedDate && !!from && !!to;
  }, [movingType, savedDate, from, to]);

  // Step 1: Handle moving type confirm
  const handleTypeConfirm = () => {
    if (!movingType) return;
    setStep(2);
    router.push(`/quote/request/${requestId}?step=2`);
  };

  // Step 2: Handle date confirm
  const handleDateConfirm = () => {
    if (!isValidDate || !dateValue || dateError || !movingType) return;
    setDate(dateValue);
    setStep(3);
    router.push(`/quote/request/${requestId}?step=3`);
  };

  const handleDateChange = (date: Date) => {
    setDateValue(date);
  };

  // Step 3: Handle address change - 주소를 store에 저장만 하고 step은 유지
  const handleAddressChange = () => {
    if (!from || !to) return;
    setAddress({
      origin: { address: from.address, zonecode: from.zonecode },
      destination: { address: to.address, zonecode: to.zonecode },
    });
  };

  // 주소 변경 시 자동으로 store 업데이트
  useEffect(() => {
    if (from && to) {
      handleAddressChange();
    }
  }, [from, to]);

  // Handle submit - 주소 입력 화면에서 직접 제출
  const handleSubmit = () => {
    if (!canSubmit || !movingType || !savedDate || !from || !to)
      return alert(t("quote_request_confirm_all_fields_required"));

    // 주소를 store에 저장
    const addressToSave = {
      origin: { address: from.address, zonecode: from.zonecode },
      destination: { address: to.address, zonecode: to.zonecode },
    };
    setAddress(addressToSave);

    const payload = {
      movingType: MOVING_TYPE_MAP[movingType],
      movingDate: savedDate.toISOString().slice(0, 10),
      origin: from.address,
      destination: to.address,
    };

    // TODO: updateEstimate API 호출로 변경
    updateEstimateMutation(payload, {
      onSuccess: (res) => {
        alert(t("quote_request_confirm_success"));
        router.push("/estimate/user/pending");
      },
      onError: (e) => {
        console.error("견적 수정 실패", e);
      },
    });
  };

  // Edit handlers
  const handleEditMovingType = () => {
    setStep(1);
    router.push(`/quote/request/${requestId}?step=1`);
  };

  const handleEditDate = () => {
    setStep(2);
    router.push(`/quote/request/${requestId}?step=2`);
  };


  // Address modal handlers
  const openFrom = () => {
    setTarget("from");
    setModalOpen(true);
  };

  const openTo = () => {
    setTarget("to");
    setModalOpen(true);
  };

  // Progress bar width calculation - 주소 입력 완료 시 100%
  const progressWidth = useMemo(() => {
    if (step === 3 && canNextAddress) return "100%";
    switch (step) {
      case 1: return "28%";
      case 2: return "56%";
      case 3: return "72%";
      default: return "28%";
    }
  }, [step, canNextAddress]);

  const errorMessage =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : t("quote_request_confirm_error");

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 md:px-10 py-8 md:py-12">
      {/* 상단 타이틀 + 진행바 */}
      <section className="mb-10">
        <h1 className="mb-4 text-[18px] font-semibold text-[#111]">{t("quote_request_title")}</h1>
        <div className="h-[6px] w-full rounded-full bg-[#E6E6E6]">
          <div className="h-[6px] rounded-full bg-[#2E7BFF] transition-all duration-300" style={{ width: progressWidth }} />
        </div>
      </section>

      {/* Step 1: Moving Type Selection */}
      {step === 1 && (
        <section className="flex flex-col gap-6">
          <div className="pt-14">
            <BubbleLeft>{t("quote_request_intro")}</BubbleLeft>
            <div className="h-4" />
            <BubbleLeft>{t("quote_request_select_type")}</BubbleLeft>
          </div>
          <div className="self-end w-[520px] border-radius-[32px 0 32px 32px]">
            <MoveTypeSelect
              options={OPTIONS}
              value={movingType ?? null}
              onChange={setMovingType}
              onConfirm={handleTypeConfirm}
              confirmDisabled={!movingType}
            />
          </div>
        </section>
      )}

      {/* Step 2: Date Selection */}
      {step === 2 && (
        <section className="flex flex-col gap-8">
          <div className="pt-2">
            <BubbleLeft>{t("quote_request_intro")}</BubbleLeft>
          </div>
          <BubbleLeft>{t("quote_request_select_type")}</BubbleLeft>
          <div className="self-center md:self-end md:mr-8 flex flex-col items-center md:items-end gap-2">
            <BubbleRight>{movingType ?? t("quote_request_type_not_selected")}</BubbleRight>
            <button
              type="button"
              onClick={handleEditMovingType}
              className="text-[12px] text-[#8A8A8A] underline underline-offset-2"
            >
              {t("quote_request_edit")}
            </button>
          </div>
          <BubbleLeft>{t("quote_request_select_date")}</BubbleLeft>
          <div className="self-center md:self-end mr-0 md:mr-8 w-full max-w-[544px] rounded-[24px] bg-white p-4 md:p-[40px] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
            <DatePicker
              size="md"
              value={dateValue}
              onChange={handleDateChange}
              onConfirm={movingType && isValidDate && dateValue && !dateError ? handleDateConfirm : undefined}
            />
            {dateError && (
              <div className="mt-4 text-center text-sm text-red-500">
                {dateError}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Step 3: Address Selection */}
      {step === 3 && (
        <section className="flex flex-col gap-8">
          <div className="pt-2">
            <BubbleLeft>{t("quote_request_intro")}</BubbleLeft>
          </div>
          <BubbleLeft>{t("quote_request_select_type")}</BubbleLeft>
          <div className="self-center md:self-end md:mr-8 flex flex-col items-center md:items-end gap-2">
            <BubbleRight>{movingType ?? t("quote_request_type_not_selected")}</BubbleRight>
            <button
              type="button"
              onClick={handleEditMovingType}
              className="text-[12px] text-[#8A8A8A] underline underline-offset-2 hover:text-[#2E7BFF]"
            >
              {t("quote_request_edit")}
            </button>
          </div>
          <BubbleLeft>{t("quote_request_select_date")}</BubbleLeft>
          <div className="self-center md:self-end md:mr-8 flex flex-col items-center md:items-end gap-2">
            <BubbleRight>
              {savedDate
                ? `${savedDate.getFullYear()}${t("date_year")} ${savedDate.getMonth() + 1}${t("date_month")} ${savedDate.getDate()}${t("date_day")}`
                : t("quote_request_date_not_selected")}
            </BubbleRight>
            <button
              type="button"
              onClick={handleEditDate}
              className="text-[12px] text-[#8A8A8A] underline underline-offset-2 hover:text-[#2E7BFF]"
            >
              {t("quote_request_edit")}
            </button>
          </div>
          <BubbleLeft>{t("quote_request_select_address")}</BubbleLeft>
          <div className="self-end mr-8 w-[544px] rounded-[24px] bg-white p-[40px] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
            <div className="space-y-5">
              <div>
                <div className="mb-2 text-[12px] font-semibold text-[#111]">{t("quote_request_origin_label")}</div>
                <button
                  type="button"
                  onClick={openFrom}
                  className="h-[48px] w-full rounded-xl border border-[#2E7BFF] px-4 text-left text-[14px] text-[#2E7BFF]"
                >
                  {from ? `${from.address}` : t("quote_request_select_origin")}
                </button>
                {from && (
                  <>
                    <div className="mt-2 text-[12px] text-[#666]">{t("quote_request_postcode")} {from.zonecode}</div>
                    <button
                      type="button"
                      onClick={openFrom}
                      className="mt-1 text-[12px] text-[#8A8A8A] underline underline-offset-2 hover:text-[#2E7BFF]"
                    >
                      {t("quote_request_edit")}
                    </button>
                  </>
                )}
              </div>
              <div>
                <div className="mb-2 text-[12px] font-semibold text-[#111]">{t("quote_request_destination_label")}</div>
                <button
                  type="button"
                  onClick={openTo}
                  className="h-[48px] w-full rounded-xl border border-[#2E7BFF] px-4 text-left text-[14px] text-[#2E7BFF]"
                >
                  {to ? `${to.address}` : t("quote_request_select_destination")}
                </button>
                {to && (
                  <>
                    <div className="mt-2 text-[12px] text-[#666]">{t("quote_request_postcode")} {to.zonecode}</div>
                    <button
                      type="button"
                      onClick={openTo}
                      className="mt-1 text-[12px] text-[#8A8A8A] underline underline-offset-2 hover:text-[#2E7BFF]"
                    >
                      {t("quote_request_edit")}
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* 견적 확정하기 버튼 */}
            {canNextAddress && (
              <>
                {error && (
                  <div className="mt-4 text-red-500 text-sm text-center">{errorMessage}</div>
                )}
                <button
                  type="button"
                  disabled={isPending || !canNextAddress}
                  onClick={handleSubmit}
                  className={[
                    "mt-8 h-[56px] w-full rounded-2xl font-bold transition-colors",
                    canNextAddress && !isPending
                      ? "bg-[#2E7BFF] text-white hover:bg-[#1b6fe6]"
                      : "bg-[#E6E6E6] text-[#B9B9B9] cursor-not-allowed",
                  ].join(" ")}
                >
                  {isPending ? t("quote_request_confirm_submitting") : t("quote_request_confirm_submit")}
                </button>
              </>
            )}
          </div>
          <AddressSearchModal
            open={modalOpen}
            title={target === "from" ? t("quote_request_search_origin") : t("quote_request_search_destination")}
            onClose={() => setModalOpen(false)}
            onSelect={(res) => {
              const payload = { zonecode: res.zonecode, address: res.address };
              if (target === "from") setFrom(payload);
              else setTo(payload);
            }}
          />
        </section>
      )}
    </main>
  );
}

function BubbleLeft({ children }: { children: React.ReactNode }) {
  return (
    <div className="self-start inline-flex max-w-[520px] rounded-full bg-white px-6 py-4 text-[14px] text-[#111] shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
      {children}
    </div>
  );
}

function BubbleRight({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex max-w-[520px] rounded-full bg-[#2E7BFF] px-6 py-4 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(46,123,255,0.25)]">
      {children}
    </div>
  );
}

