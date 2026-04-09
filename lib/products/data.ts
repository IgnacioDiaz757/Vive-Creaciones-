import { createClient } from "@supabase/supabase-js";
import { PRODUCT_CATALOG, type ProductSlug } from "@/lib/products/catalog";

type ProductDetailRow = {
  slug: string;
  price: string | null;
  short_description: string | null;
};
type ProductSubcardRow = {
  id: string;
  product_slug: string;
  title: string;
  price: string | null;
  description: string | null;
  image_url: string | null;
};
type ProductSubcardModel = {
  id: string;
  title: string;
  price: string | null;
  description: string | null;
  imageUrl: string;
  images: string[];
};

type ProductDetailModel = {
  slug: string;
  title: string;
  description: string;
  image: string;
  price: string | null;
  shortDescription: string;
  images: string[];
  subcards: ProductSubcardModel[];
};

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) return null;
  return createClient(supabaseUrl, serviceRole);
}

function getProductDetailsMap(rows: ProductDetailRow[] | null) {
  const detailsMap = new Map<string, { price: string | null; shortDescription: string | null }>();
  (rows ?? []).forEach((row) => {
    detailsMap.set(row.slug, {
      price: row.price,
      shortDescription: row.short_description,
    });
  });
  return detailsMap;
}

function sortImageNamesByNewest(names: string[]) {
  return [...names].sort((a, b) => b.localeCompare(a));
}

export async function getProductsSummary() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return PRODUCT_CATALOG.map((product) => ({ ...product, price: null, images: [product.image] }));
  }

  const [{ data: files }, { data: detailRows }] = await Promise.all([
    supabase.storage.from("product-images").list("", { limit: 500 }),
    supabase.from("product_details").select("slug, price, short_description"),
  ]);

  const detailsMap = getProductDetailsMap((detailRows as ProductDetailRow[] | null) ?? null);
  const names = sortImageNamesByNewest((files ?? []).map((file) => file.name));

  return PRODUCT_CATALOG.map((product) => {
    const productImageNames = names.filter((name) => name.includes(`__product-${product.slug}__`));
    const images = productImageNames.map(
      (name) => supabase.storage.from("product-images").getPublicUrl(name).data.publicUrl
    );
    const detail = detailsMap.get(product.slug);
    return {
      ...product,
      image: images[0] ?? product.image,
      images: images.length > 0 ? images : [product.image],
      description: detail?.shortDescription || product.description,
      price: detail?.price ?? null,
    };
  });
}

export async function getProductDetail(slug: string): Promise<ProductDetailModel | null> {
  const catalogProduct = PRODUCT_CATALOG.find((product) => product.slug === slug);
  if (!catalogProduct) return null;

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return {
      ...catalogProduct,
      price: null,
      shortDescription: catalogProduct.description,
      images: [catalogProduct.image],
      subcards: [],
    };
  }

  const [{ data: files }, { data: detail }] = await Promise.all([
    supabase.storage.from("product-images").list("", { limit: 500 }),
    supabase
      .from("product_details")
      .select("slug, price, short_description")
      .eq("slug", slug)
      .maybeSingle(),
  ]);
  const { data: subcardsRows } = await supabase
    .from("product_subcards")
    .select("id, product_slug, title, price, description, image_url")
    .eq("product_slug", slug)
    .order("created_at", { ascending: false });

  const imageNames = sortImageNamesByNewest(
    (files ?? [])
      .map((file) => file.name)
      .filter((name) => name.includes(`__product-${slug}__`) && !name.includes("__subcard-"))
  );

  const images = imageNames.map(
    (name) => supabase.storage.from("product-images").getPublicUrl(name).data.publicUrl
  );

  return {
    ...catalogProduct,
    price: (detail as ProductDetailRow | null)?.price ?? null,
    shortDescription:
      (detail as ProductDetailRow | null)?.short_description || catalogProduct.description,
    images: images.length > 0 ? images : [catalogProduct.image],
    subcards:
      ((subcardsRows as ProductSubcardRow[] | null) ?? []).map((card) => {
        const subcardImageNames = sortImageNamesByNewest(
          (files ?? [])
            .map((file) => file.name)
            .filter((name) => name.includes(`__subcard-${card.id}__`))
        );
        const subcardImages = subcardImageNames.map(
          (name) => supabase.storage.from("product-images").getPublicUrl(name).data.publicUrl
        );
        const fallback = card.image_url || catalogProduct.image;
        return {
          id: card.id,
          title: card.title,
          price: card.price,
          description: card.description,
          imageUrl: fallback,
          images: subcardImages.length > 0 ? subcardImages : [fallback],
        };
      }) ?? [],
  };
}

export function isValidProductSlug(slug: string): slug is ProductSlug {
  return PRODUCT_CATALOG.some((product) => product.slug === slug);
}
