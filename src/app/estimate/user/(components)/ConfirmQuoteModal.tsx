"use client";

import { useI18n } from "@/libs/i18n/I18nProvider";

type ConfirmQuoteModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
};

export default function ConfirmQuoteModal({
  open,
  onCancel,
  onConfirm,
  isSubmitting,
}: ConfirmQuoteModalProps) {
  const { t } = useI18n();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="pret-lg-semibold text-black-300 mb-2">
          {t("confirm_quote_title")}
        </div>
        <p className="text-gray-500 pret-14-medium mb-6">
          {t("confirm_quote_desc")}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-[12px] border border-primary-blue-300 text-primary-blue-300 pret-14-semibold hover:bg-primary-blue-50 transition-colors disabled:opacity-60"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-[12px] bg-primary-blue-300 text-white pret-14-semibold hover:bg-primary-blue-400 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? t("confirming") : t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
