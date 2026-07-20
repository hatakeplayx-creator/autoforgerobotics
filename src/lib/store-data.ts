export function formatPrice(price: number | string | null | undefined): string {
  const amount = typeof price === "string" ? Number.parseFloat(price) : (price ?? 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(Number.isFinite(amount) ? amount : 0);
}
