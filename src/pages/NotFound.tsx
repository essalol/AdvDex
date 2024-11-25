import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <h1 className="text-6xl font-bold">404</h1>
      <h4 className="text-xl font-semibold">
        {t("sorry-the-page-you-are-looking-for-could-not-be-found")}
      </h4>
    </div>
  );
}
