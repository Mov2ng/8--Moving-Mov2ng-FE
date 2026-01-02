import QuotePendingDetailPage from "../../(components)/QuotePendingDetailPage";

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolved = await Promise.resolve(params);
  const id = Number(resolved.id);

  return <QuotePendingDetailPage estimateId={id} />;
}
