import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";

export const metadata: Metadata = {
  title: "Каталог оборудования",
  description: "Полный каталог лабораторного оборудования и IVD-решений: ИХЛА, биохимия, гематология, ПЦР, генетика и другие направления.",
};

export default function CatalogPage() {
  return (
    <div className="pb-24 pt-28 md:pt-32">
      <div className="container-x mb-10">
        <h1 className="font-display text-4xl font-extrabold text-text-primary">Каталог</h1>
        <p className="mt-2 text-text-secondary">Лабораторное оборудование и IVD-решения мировых брендов</p>
      </div>
      <Suspense fallback={<div className="container-x text-text-secondary">Загрузка…</div>}>
        <CatalogView />
      </Suspense>
    </div>
  );
}
