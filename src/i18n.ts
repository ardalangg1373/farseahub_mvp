// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// JSONهای ترجمه—طبق ساختاری که در ریشه داری:
import en from "../i18n/locales/en/common.json";
import fa from "../i18n/locales/fa/common.json";
import ar from "../i18n/locales/ar/common.json";
import ru from "../i18n/locales/ru/common.json";

// خواندن زبان ذخیره‌شده (اگر نبود، انگلیسی)
const STORAGE_KEY = "i18n_lang";
const savedLng =
  (typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY)) || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      fa: { common: fa },
      ar: { common: ar },
      ru: { common: ru }
    },
    ns: ["common"],
    defaultNS: "common",
    lng: savedLng,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    returnNull: false
  });

// ذخیره زبان هر بار که عوض می‌شود
i18n.on("languageChanged", (lng) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, lng);
  } catch {}
});

export default i18n;
