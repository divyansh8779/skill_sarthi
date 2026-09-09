import React from "react";
import { useTranslation } from "react-i18next";
import ChatWidget from "../components/ChatWidget";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("welcome")}</h1>
      <p className="mb-6">Voice-first career guidance for Tier-2/3 students.</p>
      <ChatWidget />
    </div>
  );
}
