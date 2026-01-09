"use client";

import React, { useState } from "react";
import EstimatePage from "./driver/(components)/EstimatePage";

export default function Page() {
  const [activeTab, setActiveTab] = useState("received");
  return (
    <EstimatePage />
  );
}