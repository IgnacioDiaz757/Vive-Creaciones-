import { Camera, MessageCircleHeart } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="contacto"
      className="mt-20 border-t border-sky-100 bg-white/80 py-12 dark:border-slate-800 dark:bg-slate-950/80"
    >
      <div className="section-container grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-extrabold text-sky-700">
            Vive! <span className="text-brand-green">Creaciones</span>
          </h3>
          <p className="mt-3 max-w-xs text-sm text-slate-600 dark:text-slate-300">
            Diseño, impresión y personalización para emprendimientos, eventos y regalos
            creativos.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-100">
            Redes
          </h4>
          <div className="mt-3 flex items-center gap-3">
            <a
              href="https://instagram.com/vive_creaciones"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-brand-soft p-2 text-slate-700 hover:text-sky-700 dark:bg-slate-800 dark:text-slate-200"
              aria-label="Instagram vive_creaciones"
            >
              <Camera className="size-5" />
            </a>
            <a
              href="https://wa.me/5493513780509"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-brand-soft p-2 text-slate-700 hover:text-sky-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <MessageCircleHeart className="size-5" />
            </a>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">@vive_creaciones</p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-100">
            Contacto
          </h4>
          <a
            href="https://wa.me/5493513780509?text=Hola%20Vive!%20Creaciones,%20quiero%20hacer%20una%20consulta."
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_10px_20px_rgba(143,209,79,0.35)]"
          >
            <MessageCircleHeart className="size-4" />
            WhatsApp: +54 9 3513 780509
          </a>
        </div>
      </div>

      <div className="section-container mt-8 border-t border-sky-100 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © {new Date().getFullYear()} Vive! Creaciones. Todos los derechos reservados.
      </div>
    </footer>
  );
}
