import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
// import ptpt from "./locales/pt-pt.json";
// import ptbr from "./locales/pt-br.json";
// import es from "./locales/es.json";
// import it from "./locales/it.json";
// import fr from "./locales/fr.json";
// import ja from "./locales/ja.json";
// import zh from "./locales/zh.json";
// import ko from "./locales/ko.json";
// import ru from "./locales/ru.json";
// import de from "./locales/de.json";
// import id from "./locales/id.json";

type Language = {
  name: string;
  code: string;
};

export const languages: Language[] = [
  { name: "English", code: "en" },
  // { name: "Português (Portugal)", code: "pt" },
  // { name: "Português (Brasil)", code: "br" },
  // { name: "Español", code: "es" },
  // { name: "Italiano", code: "it" },
  // { name: "Français", code: "fr" },
  // { name: "日本語", code: "ja" },
  // { name: "中文", code: "zh" },
  // { name: "한국어", code: "ko" },
  // { name: "Русский", code: "ru" },
  // { name: "Deutsch", code: "de" },
  // { name: "Bahasa Indonesia", code: "id" },
];

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const resources = {
  en: { translation: en },
  // pt: { translation: ptpt },
  // br: { translation: ptbr },
  // es: { translation: es },
  // it: { translation: it },
  // fr: { translation: fr },
  // ja: { translation: ja },
  // zh: { translation: zh },
  // ko: { translation: ko },
  // ru: { translation: ru },
  // de: { translation: de },
  // id: { translation: id },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("i18n-language") || "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
