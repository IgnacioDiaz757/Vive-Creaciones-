"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getAspectFromName, type AspectOption } from "@/lib/images/aspect";
import Image from "next/image";
import { useEffect, useState } from "react";

type UploadedImage = { url: string; aspect: AspectOption };

export function Gallery() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { data, error: listError } = await supabase.storage
        .from("gallery-images")
        .list("", { limit: 100 });

      if (listError || !data) {
        setFetchError("No se pudieron cargar imágenes de galería.");
        return;
      }

      const images = data
        .filter((file) => Boolean(file.name))
        .map((file) => ({
          url: supabase.storage.from("gallery-images").getPublicUrl(file.name).data.publicUrl,
          aspect: getAspectFromName(file.name),
        }));

      setUploadedImages(images);
    };

    void fetchImages();
  }, []);

  return (
    <section id="galeria" className="section-container py-16">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Galería</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl">
          Inspiración de trabajos reales
        </h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Formato ideal para la card: <span className="font-semibold">1:1 (cuadrado)</span>.
          También podés subir otros formatos y se ajustan automáticamente con recorte.
        </p>
      </div>
      {fetchError && <p className="mb-3 text-sm text-rose-600">{fetchError}</p>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {uploadedImages.map((image, index) => (
          <div key={`${image.url}-${index}`} className="bubble-card overflow-hidden p-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <Image
                src={image.url}
                alt={`Trabajo destacado ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
