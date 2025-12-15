import React from "react";
import MoversDetailPage from "../(components)/moversDetailPage";

export default function MoversDetail(params: { id: string }) {
  return <MoversDetailPage id={params.id} />;
}
