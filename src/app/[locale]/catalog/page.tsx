import type { Metadata } from "next";
import { Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { pageMetadata, type AppLocale } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CatalogView } from "@/components/catalog/CatalogView";
import { CategoryChips } from "@/components/catalog/CategoryChips";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: "/catalog",
    title: t("catalog.title"),
    description: t("catalog.description"),
  });
}

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const tc = useTranslations("common");
  const tn = useTranslations("nav");
  const locale = useLocale() as AppLocale;
  const crumbs = [
    { name: tn("home"), path: "/" },
    { name: tn("catalog"), path: "/catalog" },
  ];
  return (
    <div className="pb-24 pt-28 md:pt-32">
      <BreadcrumbJsonLd locale={locale} items={crumbs} />
      <div className="container-x mb-10">
        <h1 className="font-display text-4xl font-extrabold text-text-primary">{t("title")}</h1>
        <p className="mt-2 text-text-secondary">{t("subtitle")}</p>
        <Suspense fallback={null}>
          <CategoryChips />
        </Suspense>
      </div>
      <Suspense fallback={<div className="container-x text-text-secondary">{tc("loading")}</div>}>
        <CatalogView />
      </Suspense>
    </div>
  );
}
