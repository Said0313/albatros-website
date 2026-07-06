import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { CatalogView } from "@/components/catalog/CatalogView";

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const tc = useTranslations("common");
  return (
    <div className="pb-24 pt-28 md:pt-32">
      <div className="container-x mb-10">
        <h1 className="font-display text-4xl font-extrabold text-text-primary">{t("title")}</h1>
        <p className="mt-2 text-text-secondary">{t("subtitle")}</p>
      </div>
      <Suspense fallback={<div className="container-x text-text-secondary">{tc("loading")}</div>}>
        <CatalogView />
      </Suspense>
    </div>
  );
}
