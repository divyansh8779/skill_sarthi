import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to SkillSathi",
      login: "Login",
      register: "Register",
      schemes: "Schemes",
      chat_placeholder: "Describe your interests in your language..."
    }
  },
  hi: {
    translation: {
      welcome: "SkillSathi में आपका स्वागत है",
      login: "लॉगिन",
      register: "रजिस्टर",
      schemes: "योजनाएँ",
      chat_placeholder: "अपनी रुचियाँ अपने भाषा में बताइए..."
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
