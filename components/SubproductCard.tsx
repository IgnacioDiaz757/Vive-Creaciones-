"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MessageCircleHeart } from "lucide-react";

type SubproductCardProps = {
  title: string;
  price: string | null;
  description: string | null;
  images: string[];
};

export function SubproductCard({ title, price, description, images }: SubproductCardProps) {
  const [index, setIndex] = useState(0);
  const gallery = images.length > 0 ? images : [];

  useEffect(() => {
    if (gallery.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % gallery.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [gallery.length]);

  const prevImage = () => {
    if (gallery.length <= 1) return;
    setIndex((current) => (current - 1 + gallery.length) % gallery.length);
  };

  const nextImage = () => {
    if (gallery.length <= 1) return;
    setIndex((current) => (current + 1) % gallery.length);
  };

  return (
    <article className="bubble-card flex h-full flex-col p-4">
      <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-2xl">
        {gallery[index] && (
          <Image src={gallery[index]} alt={title} fill unoptimized className="object-cover" />
        )}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-1 text-white"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-1 text-white"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="size-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1">
              {gallery.map((_, dotIndex) => (
                <span
                  key={dotIndex}
                  className={`h-1.5 w-1.5 rounded-full ${
                    dotIndex === index ? "bg-white" : "bg-white/45"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      {price && <p className="mt-1 text-sm font-bold text-sky-700 dark:text-sky-300">Precio: {price}</p>}
      {description && <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>}
      <a
        href={`https://wa.me/5493513780509?text=Hola%20Vive!%20Creaciones,%20quiero%20consultar%20por%20${encodeURIComponent(title)}.`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 self-start rounded-xl bg-brand-green/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-brand-green"
      >
        <MessageCircleHeart className="size-4" />
        Consultar
      </a>
    </article>
  );
}
