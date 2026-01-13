import Image from "next/image";
import LoginForm from "./(components)/LoginForm";
import OAuth from "@/components/form/OAuth";
import Link from "next/link";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="mt-14 flex flex-col items-center justify-center">
      <Image
        src="/assets/image/logo-text.png"
        alt="signup-title"
        width={106.698}
        height={55.138}
      />
      <Suspense fallback={<div>로딩 중...</div>}>
        <LoginForm />
      </Suspense>
      <div className="mt-6 mb-18">
        아직 무빙 회원이 아니신가요?{" "}
        <Link href="/signup" className="text-primary-blue-300 underline">
          이메일로 회원가입하기
        </Link>
      </div>
      <OAuth />
    </div>
  );
}
