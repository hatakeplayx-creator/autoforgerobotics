import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, MessageSquare, Minus, Plus, ShoppingCart, Star, Heart } from "lucide-react";
import { toast } from "sonner";
import { AnnouncementBar, TopBar } from "@/components/store/TopBar";
import { StoreHeader } from "@/components/store/StoreHeader";
import { NavBar } from "@/components/store/NavBar";
import { StoreFooter } from "@/components/store/StoreFooter";
import { ProductCard } from "@/components/store/ProductCard";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useProductDetails, useProducts } from "@/hooks/useStoreData";
import { formatPrice } from "@/lib/store-data";
import type { Product } from "@/types/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/shop/$sku")({
  component: ProductDetailsPage,
});

type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
};

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Rohan Sharma",
    rating: 5,
    date: "July 2, 2026",
    comment:
      "Excellent build quality. Highly reliable for industrial automation prototype projects. The delivery was fast too!",
    verified: true,
  },
  {
    id: "r2",
    author: "Ananya Iyer",
    rating: 4,
    date: "June 18, 2026",
    comment:
      "Works perfectly as described. Pinout documentation is neat and easy to follow. Deducted one star because the box was slightly dented.",
    verified: true,
  },
];

const RECENTLY_VIEWED_KEY = "recentlyViewedSkus";

function getProductBrand(product: Product) {
  if (product.brand) return product.brand;
  if (product.name.startsWith("AF")) return "AF";
  if (product.name.toLowerCase().includes("forge")) return "Forge";
  return "AutoForge";
}

function getSpecifications(product: Product): Record<string, string> {
  const name = product.name.toLowerCase();

  if (name.includes("printer")) {
    return {
      "Printing Technology": "FDM (Fused Deposition Modeling)",
      "Build Volume": "256 x 256 x 256 mm",
      "Max Hotend Temperature": "300 C",
      "Max Bed Temperature": "100 C",
      "Compatible Filaments": "PLA, PETG, TPU, ABS, Carbon Fiber",
      "Chamber Type": "Fully Enclosed",
      "Levelling System": "Auto Bed Levelling (Dual Sensor)",
    };
  }

  if (name.includes("microcontroller") || name.includes("fpga") || name.includes("sbc") || name.includes("compatible") || name.includes("board")) {
    return {
      "Core Processor": name.includes("rp2350") ? "Dual-core ARM Cortex-M33" : "High Performance RISC-V / ARM",
      "Operating Voltage": "3.3V DC (USB 5V Input)",
      "GPIO Pin Count": name.includes("carrier") ? "40 Pins" : "26-30 Pins",
      "Clock Speed": name.includes("carrier") ? "2.4 GHz" : "133 MHz-150 MHz",
      "On-Board Memory": name.includes("fpga") ? "16MB Flash, 256KB SRAM" : "8MB Flash, 520KB SRAM",
      "Interface Types": "I2C, SPI, UART, PWM, ADC",
      "Form Factor": "Compact Breadboard Friendly",
    };
  }

  if (name.includes("drone") || name.includes("motor")) {
    return {
      "Motor KV Rating": name.includes("280kv") ? "280 KV" : "120 KV",
      "Max Thrust": "12.5 kg per motor",
      "Recommended Propeller": "ForgeProp 22 x 7.0",
      "Stator Size": "8120 Stator core",
      "Recommended ESC": "80A-100A High Frequency ESC",
      "Operating Voltage Range": "6S - 12S LiPo Battery Pack",
      "Waterproof Level": "IPX7 Dust and Splash Protected",
    };
  }

  if (name.includes("sensor")) {
    return {
      "Sensor IC": "High Precision Ambient Light Sensor",
      "Communication Bus": "I2C Interface (Address 0x23)",
      "Spectral Response": "Close to human eye response",
      "Illuminance Range": "1 lx to 65535 lx",
      "Operating Voltage": "2.4V - 3.6V DC",
      "Pin Configuration": "VCC, GND, SCL, SDA, INT",
      "Operating Temperature": "-40 C to +85 C",
    };
  }

  return {
    "Model Number": `AF-${product.sku}`,
    "Voltage Specification": "5V DC Operating",
    Certification: "CE, RoHS Compliant",
    "Material Class": "FR4 Double Sided PCB",
    Dimensions: "58 mm x 24 mm x 8 mm",
    Weight: "12.5 grams",
    "Warranty Period": "1 Year Limited Manufacturer Warranty",
  };
}

function ProductDetailsPage() {
  const { sku } = Route.useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { data: product, loading: productLoading } = useProductDetails(sku);
  const { data: allProducts, loading: productsLoading } = useProducts();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ transform: "scale(1)", transformOrigin: "center" });
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    if (!product || !allProducts) return;

    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const parsed: string[] = saved ? JSON.parse(saved) : [];

    const currentSkus = [product.sku, ...parsed.filter((savedSku) => savedSku !== product.sku)].slice(0, 5);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(currentSkus));

    const resolvedProducts = currentSkus
      .map((savedSku) => allProducts.find((candidate) => candidate.sku === savedSku))
      .filter((candidate): candidate is Product => !!candidate && candidate.sku !== product.sku);

    setRecentlyViewed(resolvedProducts);
    setQuantity(1);
    setActiveImageIndex(0);
    setZoomStyle({ transform: "scale(1)", transformOrigin: "center" });
  }, [product, allProducts]);

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter((candidate) => {
        return (
          candidate.sku !== product.sku &&
          (getProductBrand(candidate) === getProductBrand(product))
        );
      })
      .slice(0, 4);
  }, [allProducts, product]);

  if (productLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <TopBar />
        <StoreHeader />
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 bg-card border border-border rounded-xl p-5 md:p-8 shadow-sm">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="flex gap-3">
                <Skeleton className="h-20 w-20 rounded" />
                <Skeleton className="h-20 w-20 rounded" />
                <Skeleton className="h-20 w-20 rounded" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-5/6" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
        <StoreFooter />
      </div>
    );
  }

  if (!product || !allProducts) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <TopBar />
        <StoreHeader />
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 py-12">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Product not found.</p>
            <Button className="mt-4" onClick={() => navigate({ to: "/shop" })}>
              Back to Shop
            </Button>
          </div>
        </main>
        <StoreFooter />
      </div>
    );
  }

  const brandName = getProductBrand(product);
  const specifications = getSpecifications(product);
  const productImage = product.images[0]?.media?.url || "/assets/cat-dev-boards.jpg";
  const galleryImages = [
    { url: productImage, label: "Front View", style: {} },
    { url: productImage, label: "Rear View", style: { transform: "scaleX(-1)" } },
    { url: productImage, label: "Detail View", style: { transform: "rotate(90deg) scale(1.1)" } },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transform: "scale(2.2)", transformOrigin: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: "scale(1)", transformOrigin: "center" });
  };

  const cartCompatibleProduct = {
    ...product,
    tag: brandName,
    image: productImage,
    reviews: 0,
    outOfStock: product.stockQuantity <= 0,
  };

  const handleAddToCart = () => {
    addToCart(cartCompatibleProduct, quantity);
    toast.success(`Added ${quantity}x "${product.name}" to your cart.`);
  };

  const handleBuyNow = () => {
    addToCart(cartCompatibleProduct, quantity);
    toast.success(`Proceeding to checkout with ${quantity}x "${product.name}".`);
    navigate({ to: "/cart" });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      toast.error("Please fill in your name and comment.");
      return;
    }

    const review: Review = {
      id: Math.random().toString(36).slice(2),
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: "Today",
      comment: newReviewComment.trim(),
      verified: false,
    };

    setReviews((prev) => [review, ...prev]);
    setNewReviewAuthor("");
    setNewReviewRating(5);
    setNewReviewComment("");
    toast.success("Thank you! Your review has been posted.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" closeButton richColors />
      <AnnouncementBar />
      <TopBar />
      <StoreHeader />
      <NavBar />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/shop">Shop</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-[200px]">{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-8 md:grid-cols-2 bg-card border border-border rounded-xl p-5 md:p-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <div
              className="relative aspect-square w-full overflow-hidden rounded-lg bg-secondary border border-border cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={galleryImages[activeImageIndex].url}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-75 pointer-events-none"
                style={{ ...zoomStyle, ...galleryImages[activeImageIndex].style }}
              />
              {product.featured ? (
                <Badge className="absolute right-4 top-4 z-10 bg-accent text-accent-foreground">Featured</Badge>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              {galleryImages.map((img, index) => {
                const isActive = activeImageIndex === index;
                return (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(index);
                      setZoomStyle({ transform: "scale(1)", transformOrigin: "center" });
                    }}
                    className={`relative w-20 h-20 aspect-square overflow-hidden rounded-md border-2 bg-secondary transition-all cursor-pointer ${
                      isActive ? "border-primary shadow-md scale-105" : "border-border hover:border-muted-foreground/60"
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" style={img.style} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col">
            <Badge variant="secondary" className="w-fit text-xs font-semibold uppercase tracking-wider mb-1">
              {brandName}
            </Badge>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight leading-snug md:text-3xl">{product.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
              <p className="text-muted-foreground">
                SKU: <strong className="text-foreground">{product.sku}</strong>
              </p>
              <span className="text-border">|</span>
              <p className="text-muted-foreground">
                Brand: <strong className="text-foreground">{brandName}</strong>
              </p>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" />
                ))}
                <span className="text-muted-foreground ml-1">({reviews.length} Customer Reviews)</span>
              </div>
            </div>

            <hr className="border-border my-5" />

            <div className="mb-4">
              <span className="text-3xl font-black text-foreground">{formatPrice(product.price)}</span>
              <span className="text-xs text-muted-foreground ml-2">(Inclusive of GST)</span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              {product.stockQuantity <= 0 ? (
                <span className="flex items-center gap-1.5 rounded-full bg-destructive/10 border border-destructive/20 px-3 py-1 text-xs font-semibold text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Out of Stock
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  In Stock - Ready to Ship ({product.stockQuantity} available)
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground mb-6">
              High-performance maker component designed specifically for industrial, educational, and developer setups.
              Engineered for optimal compatibility and rigorous hardware specifications.
            </p>

            {product.stockQuantity > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity:</span>
                  <div className="flex items-center rounded-lg border border-border bg-secondary/30 h-10 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="p-2 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-4 text-sm font-semibold select-none min-w-8 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="p-2 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row pt-2">
                  <Button onClick={handleAddToCart} variant="secondary" className="flex-1 h-12 border border-border">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button onClick={handleBuyNow} className="flex-1 h-12">
                    Buy Now
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      if (isInWishlist(product.sku)) {
                        removeFromWishlist(product.sku);
                      } else {
                        addToWishlist(cartCompatibleProduct);
                      }
                    }}
                    className="h-12 w-12"
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(product.sku) ? "fill-accent text-accent" : ""}`} />
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8 bg-card border border-border rounded-xl p-5 md:p-8 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-foreground border-b border-border pb-3 mb-4">Product Description</h2>
              <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  This AutoForge component is designed as a dependable hardware platform for innovators and makers.
                  It focuses on stability, compatibility, and practical deployment in real projects.
                </p>
                <p>
                  Refer to the technical specifications below before integration to verify voltage tolerance, dimensions,
                  and interface compatibility with your setup.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground border-b border-border pb-3 mb-4">Technical Specifications</h2>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <tbody>
                    {Object.entries(specifications).map(([key, value], index) => (
                      <tr
                        key={key}
                        className={`${
                          index % 2 === 0 ? "bg-secondary/20" : "bg-transparent"
                        } border-b border-border last:border-b-0`}
                      >
                        <td className="p-3 font-semibold text-foreground w-1/3 border-r border-border">{key}</td>
                        <td className="p-3 text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8 bg-card border border-border rounded-xl p-5 md:p-8 shadow-sm h-fit">
            <div>
              <h2 className="text-lg font-bold text-foreground border-b border-border pb-3 mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>Customer Reviews ({reviews.length})</span>
              </h2>

              <form onSubmit={handleSubmitReview} className="mb-6 bg-secondary/30 border border-border rounded-lg p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Write a Review</h3>
                <div>
                  <label className="block text-[10px] text-muted-foreground font-semibold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Rahul Patel"
                    className="w-full h-8 text-xs border border-border bg-card rounded px-2.5 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground font-semibold mb-1">Rating</label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const ratingValue = index + 1;
                      const isSelected = newReviewRating >= ratingValue;
                      return (
                        <button
                          type="button"
                          key={ratingValue}
                          onClick={() => setNewReviewRating(ratingValue)}
                          className={`transition-colors ${isSelected ? "text-accent" : "text-border"}`}
                        >
                          <Star className="h-4 w-4 fill-current" />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground font-semibold mb-1">Comment</label>
                  <textarea
                    required
                    rows={3}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Share your experience with this component..."
                    className="w-full text-xs border border-border bg-card rounded p-2.5 outline-none focus:border-primary resize-none transition-colors"
                  />
                </div>
                <Button type="submit" size="sm" className="w-full">
                  Submit Review
                </Button>
              </form>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span>{review.author}</span>
                        {review.verified ? (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-1 rounded font-semibold">Verified</span>
                        ) : null}
                      </h4>
                      <span className="text-[10px] text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-accent mt-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-3 w-3 ${index < review.rating ? "fill-current" : "text-border"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <section className="mt-12">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">Related Products</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.sku} product={item} />
              ))}
            </div>
          </section>
        ) : null}

        {recentlyViewed.length > 0 ? (
          <section className="mt-12">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">Recently Viewed Items</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {recentlyViewed.map((item) => (
                <ProductCard key={item.sku} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <StoreFooter />
    </div>
  );
}
