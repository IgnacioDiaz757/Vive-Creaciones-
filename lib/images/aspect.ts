export const ASPECT_OPTIONS = ["16x9", "9x16", "4x3", "1x1"] as const;

export type AspectOption = (typeof ASPECT_OPTIONS)[number];

export function isAspectOption(value: string): value is AspectOption {
  return ASPECT_OPTIONS.includes(value as AspectOption);
}

export function getAspectClass(aspect: AspectOption) {
  if (aspect === "16x9") return "aspect-[16/9]";
  if (aspect === "9x16") return "aspect-[9/16]";
  if (aspect === "4x3") return "aspect-[4/3]";
  return "aspect-square";
}

export function getAspectFromName(name: string): AspectOption {
  if (name.includes("__9x16__")) return "9x16";
  if (name.includes("__4x3__")) return "4x3";
  if (name.includes("__1x1__")) return "1x1";
  return "16x9";
}

export function getProductSlugFromName(name: string) {
  const match = name.match(/__product-([a-z0-9-]+)__/);
  return match?.[1] ?? null;
}
