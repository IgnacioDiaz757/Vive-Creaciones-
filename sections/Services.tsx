import { BrushCleaning, Printer, Store } from "lucide-react";

const services = [
  {
    title: "Diseño personalizado",
    description:
      "Creamos propuestas visuales alineadas a tu estilo, evento o identidad de marca.",
    icon: BrushCleaning,
    color: "bg-brand-green/25 text-lime-700",
  },
  {
    title: "Impresión DTF",
    description:
      "Calidad y durabilidad para estampados en prendas, ideal para uso diario o comercial.",
    icon: Printer,
    color: "bg-brand-sky/25 text-sky-700",
  },
  {
    title: "Producción para emprendimientos",
    description:
      "Soluciones integrales para packaging, etiquetas, papelería y material promocional.",
    icon: Store,
    color: "bg-brand-purple/25 text-violet-700",
  },
];

export function Services() {
  return (
    <section id="servicios" className="section-container py-16">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Servicios</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl">
          Acompañamos tus ideas de punta a punta
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="bubble-card p-6">
            <div className={`inline-flex rounded-2xl p-3 ${service.color}`}>
              <service.icon className="size-6" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
              {service.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
