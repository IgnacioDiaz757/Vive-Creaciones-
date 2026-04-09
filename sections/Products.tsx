"use client";

import { ProductCard } from "@/components/ProductCard";
import { PRODUCT_CATALOG } from "@/lib/products/catalog";
import { useEffect, useState } from "react";

type ProductItem = {
  slug: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  price: string | null;
};

export function Products() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [fetchError, setFetchError] = useState("");
  const fallbackProducts: ProductItem[] = PRODUCT_CATALOG.map((product) => ({
    ...product,
    images: [product.image],
    price: null,
  }));

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products/summary");
      if (!response.ok) {
        setFetchError("No se pudieron cargar los productos.");
        return;
      }
      const data = (await response.json()) as { products?: ProductItem[] };
      setProducts(data.products ?? []);
    };

    void fetchProducts();
  }, []);

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
        {(products.length > 0 ? products : fallbackProducts).map((product) => {
          return (
          <ProductCard
            key={product.slug}
            slug={product.slug}
            title={product.title}
            description={product.description}
            image={product.image}
            price={product.price}
          />
          );
        })}
      </div>
    </section>
  );
}
