// src/i18n.setup.ts — Vite + React + react-i18next
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// مسیرها مطابق ساختار فعلی repo (i18n بیرون از src)
import en from "../i18n/locales/en/common.json";
import fa from "../i18n/locales/fa/common.json";
import ar from "../i18n/locales/ar/common.json";
import ru from "../i18n/locales/ru/common.json";

const STORAGE_KEY = "i18n_lang";
const savedLng =
  typeof window !== "undefined"
    ? window.localStorage.getItem(STORAGE_KEY) || "en"
    : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    fa: { common: fa },
    ar: { common: ar },
    ru: { common: ru },
  },
  ns: ["common"],
  defaultNS: "common",
  lng: savedLng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false,
});

// ذخیره زبان در مرورگر
i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, lng);
    } catch {}
  }
});

export default i18n;
