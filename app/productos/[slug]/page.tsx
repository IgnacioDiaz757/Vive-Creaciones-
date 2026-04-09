import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductDetail, isValidProductSlug } from "@/lib/products/data";
import { SubproductCard } from "@/components/SubproductCard";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!isValidProductSlug(slug)) notFound();

  const product = await getProductDetail(slug);
  if (!product) notFound();

  return (
    <main className="section-container py-10 text-slate-900 dark:text-slate-100">
      <Link
        href="/#productos"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
      >
        <ArrowLeft className="size-4" />
        Volver a productos
      </Link>

      <section className="mt-6 bubble-card p-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{product.title}</h1>
        {product.price && (
          <p className="mt-2 text-xl font-bold text-sky-700 dark:text-sky-300">Precio: {product.price}</p>
        )}
        <p className="mt-4 text-slate-600 dark:text-slate-300">{product.shortDescription}</p>
      </section>

      {product.subcards && product.subcards.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Opciones de {product.title}
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {product.subcards.map((card) => (
              <SubproductCard
                key={card.id}
                title={card.title}
                price={card.price}
                description={card.description}
                images={card.images}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
