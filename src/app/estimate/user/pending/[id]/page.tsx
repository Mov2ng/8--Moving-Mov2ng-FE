import QuotePendingDetailPage from "../../(components)/QuotePendingDetailPage";
import { generateEstimateMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  return generateEstimateMetadata({ id: resolved.id, type: "pending" });
}

export default async function Page({ params }: PageProps) {
  const resolved = await Promise.resolve(params);
  const id = Number(resolved.id);

  return <QuotePendingDetailPage estimateId={id} />;
}
