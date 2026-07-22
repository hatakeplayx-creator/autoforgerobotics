import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2, FileText, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { AnnouncementBar, TopBar } from "@/components/store/TopBar";
import { StoreHeader } from "@/components/store/StoreHeader";
import { NavBar } from "@/components/store/NavBar";
import { StoreFooter } from "@/components/store/StoreFooter";
import { ProductCard } from "@/components/store/ProductCard";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useProductDetails, useProducts } from "@/hooks/useStoreData";
import { mediaVariantUrl } from "@/lib/media";
import { formatPrice } from "@/lib/store-data";
import type { Product } from "@/types/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import fallbackProductImage from "@/assets/cat-dev-boards.jpg";

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
    comment: "Excellent build quality. Highly reliable for industrial automation prototype projects. The delivery was fast too.",
    verified: true,
  },
  {
    id: "r2",
    author: "Ananya Iyer",
    rating: 4,
    date: "June 18, 2026",
    comment: "Works perfectly as described. Pinout documentation is neat and easy to follow.",
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
      "Printing technology": "FDM fused deposition modeling",
      "Build volume": "256 x 256 x 256 mm",
      "Max hotend temperature": "300 C",
      "Max bed temperature": "100 C",
      "Compatible filaments": "PLA, PETG, TPU, ABS, Carbon Fiber",
      "Chamber type": "Fully enclosed",
      "Levelling system": "Auto bed levelling",
    };
  }
  if (name.includes("microcontroller") || name.includes("fpga") || name.includes("sbc") || name.includes("compatible") || name.includes("board")) {
    return {
      "Core processor": name.includes("rp2350") ? "Dual-core ARM Cortex-M33" : "High performance RISC-V / ARM",
      "Operating voltage": "3.3V DC, USB 5V input",
      "GPIO pin count": name.includes("carrier") ? "40 pins" : "26-30 pins",
      "Clock speed": name.includes("carrier") ? "2.4 GHz" : "133 MHz-150 MHz",
      "On-board memory": name.includes("fpga") ? "16MB Flash, 256KB SRAM" : "8MB Flash, 520KB SRAM",
      "Interfaces": "I2C, SPI, UART, PWM, ADC",
      "Form factor": "Compact breadboard friendly",
    };
  }
  if (name.includes("drone") || name.includes("motor")) {
    return {
      "Motor KV rating": name.includes("280kv") ? "280 KV" : "120 KV",
      "Max thrust": "12.5 kg per motor",
      "Recommended propeller": "ForgeProp 22 x 7.0",
      "Stator size": "8120 stator core",
      "Recommended ESC": "80A-100A high frequency ESC",
      "Operating voltage": "6S - 12S LiPo battery pack",
      "Protection": "IPX7 dust and splash protected",
    };
  }
  if (name.includes("sensor")) {
    return {
      "Sensor IC": "High precision ambient light sensor",
      "Communication bus": "I2C interface",
      "Spectral response": "Close to human eye response",
      "Illuminance range": "1 lx to 65535 lx",
      "Operating voltage": "2.4V - 3.6V DC",
      "Pin configuration": "VCC, GND, SCL, SDA, INT",
      "Operating temperature": "-40 C to +85 C",
    };
  }
  return {
    "Model number": `AF-${product.sku}`,
    "Voltage specification": "5V DC operating",
    Certification: "CE, RoHS compliant",
    "Material class": "FR4 double sided PCB",
    Dimensions: "58 mm x 24 mm x 8 mm",
    Weight: "12.5 grams",
    Warranty: "1 year limited manufacturer warranty",
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
    setRecentlyViewed(currentSkus.map((savedSku) => allProducts.find((candidate) => candidate.sku === savedSku)).filter((candidate): candidate is Product => !!candidate && candidate.sku !== product.sku));
    setQuantity(1);
    setActiveImageIndex(0);
    setZoomStyle({ transform: "scale(1)", transformOrigin: "center" });
  }, [product, allProducts]);

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts.filter((candidate) => candidate.sku !== product.sku && getProductBrand(candidate) === getProductBrand(product)).slice(0, 4);
  }, [allProducts, product]);

  if (productLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <TopBar />
        <StoreHeader />
        <NavBar />
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
          <Skeleton className="h-8 w-72" />
          <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
            <Skeleton className="h-[38rem] rounded-[2rem]" />
            <Skeleton className="h-[32rem] rounded-[2rem]" />
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
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Product not found.</p>
            <Button className="mt-4" onClick={() => navigate({ to: "/shop" })}>Back to shop</Button>
          </div>
        </main>
        <StoreFooter />
      </div>
    );
  }

  const brandName = getProductBrand(product);
  const specifications = getSpecifications(product);
  const productImage = mediaVariantUrl(product.images[0]?.media?.url, "productDetail") || fallbackProductImage;
  const galleryImages = product.images.length
    ? product.images.map((image,index)=>({url:mediaVariantUrl(image.media.url,"productDetail"),label:image.media.altText||`${product.name} image ${index+1}`,style:{}}))
    : [{url:productImage,label:product.name,style:{}}];
  const isOutOfStock = product.stockQuantity <= 0;
  const cartCompatibleProduct = { ...product, tag: brandName, image: productImage, reviews: 0, outOfStock: isOutOfStock };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    setZoomStyle({ transform: "scale(2.1)", transformOrigin: `${((event.clientX - left) / width) * 100}% ${((event.clientY - top) / height) * 100}%` });
  };

  const handleAddToCart = () => addToCart(cartCompatibleProduct, quantity);
  const handleBuyNow = () => {
    addToCart(cartCompatibleProduct, quantity);
    navigate({ to: "/cart" });
  };

  const handleSubmitReview = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      toast.error("Please fill in your name and comment.");
      return;
    }
    setReviews((current) => [{ id: Math.random().toString(36).slice(2), author: newReviewAuthor.trim(), rating: newReviewRating, date: "Today", comment: newReviewComment.trim(), verified: false }, ...current]);
    setNewReviewAuthor("");
    setNewReviewRating(5);
    setNewReviewComment("");
    toast.success("Thank you! Your review has been posted.");
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <TopBar />
      <StoreHeader />
      <NavBar />

      <main>
        <section className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-primary-foreground/58">
              <Link to="/" className="hover:text-accent">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-accent">Shop</Link>
              <span>/</span>
              <span className="line-clamp-1 text-primary-foreground">{product.name}</span>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <Badge className="bg-accent text-accent-foreground">{brandName}</Badge>
                <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">{product.name}</h1>
              </div>
              <div className="rounded-2xl border border-primary-foreground/12 bg-primary-foreground/8 p-4 text-sm text-primary-foreground/72">
                <p>SKU <strong className="text-primary-foreground">{product.sku}</strong></p>
                <p className="mt-1">GST {product.gstPercentage}% included</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_25rem]">
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-secondary cursor-zoom-in" onMouseMove={handleMouseMove} onMouseLeave={() => setZoomStyle({ transform: "scale(1)", transformOrigin: "center" })}>
                <img src={galleryImages[activeImageIndex].url} alt={product.name} className="h-full w-full object-cover transition-transform duration-75" style={{ ...zoomStyle, ...galleryImages[activeImageIndex].style }} />
                {product.featured ? <Badge className="absolute right-4 top-4 bg-accent text-accent-foreground">Featured</Badge> : null}
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {galleryImages.map((image, index) => (
                <button key={image.label} type="button" onClick={() => { setActiveImageIndex(index); setZoomStyle({ transform: "scale(1)", transformOrigin: "center" }); }} className={`h-24 w-24 shrink-0 overflow-hidden rounded-2xl border bg-card p-1 transition-all ${activeImageIndex === index ? "border-accent shadow-[var(--shadow-soft)]" : "border-border hover:border-muted-foreground/50"}`}>
                  <img src={image.url} alt={image.label} className="h-full w-full rounded-xl object-cover" style={image.style} />
                </button>
              ))}
            </div>

            <section className="rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">Engineering overview</p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                This AutoForge component is designed as a dependable hardware platform for innovators and makers. It focuses on stability, compatibility, and practical deployment in real projects.
              </p>
            </section>

            <section className="rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">Technical specifications</p>
                  <h2 className="mt-2 text-2xl font-black text-foreground">Integration details</h2>
                </div>
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {Object.entries(specifications).map(([key, value], index) => (
                      <tr key={key} className={index % 2 === 0 ? "bg-secondary/45" : "bg-card"}>
                        <td className="w-2/5 border-r border-border p-4 font-bold text-foreground">{key}</td>
                        <td className="p-4 text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>

          <aside className="h-fit rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-raised)] lg:sticky lg:top-28">
            <div className="flex items-center gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}
              <span className="ml-2 text-xs font-bold text-muted-foreground">({reviews.length} reviews)</span>
            </div>
            <div className="mt-5">
              <span className="text-4xl font-black tracking-tight text-foreground">{formatPrice(product.price)}</span>
              <span className="ml-2 text-xs text-muted-foreground">Incl. GST</span>
              {product.compareAtPrice && product.compareAtPrice > product.price ? <p className="mt-1 text-sm text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</p> : null}
            </div>

            <div className="mt-5">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive"><AlertTriangle className="h-4 w-4" /> Out of stock</span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-2 text-xs font-bold text-success"><CheckCircle2 className="h-4 w-4" /> Ready to ship ({product.stockQuantity} available)</span>
              )}
            </div>

            {!isOutOfStock ? (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/40 p-2">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="rounded-full p-2 text-muted-foreground hover:text-foreground" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                  <span className="text-sm font-black">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => value + 1)} className="rounded-full p-2 text-muted-foreground hover:text-foreground" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
                </div>
                <Button onClick={handleBuyNow} className="h-12 w-full rounded-full text-sm font-black">Buy now</Button>
                <Button onClick={handleAddToCart} variant="secondary" className="h-12 w-full rounded-full border border-border text-sm font-black">
                  <ShoppingBag className="h-4 w-4" /> Add to cart
                </Button>
              </div>
            ) : null}

            <button type="button" onClick={() => { if (isInWishlist(product.sku)) removeFromWishlist(product.sku); else addToWishlist(cartCompatibleProduct); }} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-black text-foreground hover:border-accent hover:text-accent">
              <Heart className={`h-4 w-4 ${isInWishlist(product.sku) ? "fill-accent text-accent" : ""}`} />
              {isInWishlist(product.sku) ? "Saved" : "Add to wishlist"}
            </button>

            <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-accent" /> Fast dispatch from AutoForge</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> Secure checkout and insured packaging</span>
            </div>
          </aside>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 lg:grid-cols-[1fr_25rem]">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">Reviews</p>
            <h2 className="mt-2 text-2xl font-black text-foreground">Builder feedback</h2>
            <div className="mt-6 space-y-5">
              {reviews.map((review) => (
                <article key={review.id} className="border-b border-border pb-5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-black text-foreground">{review.author}</h3>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-accent">
                    {Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-3.5 w-3.5 ${index < review.rating ? "fill-current" : "text-border"}`} />)}
                    {review.verified ? <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">Verified</span> : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
                </article>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmitReview} className="h-fit rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">Write a review</p>
            <input value={newReviewAuthor} onChange={(event) => setNewReviewAuthor(event.target.value)} required placeholder="Your name" className="mt-5 h-11 w-full rounded-full border border-border bg-secondary/40 px-4 text-sm outline-none focus:border-accent" />
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const rating = index + 1;
                return <button type="button" key={rating} onClick={() => setNewReviewRating(rating)} className={newReviewRating >= rating ? "text-accent" : "text-border"}><Star className="h-5 w-5 fill-current" /></button>;
              })}
            </div>
            <textarea value={newReviewComment} onChange={(event) => setNewReviewComment(event.target.value)} required rows={4} placeholder="Share your experience" className="mt-4 w-full resize-none rounded-2xl border border-border bg-secondary/40 p-4 text-sm outline-none focus:border-accent" />
            <Button type="submit" className="mt-4 h-11 w-full rounded-full">Submit review</Button>
          </form>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="mx-auto max-w-7xl px-4 pb-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">Related products</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground">Build around this part.</h2>
              </div>
              <Link to="/shop" className="hidden items-center gap-2 text-sm font-bold text-primary md:inline-flex">View shop <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedProducts.map((item) => <ProductCard key={item.sku} product={item} />)}
            </div>
          </section>
        ) : null}

        {recentlyViewed.length > 0 ? (
          <section className="mx-auto max-w-7xl px-4 pb-16">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">Recently viewed</p>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-5">
              {recentlyViewed.map((item) => <ProductCard key={item.sku} product={item} />)}
            </div>
          </section>
        ) : null}
      </main>

      <StoreFooter />
    </div>
  );
}
