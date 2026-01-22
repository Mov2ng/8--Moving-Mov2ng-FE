import type { Metadata } from "next";

type GenerateEstimateMetadataParams = {
  id: string;
  type: "pending" | "received";
};

export function generateEstimateMetadata({
  id,
  type,
}: GenerateEstimateMetadataParams): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mov2ng.store";
  const url = `${baseUrl}/estimate/user/${type}/${id}`;
  
  const title = type === "pending" ? "견적 상세" : "받은 견적 상세";
  const description = "받은 견적을 확인하세요";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

