import Image from "next/image";
import Link from "next/link";

export default function OAuth() {
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <h1>SNS 계정으로 간편 가입하기</h1>
      <div className="flex justify-between gap-8">
        <Link href="/auth/google">
          <Image
            src="/assets/icon/login-google.svg"
            alt="google"
            width={72}
            height={72}
          />
        </Link>
        <Link href="/auth/kakao">
          <Image
            src="/assets/icon/login-kakao.svg"
            alt="kakao"
            width={72}
            height={72}
          />
        </Link>
        <Link href="/auth/naver">
          <Image
            src="/assets/icon/login-naver.svg"
            alt="apple"
            width={72}
            height={72}
          />
        </Link>
      </div>
    </div>
  );
}
