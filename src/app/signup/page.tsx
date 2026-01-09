import SignupForm from "@/app/signup/(components)/SignupForm";
import OAuth from "@/components/form/OAuth";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="mt-14 flex flex-col items-center justify-center">
      <Image
        src="/assets/image/logo-text.png"
        alt="signup-title"
        width={106.698}
        height={55.138}
        className="mb-18"
      />
      <SignupForm />
      <div className="mt-6 mb-18">
        이미 무빙 회원이신가요?{" "}
        <Link href="/login" className="text-primary-blue-300 underline">
          이메일로 로그인하기
        </Link>
      </div>
      <OAuth />
    </div>
  );
}
