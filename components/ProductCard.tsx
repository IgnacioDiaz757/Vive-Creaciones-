"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

type ProductCardProps = {
  title: string;
  description: string;
  image: string;
};

export function ProductCard({ title, description, image }: ProductCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bubble-card flex h-full flex-col p-4"
    >
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={title}
          fill
          unoptimized
          className="object-cover transition duration-300 hover:scale-105"
        />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      <a
        href="https://wa.me/5493513780509?text=Hola%20Vive!%20Creaciones,%20quiero%20consultar%20por%20este%20producto."
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 self-start rounded-xl bg-brand-green/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-brand-green"
      >
        Consultar
        <ArrowUpRight className="size-4" />
      </a>
    </motion.article>
  );
}
