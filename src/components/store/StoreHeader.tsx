import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Box, Heart, Minus, Plus, Search, ShoppingBag, Trash, User, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice } from "@/lib/store-data";

export function StoreHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { cartItems, itemCount, removeFromCart, updateQuantity, subtotal } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsCartOpen(false);
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) setIsAccountOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsMobileSearchOpen(false);
    window.location.assign(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitSearch(searchQuery);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    submitSearch(event.currentTarget.value);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/88 backdrop-blur-2xl">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="group flex min-w-0 shrink-0 items-center gap-2 sm:gap-3" aria-label="AutoForge Robotics home">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/15 bg-primary text-primary-foreground shadow-[var(--shadow-soft)] sm:h-11 sm:w-11">
            <Box className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent shadow-[0_0_18px_oklch(0.62_0.185_252)]" />
          </span>
          <span className="min-w-0 leading-none max-[430px]:hidden">
            <span className="block text-base font-black tracking-[0.12em] text-primary sm:text-lg">AUTOFORGE</span>
            <span className="block text-[8px] font-semibold uppercase tracking-[0.34em] text-muted-foreground sm:text-[9px] sm:tracking-[0.38em]">Robotics</span>
          </span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="relative hidden flex-1 md:block lg:max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search boards, sensors, motors, robotics kits"
            className="h-11 w-full rounded-full border border-border bg-card/90 pl-11 pr-4 text-sm shadow-sm outline-none transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_4px_oklch(0.62_0.185_252_/_12%)]"
          />
          <button type="submit" className="sr-only">Search</button>
        </form>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-primary sm:h-10 sm:w-10 md:hidden [&_svg]:pointer-events-none"
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
          </button>

          <Link
            to="/wishlist"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-primary sm:h-10 sm:w-10 [&_svg]:pointer-events-none"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
            {wishlistItems.length > 0 ? (
              <span className="pointer-events-none absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {wishlistItems.length}
              </span>
            ) : null}
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCartOpen((value) => !value)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-primary sm:h-10 sm:w-10 [&_svg]:pointer-events-none"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 ? (
                <span className="pointer-events-none absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {itemCount}
                </span>
              ) : null}
            </button>

            {isCartOpen ? (
              <div className="absolute right-0 mt-4 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-glass)] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Engineering cart</h3>
                    <p className="text-xs text-muted-foreground">{itemCount} selected items</p>
                  </div>
                  <button type="button" onClick={() => setIsCartOpen(false)} className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Close cart">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-9 text-center">
                    <ShoppingBag className="mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground">Your cart is ready for parts.</p>
                    <Link to="/shop" onClick={() => setIsCartOpen(false)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
                      Explore catalog <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div key={item.product.sku} className="flex gap-3">
                          <img src={item.product.image} alt={item.product.name} className="h-14 w-14 rounded-lg border border-border object-cover" />
                          <div className="min-w-0 flex-1">
                            <Link to="/shop/$sku" params={{ sku: item.product.sku }} onClick={() => setIsCartOpen(false)} className="line-clamp-2 text-xs font-bold text-foreground hover:text-accent">
                              {item.product.name}
                            </Link>
                            <p className="mt-1 text-[11px] text-muted-foreground">{formatPrice(item.product.price)}</p>
                            <div className="mt-2 inline-flex items-center rounded-full border border-border bg-secondary/50">
                              <button type="button" onClick={() => updateQuantity(item.product.sku, item.quantity - 1)} className="p-1.5 text-muted-foreground hover:text-foreground" aria-label="Decrease item quantity">
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-7 text-center text-[11px] font-bold">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.product.sku, item.quantity + 1)} className="p-1.5 text-muted-foreground hover:text-foreground" aria-label="Increase item quantity">
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeFromCart(item.product.sku)} className="h-fit rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label="Remove item">
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 space-y-3 border-t border-border pt-4">
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link to="/cart" onClick={() => setIsCartOpen(false)} className="flex items-center justify-center rounded-full border border-border py-2 text-xs font-bold hover:bg-secondary">
                          View cart
                        </Link>
                        <button type="button" onClick={() => { setIsCartOpen(false); navigate({ to: "/cart" }); }} className="flex items-center justify-center gap-2 rounded-full bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90">
                          Checkout <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>

          <div className="relative" ref={accountRef}>
            <button
              type="button"
              onClick={() => setIsAccountOpen((value) => !value)}
              className="flex h-9 items-center gap-2 rounded-full border border-border bg-card px-2 text-muted-foreground transition-colors hover:text-primary sm:h-10 sm:px-2.5 [&_svg]:pointer-events-none"
              aria-label="Account menu"
            >
              <User className="h-4 w-4" />
              <span className="hidden max-w-20 truncate text-xs font-semibold text-foreground lg:block">
                {isAuthenticated ? user?.name?.split(" ")[0] || "Account" : "Login"}
              </span>
            </button>
            {isAccountOpen ? (
              <div className="absolute right-0 mt-4 w-48 rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-glass)] animate-in fade-in slide-in-from-top-2 duration-200">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setIsAccountOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-secondary">Profile</Link>
                    <Link to="/orders" onClick={() => setIsAccountOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-secondary">Orders</Link>
                    <button type="button" onClick={() => { setIsAccountOpen(false); logout(); navigate({ to: "/login" }); }} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-secondary">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsAccountOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-secondary">Login</Link>
                    <Link to="/register" onClick={() => setIsAccountOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-secondary">Register</Link>
                    <Link to="/forgot-password" onClick={() => setIsAccountOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-secondary">Forgot password</Link>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {isMobileSearchOpen ? (
        <form onSubmit={handleSearchSubmit} className="mx-auto max-w-7xl px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search robotics parts"
              className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none focus:border-accent"
            />
          </div>
        </form>
      ) : null}
    </header>
  );
}
