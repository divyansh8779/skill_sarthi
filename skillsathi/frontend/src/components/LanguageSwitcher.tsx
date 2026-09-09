import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <div>
      <select value={i18n.language} onChange={(e)=>i18n.changeLanguage(e.target.value)} className="p-1 border">
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>
    </div>
  );
}
