"use client";

import { Heart, Menu, MessageCircleHeart, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Productos", href: "#productos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Galería", href: "#galeria" },
  { label: "Contacto", href: "#contacto" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideMenu = mobileMenuRef.current?.contains(target) ?? false;
      const clickedToggle = mobileToggleRef.current?.contains(target) ?? false;
      if (!clickedInsideMenu && !clickedToggle) {
        setMobileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("pointerdown", handleOutsideClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("pointerdown", handleOutsideClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-[70] border-b border-white/70 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <nav className="section-container relative z-[71] flex h-20 items-center justify-between">
        <a href="#inicio" className="inline-flex items-center gap-3">
          <Image
            src="/Diseño sin título.png"
            alt="Logo Vive! Creaciones"
            width={76}
            height={76}
            priority
            className="h-16 w-16 rounded-xl object-contain md:h-20 md:w-20"
          />
          <span className="text-base font-extrabold text-sky-700 sm:text-lg md:text-2xl">
            Vive! <span className="text-brand-green dark:text-lime-300">Creaciones</span>
          </span>
        </a>

        <ul className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-700 transition hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="relative z-[72] flex shrink-0 items-center gap-2 pointer-events-auto">
          <ThemeToggle />
          <button
            ref={mobileToggleRef}
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <a
            href="https://wa.me/5493513780509?text=Hola%20Vive!%20Creaciones,%20quiero%20consultar%20por%20sus%20productos."
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-2xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_10px_20px_rgba(143,209,79,0.35)] transition hover:scale-[1.02] hover:bg-lime-400 lg:inline-flex"
          >
            <MessageCircleHeart className="size-4" />
            WhatsApp
          </a>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-[69] bg-slate-950/25 lg:hidden">
            <div
              ref={mobileMenuRef}
              className="section-container absolute left-0 right-0 top-[5.25rem]"
            >
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(16,32,51,0.12)] dark:border-slate-800 dark:bg-slate-900">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={`mobile-${link.href}`}>
                      <a
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-sky-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                  <li className="pt-1">
                    <a
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl bg-brand-purple/30 px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-brand-purple/45 dark:text-violet-300"
                    >
                      <Heart className="size-4" />
                      Acceso Admin
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
