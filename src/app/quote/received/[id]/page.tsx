import QuoteReceivedDetailPage from "../../(components)/QuoteReceivedDetailPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ReceivedDetailPage({ params }: Props) {
  const resolved = await Promise.resolve(params);
  const id = Number(resolved.id);

  if (Number.isNaN(id)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-secondary-red-200 pret-14-medium">
        잘못된 견적 ID입니다.
      </div>
    );
  }

  return <QuoteReceivedDetailPage estimateId={id} />;
}
