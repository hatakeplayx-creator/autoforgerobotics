import { Link } from "@tanstack/react-router";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { formatPrice } from "@/lib/store-data";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import type { Product } from "@/types/store";
import fallbackProductImage from "@/assets/cat-dev-boards.jpg";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const productImage = product.images[0]?.media?.url || fallbackProductImage;
  const isOutOfStock = product.stockQuantity <= 0;
  const brand = product.brand || "AutoForge";
  const reviews = 0;

  const cartCompatibleProduct = {
    ...product,
    tag: brand,
    image: productImage,
    reviews,
    outOfStock: isOutOfStock,
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[var(--shadow-raised)]">
      <div className="relative bg-gradient-to-br from-secondary via-card to-secondary/40 p-3">
        <div className="flex items-center justify-between gap-2 pb-2">
          <span className="line-clamp-1 rounded-full border border-border bg-card/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {brand}
          </span>
          <button
            aria-label={isInWishlist(product.sku) ? "Remove from wishlist" : "Add to wishlist"}
            type="button"
            onClick={() => {
              if (isInWishlist(product.sku)) removeFromWishlist(product.sku);
              else addToWishlist(cartCompatibleProduct);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-sm transition-colors hover:text-accent"
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.sku) ? "fill-accent text-accent" : ""}`} />
          </button>
        </div>

        <Link to="/shop/$sku" params={{ sku: product.sku }} className="relative block overflow-hidden rounded-xl bg-white">
          {isOutOfStock ? (
            <span className="absolute left-3 top-3 z-10 rounded-full border border-border bg-card/95 px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
              Out of stock
            </span>
          ) : null}
          {product.featured ? (
            <span className="absolute right-3 top-3 z-10 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-accent-foreground shadow-sm">
              Featured
            </span>
          ) : null}
          <img
            src={productImage}
            alt={product.name}
            width={512}
            height={512}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackProductImage;
            }}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.055]"
          />
          <span className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 rounded-full bg-primary/92 px-3 py-2 text-xs font-bold text-primary-foreground opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Eye className="h-3.5 w-3.5" />
            Quick view
          </span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Link to="/shop/$sku" params={{ sku: product.sku }} className="line-clamp-2 min-h-11 text-sm font-bold leading-snug text-foreground transition-colors hover:text-accent">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span>SKU {product.sku}</span>
          <span className={isOutOfStock ? "text-destructive" : "text-success"}>{isOutOfStock ? "Unavailable" : "In stock"}</span>
        </div>

        <div className="mt-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className={`h-3.5 w-3.5 ${reviews > 0 && index < 4 ? "fill-accent text-accent" : "text-border"}`} />
          ))}
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-lg font-black tracking-tight text-foreground">{formatPrice(product.price)}</p>
            {product.compareAtPrice && product.compareAtPrice > product.price ? (
              <p className="text-[11px] text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</p>
            ) : null}
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Incl. GST</p>
          </div>
          {!isOutOfStock ? (
            <button
              type="button"
              onClick={() => addToCart(cartCompatibleProduct, 1)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-accent"
              aria-label="Add to cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
