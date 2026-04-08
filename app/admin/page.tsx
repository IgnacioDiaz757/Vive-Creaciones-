"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Lock, LogOut, Trash2, UploadCloud } from "lucide-react";
import { ASPECT_OPTIONS, type AspectOption } from "@/lib/images/aspect";
import { PRODUCT_CATALOG } from "@/lib/products/catalog";

type SectionKey = "products" | "gallery";
type AdminImage = { name: string; url: string; aspect: AspectOption; productSlug?: string | null };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState<Record<SectionKey, AspectOption>>({
    products: "16x9",
    gallery: "16x9",
  });
  const [images, setImages] = useState<Record<SectionKey, AdminImage[]>>({
    products: [],
    gallery: [],
  });

  const loadImages = async (section: SectionKey) => {
    const response = await fetch(`/api/admin/images?section=${section}`);
    if (!response.ok) return;
    const data = (await response.json()) as { images?: AdminImage[] };
    setImages((current) => ({ ...current, [section]: data.images ?? [] }));
  };

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch("/api/admin/session");
      const data = (await response.json()) as { authenticated?: boolean };
      const isAuthenticated = Boolean(data.authenticated);
      setAuthenticated(isAuthenticated);
      if (isAuthenticated) {
        await Promise.all([loadImages("products"), loadImages("gallery")]);
      }
    };

    void checkSession();
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(data.error ?? "No se pudo iniciar sesión.");
      setLoading(false);
      return;
    }

    setAuthenticated(true);
    setPassword("");
    setLoading(false);
    setMessage("Sesión iniciada correctamente.");
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setMessage("Sesión cerrada.");
  };

  const handleUpload = async (section: SectionKey, file: File, productSlug?: string) => {
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("section", section);
    formData.append("aspect", selectedAspect[section]);
    if (productSlug) formData.append("productSlug", productSlug);
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(data.error ?? "No se pudo subir la imagen.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setMessage(
      section === "products"
        ? "Imagen subida para el producto seleccionado."
        : "Imagen subida para Galería de trabajos reales."
    );
    void loadImages(section);
  };

  const handleDelete = async (section: SectionKey, name: string) => {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/admin/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, name }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(data.error ?? "No se pudo eliminar la imagen.");
      setLoading(false);
      return;
    }
    setMessage("Imagen eliminada correctamente.");
    setLoading(false);
    void loadImages(section);
  };

  return (
    <main className="section-container py-12">
      <div className="bubble-card mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Admin</h1>

        {!authenticated ? (
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Password de administrador
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-brand-sky focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Ingresá la password"
                required
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-green px-5 py-3 text-sm font-bold text-slate-900 disabled:opacity-60 sm:w-auto"
            >
              <Lock className="size-4" />
              {loading ? "Validando..." : "Ingresar al panel"}
            </button>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  void loadImages("products");
                  void loadImages("gallery");
                }}
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                Cargar / refrescar imágenes
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </button>
            </div>

            <div className="bubble-card p-4">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Subir a Productos personalizados
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Elegí el producto exacto para asignarle su imagen.
              </p>
              <div className="mt-3">
                <p className="mb-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  Formato de la imagen
                </p>
                <select
                  value={selectedAspect.products}
                  onChange={(event) =>
                    setSelectedAspect((current) => ({
                      ...current,
                      products: event.target.value as AspectOption,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-auto"
                >
                  {ASPECT_OPTIONS.map((aspect) => (
                    <option key={aspect} value={aspect}>
                      {aspect}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4 grid gap-3">
                {PRODUCT_CATALOG.map((product) => {
                  const productImages = images.products.filter(
                    (image) => image.productSlug === product.slug
                  );
                  return (
                    <div
                      key={product.slug}
                      className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700"
                    >
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{product.title}</p>
                      <label className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-sky px-4 py-2 text-center text-sm font-semibold text-slate-900 hover:bg-sky-300 sm:w-auto sm:justify-start sm:text-left">
                        <UploadCloud className="size-4" />
                        Subir o reemplazar imagen para {product.title}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              void handleUpload("products", file, product.slug);
                            }
                            event.target.value = "";
                          }}
                          className="hidden"
                        />
                      </label>
                      <div className="mt-2 space-y-2">
                        {productImages.length === 0 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Sin imágenes subidas para este producto.
                          </p>
                        )}
                        {productImages.map((image) => (
                          <div
                            key={image.name}
                            className="flex flex-col gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <img
                                src={image.url}
                                alt={product.title}
                                className="h-12 w-16 rounded-lg object-cover"
                              />
                              <span className="truncate text-slate-700 dark:text-slate-200">
                                {image.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => void handleDelete("products", image.name)}
                              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-rose-500 px-2 py-2 text-xs font-semibold text-white sm:w-auto sm:py-1"
                            >
                              <Trash2 className="size-3.5" />
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bubble-card p-4">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Subir a Galería de trabajos reales
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Esta subida impacta en la galería de inspiración.
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                Para que quede perfecta en la card, usá formato 1:1 (cuadrado).
              </p>
              <div className="mt-3">
                <p className="mb-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  Formato de la imagen
                </p>
                <select
                  value={selectedAspect.gallery}
                  onChange={(event) =>
                    setSelectedAspect((current) => ({
                      ...current,
                      gallery: event.target.value as AspectOption,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-auto"
                >
                  {ASPECT_OPTIONS.map((aspect) => (
                    <option key={aspect} value={aspect}>
                      {aspect}
                    </option>
                  ))}
                </select>
              </div>
              <label className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-purple/80 px-4 py-2.5 text-center text-sm font-semibold text-slate-900 hover:bg-brand-purple sm:w-auto sm:justify-start sm:text-left">
                <UploadCloud className="size-4" />
                Subir foto a Galería
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleUpload("gallery", file);
                    }
                    event.target.value = "";
                  }}
                  className="hidden"
                />
              </label>
              <div className="mt-4 space-y-2">
                {images.gallery.map((image) => (
                  <div
                    key={image.name}
                    className="flex flex-col gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="h-12 w-16 rounded-lg object-cover"
                      />
                      <span className="truncate text-slate-700 dark:text-slate-200">
                        {image.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleDelete("gallery", image.name)}
                      className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-rose-500 px-2 py-2 text-xs font-semibold text-white sm:w-auto sm:py-1"
                    >
                      <Trash2 className="size-3.5" />
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {message && <p className="mt-4 text-sm font-medium text-sky-700 dark:text-sky-300">{message}</p>}
      </div>
    </main>
  );
}
