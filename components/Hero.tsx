"use client";

import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section id="inicio" className="section-container relative py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-16 top-5 h-48 w-48 rounded-full bg-brand-green/30 blur-2xl md:h-72 md:w-72" />
        <div className="absolute right-4 top-0 h-52 w-52 rounded-full bg-brand-sky/35 blur-2xl md:h-72 md:w-72" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-brand-purple/25 blur-2xl md:h-56 md:w-56" />
      </div>

      <div className="bubble-card relative overflow-hidden p-8 md:p-12">
        <div className="absolute -right-6 -top-6 rounded-full bg-brand-purple/20 p-8">
          <Sparkles className="size-8 text-violet-600" />
        </div>
        <p className="mb-3 inline-flex rounded-full bg-brand-sky/20 px-3 py-1 text-xs font-semibold text-sky-700">
          Creatividad para marcas y momentos especiales
        </p>
        <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl">
          Dale vida a tus ideas
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300 md:text-lg">
          En Vive! Creaciones diseñamos y producimos papelería creativa, estampados DTF,
          kits escolares, candy bar y productos personalizados para que tu emprendimiento
          y tus celebraciones brillen.
        </p>
        <a
          href="#productos"
          className="mt-8 inline-flex rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(110,193,228,0.35)] transition hover:scale-[1.02] hover:bg-sky-600"
        >
          Ver Productos
        </a>
      </div>
    </section>
  );
}
