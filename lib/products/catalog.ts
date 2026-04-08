export const PRODUCT_CATALOG = [
  {
    slug: "kits-escolares",
    title: "Kits escolares",
    description: "Sets personalizados con nombre, personaje y estilo favorito.",
    image: "https://placehold.co/600x450/8FD14F/ffffff?text=Kits+Escolares",
  },
  {
    slug: "candy-personalizados",
    title: "Candy personalizados",
    description: "Etiquetas y diseños para mesas dulces en cumpleaños y eventos.",
    image: "https://placehold.co/600x450/6EC1E4/ffffff?text=Candy+Bar",
  },
  {
    slug: "vinilo-textil",
    title: "Vinilo textil",
    description: "Aplicaciones para remeras, uniformes y prendas promocionales.",
    image: "https://placehold.co/600x450/B9A6F9/ffffff?text=Vinilo+Textil",
  },
  {
    slug: "vinilo-de-corte",
    title: "Vinilo de corte",
    description: "Rotulación para vidrieras, packaging y decoración de espacios.",
    image: "https://placehold.co/600x450/8FD14F/ffffff?text=Vinilo+de+Corte",
  },
  {
    slug: "encendedores-personalizados",
    title: "Encendedores personalizados",
    description: "Una opción original para souvenirs, marcas y regalos.",
    image: "https://placehold.co/600x450/6EC1E4/ffffff?text=Encendedores",
  },
  {
    slug: "vasos-personalizados",
    title: "Vasos personalizados",
    description: "Diseños únicos para fiestas, emprendimientos y promociones.",
    image: "https://placehold.co/600x450/B9A6F9/ffffff?text=Vasos",
  },
  {
    slug: "tarjetas-de-presentacion",
    title: "Tarjetas de presentación",
    description: "Transmití profesionalismo con identidad visual propia.",
    image: "https://placehold.co/600x450/8FD14F/ffffff?text=Tarjetas",
  },
  {
    slug: "stickers",
    title: "Stickers",
    description: "Ideales para packaging, branding y destacar tu emprendimiento.",
    image: "https://placehold.co/600x450/6EC1E4/ffffff?text=Stickers",
  },
] as const;

export type ProductSlug = (typeof PRODUCT_CATALOG)[number]["slug"];
