import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "@/lib/store-data";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import type { Product } from "@/types/store";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const productImage = product.images[0]?.media?.url || "/assets/cat-dev-boards.jpg";
  const isOutOfStock = product.stockQuantity <= 0;
  const brand = product.brand || "AutoForge";
  const reviews = 0; // For now, since backend doesn't have reviews yet

  // Create a compatible product for cart (since useCart expects old Product type temporarily)
  const cartCompatibleProduct = {
    ...product,
    tag: brand,
    image: productImage,
    reviews,
    outOfStock: isOutOfStock,
  };

  return (
    <div className="group flex h-full flex-col rounded-lg border border-border bg-card p-3 shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-200 hover:border-primary/25 hover:shadow-[var(--shadow-raised)]">
      <div className="mb-1 flex items-start justify-between gap-2">
        <span className="line-clamp-1 text-xs font-medium text-muted-foreground">{brand}</span>
        <button
          aria-label={isInWishlist(product.sku) ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => {
            if (isInWishlist(product.sku)) {
              removeFromWishlist(product.sku);
            } else {
              addToWishlist(cartCompatibleProduct);
            }
          }}
          className="shrink-0 text-muted-foreground hover:text-accent cursor-pointer transition-colors"
        >
          <Heart className={`h-4 w-4 ${isInWishlist(product.sku) ? "fill-accent text-accent" : ""}`} />
        </button>
      </div>

      <Link to="/shop/$sku" params={{ sku: product.sku }} className="relative block">
        {isOutOfStock && (
          <span className="absolute left-2 top-2 z-10 rounded bg-muted/95 border border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            Out of Stock
          </span>
        )}
        {product.featured && (
          <span className="absolute right-2 top-2 z-10 rounded bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground shadow-sm">
            Featured
          </span>
        )}
        <img
          src={productImage}
          alt={product.name}
          width={512}
          height={512}
          loading="lazy"
          onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/assets/cat-dev-boards.jpg"; }}
          className="aspect-square w-full rounded object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>

      <Link
        to="/shop/$sku"
        params={{ sku: product.sku }}
        className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-foreground hover:text-primary transition-colors"
      >
        {product.name}
      </Link>
      <p className="mt-1 text-xs text-muted-foreground">SKU: {product.sku}</p>

      <div className="mt-1 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              reviews > 0 && i < 4 ? "fill-accent text-accent" : "text-border"
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground">({reviews})</span>
      </div>

      <div className="mt-2 flex items-end justify-between gap-2 pt-1">
        <div>
          <p className="text-base font-bold text-foreground">{formatPrice(product.price)}</p>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <p className="text-[11px] line-through text-muted-foreground">{formatPrice(product.compareAtPrice)}</p>
          )}
          <p className="text-[11px] text-muted-foreground">(Incl. GST)</p>
        </div>
        {!isOutOfStock && (
          <button
            onClick={() => addToCart(cartCompatibleProduct, 1)}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
