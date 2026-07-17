import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Cog, Heart, ShoppingCart, User, Search, Trash, ArrowRight, X, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice } from "@/lib/store-data";
import type { ShopSearch } from "@/types/store";

export function StoreHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { cartItems, itemCount, removeFromCart, updateQuantity, subtotal } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { wishlistItems, isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    navigate({
      to: "/shop",
      search: (prev: ShopSearch) => ({
        ...prev,
        q: searchQuery,
      }),
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary shadow-[var(--shadow-soft)]">
            <Cog className="h-5 w-5 text-primary-foreground animate-spin-slow" />
          </span>
          <span className="leading-none select-none">
            <span className="block text-lg font-black tracking-tight text-primary">AUTOFORGE</span>
            <span className="block text-[8px] font-bold uppercase tracking-[0.3em] text-accent">Robotics</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden max-w-md flex-1 md:block">
          <input
            type="search"
            placeholder="Search microcontrollers, sensors, drone parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-full border border-border bg-secondary/50 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-background transition-colors"
          />
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <button type="submit" className="sr-only">Search</button>
        </form>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            className="block md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => {
              const q = prompt("Enter search query:");
              if (q) {
                navigate({
                  to: "/shop",
                  search: (prev: ShopSearch) => ({ ...prev, q }),
                });
              }
            }}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Heart className="h-5 w-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart Icon with Live Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              aria-label="Open cart dropdown"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground animate-in zoom-in duration-300">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mini Cart Dropdown Popover */}
            {isCartOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-raised)] animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-sm font-bold text-foreground">Shopping Cart ({itemCount})</h3>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ShoppingCart className="h-8 w-8 text-muted-foreground/60 stroke-1 mb-2" />
                    <p className="text-xs font-semibold text-muted-foreground">Your cart is empty</p>
                    <Link
                      to="/shop"
                      onClick={() => setIsCartOpen(false)}
                      className="mt-3 text-[11px] font-bold text-primary hover:underline"
                    >
                      Shop Components
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Cart Items List */}
                    <div className="mt-3 max-h-56 overflow-y-auto space-y-3 pr-1">
                      {cartItems.map((item) => (
                        <div key={item.product.sku} className="flex gap-3 items-start group">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-12 w-12 rounded object-cover border border-border"
                          />
                          <div className="flex-1 min-w-0">
                            <Link
                              to="/shop/$sku"
                              params={{ sku: item.product.sku }}
                              onClick={() => setIsCartOpen(false)}
                              className="block text-xs font-bold text-foreground hover:text-primary truncate"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {item.quantity} x {formatPrice(item.product.price)}
                            </p>
                            <div className="mt-1.5 inline-flex items-center rounded-md border border-border bg-secondary/30 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.sku, item.quantity - 1)}
                                className="px-1.5 py-0.5 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Decrease item quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-6 text-center text-[10px] font-bold text-foreground">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.sku, item.quantity + 1)}
                                className="px-1.5 py-0.5 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Increase item quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.sku)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-secondary cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>Subtotal:</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/cart"
                          onClick={() => setIsCartOpen(false)}
                          className="flex items-center justify-center rounded-lg border border-input py-2 text-xs font-bold hover:bg-secondary cursor-pointer transition-colors"
                        >
                          View Cart
                        </Link>
                        <button
                          onClick={() => {
                            setIsCartOpen(false);
                            navigate({ to: "/cart" });
                          }}
                          className="flex items-center justify-center gap-1 rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/95 cursor-pointer transition-colors shadow-sm"
                        >
                          <span>Checkout</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* User Account */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setIsAccountOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-full border border-border p-1 pr-2.5 hover:bg-secondary/40 transition-colors"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
                <User className="h-4 w-4 text-foreground" />
              </span>
              <span className="hidden text-xs font-semibold text-foreground lg:block">
                {isAuthenticated ? user?.name?.split(" ")[0] || "Account" : "Login"}
              </span>
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 mt-3 w-44 rounded-xl border border-border bg-card p-2 shadow-[var(--shadow-raised)] animate-in fade-in slide-in-from-top-3 duration-200">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsAccountOpen(false)}
                      className="block rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsAccountOpen(false)}
                      className="block rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                    >
                      Orders
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountOpen(false);
                        logout();
                        navigate({ to: "/login" });
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left text-xs font-semibold text-destructive hover:bg-secondary"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsAccountOpen(false)}
                      className="block rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsAccountOpen(false)}
                      className="block rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                    >
                      Register
                    </Link>
                    <Link
                      to="/forgot-password"
                      onClick={() => setIsAccountOpen(false)}
                      className="block rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                    >
                      Forgot Password
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
