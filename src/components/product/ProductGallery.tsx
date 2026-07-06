"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name, brand, category }: { images: string[]; name: string; brand: string; category?: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const hasImages = images.length > 0;

  return (
    <div>
      <button
        onClick={() => hasImages && setLightbox(true)}
        className="relative block aspect-square w-full overflow-hidden rounded-2xl border border-bg-border bg-white"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <ProductImage
              src={images[active]}
              alt={name}
              brand={brand}
              category={category}
              name={name}
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="p-8 transition-transform duration-500 hover:scale-[1.02]"
            />
          </motion.div>
        </AnimatePresence>
      </button>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-lg border bg-white",
                active === i ? "border-brand-red" : "border-bg-border"
              )}
            >
              <ProductImage src={img} alt={`${name} ${i + 1}`} brand={brand} className="p-2" />
            </button>
          ))}
        </div>
      )}

      <Dialog.Root open={lightbox} onOpenChange={setLightbox}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-[101] flex items-center justify-center p-6">
            <Dialog.Title className="sr-only">{name}</Dialog.Title>
            <Dialog.Close className="absolute right-6 top-6 rounded-full bg-bg-card p-2 text-text-primary">
              <X className="h-6 w-6" />
            </Dialog.Close>
            <div className="relative h-[80vh] w-full max-w-3xl">
              <ProductImage src={images[active]} alt={name} brand={brand} />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
