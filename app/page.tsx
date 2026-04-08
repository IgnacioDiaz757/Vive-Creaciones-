import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Gallery } from "@/sections/Gallery";
import { Products } from "@/sections/Products";
import { Services } from "@/sections/Services";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff,#f4fbff)] dark:bg-[radial-gradient(circle_at_top,#0f172a,#020617)]">
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Services />
        <Gallery />

        <section className="section-container py-16">
          <div className="bubble-card bg-gradient-to-r from-brand-sky/90 to-brand-purple/80 p-8 text-center md:p-12">
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">
              ¿Querés tu diseño personalizado?
            </h2>
            <p className="mt-3 text-white/95">
              Escribinos y contanos tu idea. Te ayudamos a crear algo único.
            </p>
            <a
              href="https://wa.me/5493513780509?text=Hola%20Vive!%20Creaciones,%20quiero%20mi%20dise%C3%B1o%20personalizado."
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-2xl bg-white px-7 py-3 text-sm font-bold text-sky-700 transition hover:scale-[1.02] dark:bg-slate-100"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
