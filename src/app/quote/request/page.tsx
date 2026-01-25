import QuoteRequestContent from "./_components/QuoteRequestContent";

type QuoteRequestPageProps = {
  searchParams: Promise<{ step?: string | string[] }>;
};

export default async function QuoteRequestPage({ searchParams }: QuoteRequestPageProps) {
  const params = await searchParams;
  const stepParam = typeof params?.step === "string"
    ? params.step
    : Array.isArray(params?.step)
      ? params.step[0]
      : undefined;
  const parsed = stepParam ? parseInt(stepParam, 10) : NaN;
  const initialStep =
    Number.isInteger(parsed) && parsed >= 1 && parsed <= 4 ? (parsed as 1 | 2 | 3 | 4) : null;

  return <QuoteRequestContent initialStep={initialStep} />;
}
