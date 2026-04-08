import { MessageCircleHeart } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/5493513780509?text=Hola%20Vive!%20Creaciones,%20quiero%20mi%20dise%C3%B1o%20personalizado."
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-3 text-sm font-bold text-slate-900 shadow-[0_14px_30px_rgba(143,209,79,0.5)] transition hover:scale-105"
      aria-label="Abrir WhatsApp"
    >
      <MessageCircleHeart className="size-5" />
      WhatsApp
    </a>
  );
}
