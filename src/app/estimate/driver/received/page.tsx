// app/driver/received/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "../(components)/SideBar";
import { SearchBar } from "../(components)/SearchBar";
import { RequestList } from "../(components)/RequestList";
import { getMe } from "@/types/api/auth";
import { getDriverRequests } from "@/types/api/driverRequests";
import type { DriverRequest } from "@/types/api/driverRequests";
import { useRouter } from "next/navigation";

export default function ReceivedPage() {
  const [items, setItems] = useState<DriverRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const meRes = await getMe();
        if (!meRes?.data) {
          router.push("/login"); // 인증이 필요한 경우
          return;
        }

        const res = await getDriverRequests(1);
        if (!mounted) return;
        setItems(res.items || []);
      } catch (e: unknown) {
        console.error(e);
        setError(e instanceof Error ? e.message : "데이터 로드 실패");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) return <div className="p-6">로딩중...</div>;
  if (error) return <div className="p-6 text-red-500">에러: {error}</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50">

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-6">
          <Sidebar />
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <SearchBar />
              <RequestList items={items.map(it => ({
                id: it.requestId,
                name: "고객", // 실제 이름 API에 있다면 사용
                moveType: it.movingType,
                tags: it.isDesignated ? ["지정 견적 요청"] : undefined,
                timeAgo: it.requestCreatedAt ? new Date(it.requestCreatedAt).toLocaleString() : "",
                date: it.movingDate ? new Date(it.movingDate).toLocaleDateString() : "",
                from: it.origin,
                to: it.destination,
              }))} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
