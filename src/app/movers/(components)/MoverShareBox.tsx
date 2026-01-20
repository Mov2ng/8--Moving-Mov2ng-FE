import Image from 'next/image'
import { useI18n } from "@/libs/i18n/I18nProvider";

function MoverShareBox({ showToast }: { showToast: (content: string) => void }) {
  const { t } = useI18n();

  const handleShareClip = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(t("share_driver_link"));
  }

  const handleShareKakao = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(t("share_kakao_link"));
  }

  const handleShareFacebook = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(t("share_facebook_link"));
  }
  
  return (
    <div className="flex flex-col gap-[22px] max-md:hidden">
      <h2 className="pret-xl-semibold text-black-400">
        {t("only_know_driver")}
      </h2>
      <div className="flex gap-4">
        <button 
        onClick={handleShareClip}
        className="size-16 bg-gray-50 border border-line-200 rounded-2xl flex items-center justify-center cursor-pointer">
          <Image
            src="/assets/icon/ic-clip.svg"
            alt="clip"
            width={36}
            height={36}
          />
        </button>
        <button 
        onClick={handleShareKakao}
        className="size-16 bg-[#FAE100] rounded-2xl flex items-center justify-center cursor-pointer">
          <Image
            src="/assets/icon/ic-kakao.svg"
            alt="kakao"
            width={36}
            height={36}
          />
        </button>
        <button 
        onClick={handleShareFacebook}
        className="size-16 bg-[#4285F4] rounded-2xl flex items-center justify-center cursor-pointer">
          <Image
            src="/assets/icon/ic-facebook.svg"
            alt="facebook"
            width={36}
            height={36}
          />
        </button>
      </div>
    </div>
  )
}

export default MoverShareBox