"use client";

import { ProductCard } from "@/components/ProductCard";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getProductSlugFromName } from "@/lib/images/aspect";
import { PRODUCT_CATALOG } from "@/lib/products/catalog";
import { useEffect, useState } from "react";

type UploadedImage = { url: string; productSlug: string };

export function Products() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { data, error: listError } = await supabase.storage
        .from("product-images")
        .list("", { limit: 100 });

      if (listError || !data) {
        setFetchError("No se pudieron cargar imágenes de productos.");
        return;
      }

      const images = data
        .filter((file) => Boolean(file.name))
        .map((file) => ({
          url: supabase.storage.from("product-images").getPublicUrl(file.name).data.publicUrl,
          productSlug: getProductSlugFromName(file.name),
        }));

      const byProduct = new Map<string, UploadedImage>();
      for (const image of images) {
        if (!image.productSlug || byProduct.has(image.productSlug)) continue;
        byProduct.set(image.productSlug, {
          url: image.url,
          productSlug: image.productSlug,
        });
      }
      setUploadedImages(Array.from(byProduct.values()));
    };

    void fetchImages();
  }, []);

  const imagesByProduct = new Map<string, UploadedImage>();
  uploadedImages.forEach((image) => {
    if (!imagesByProduct.has(image.productSlug)) {
      imagesByProduct.set(image.productSlug, image);
    }
  });

  return (
    <section id="productos" className="section-container py-16">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          Productos personalizados
        </p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl">
          Todo lo que imaginás, hecho realidad
        </h2>
      </div>
      {fetchError && <p className="mb-3 text-sm text-rose-600">{fetchError}</p>}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCT_CATALOG.map((product) => {
          const uploaded = imagesByProduct.get(product.slug);
          return (
          <ProductCard
            key={product.slug}
            title={product.title}
            description={product.description}
            image={uploaded?.url ?? product.image}
          />
          );
        })}
      </div>
    </section>
  );
}
