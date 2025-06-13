import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "@/i18n/server";
import { Locale, locales } from "@/i18n/types";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function NotFound({
  params,
}: {
  params?: { locale: Locale };
}) {
  const locale = params?.locale || "en";
  const { t } = await getTranslations(locale, ["error"]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">{t("404.title")}</h1>
      <p className="text-lg mb-6">{t("404.message")}</p>
      <Link href="/">
        <Button>{t("404.back")}</Button>
      </Link>
    </div>
  );
}
