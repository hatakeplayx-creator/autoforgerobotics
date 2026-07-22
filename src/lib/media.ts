import { resolveMediaUrl } from "@/services/api";

export type MediaVariant = "productCard" | "productDetail" | "categoryCard" | "brandLogo" | "homepageHero" | "adminThumbnail";

const transformations: Record<MediaVariant, string> = {
  productCard: "f_auto,q_auto,c_limit,w_640,h_640",
  productDetail: "f_auto,q_auto,c_limit,w_1600,h_1600",
  categoryCard: "f_auto,q_auto,c_limit,w_800,h_600",
  brandLogo: "f_auto,q_auto,c_limit,w_480,h_240",
  homepageHero: "f_auto,q_auto,c_limit,w_2400,h_1400",
  adminThumbnail: "f_auto,q_auto,c_limit,w_480,h_480",
};

export function mediaVariantUrl(url: string | null | undefined, variant: MediaVariant): string {
  const resolved = resolveMediaUrl(url);
  if (!/^https:\/\/res\.cloudinary\.com\//i.test(resolved)) return resolved;
  return resolved.replace(/\/image\/upload\//, `/image/upload/${transformations[variant]}/`);
}
