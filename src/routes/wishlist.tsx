import { createFileRoute, Link } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/store-data";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            Wishlist
          </h1>
          <p className="mt-2 text-muted-foreground">
            You have {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} in your wishlist.
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">Your wishlist is empty</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Add items to your wishlist to save them for later.
            </p>
            <Button className="mt-6" asChild>
              <Link to="/shop">Browse Shop</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((product) => (
              <div key={product.sku} className="rounded-xl border border-border bg-card overflow-hidden">
                <Link to="/shop/$sku" params={{ sku: product.sku }} className="block">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-48 w-full object-cover"
                  />
                </Link>
                <div className="p-4 space-y-3">
                  <Link to="/shop/$sku" params={{ sku: product.sku }} className="block">
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      disabled={product.outOfStock}
                      onClick={() => addToCart(product, 1)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFromWishlist(product.sku)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StorePageShell>
  );
}
