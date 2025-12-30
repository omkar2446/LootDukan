import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Users, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-28">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground animate-fade-up">
            <Zap className="h-4 w-4" />
            <span>₹300 per listing • Reach thousands of buyers</span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl animate-fade-up" style={{ animationDelay: "100ms" }}>
            India's Trusted{" "}
            <span className="relative">
              <span className="relative z-10">Marketplace</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-accent/40 -z-0" />
            </span>{" "}
            for Businesses
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "200ms" }}>
            Connect directly with buyers across India. List your products, get instant visibility, and grow your business with WhatsApp-ready leads.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <Link to="/seller/add-product">
              <Button variant="accent" size="xl" className="gap-2 w-full sm:w-auto">
                Start Selling Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Browse Products
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/70 animate-fade-up" style={{ animationDelay: "400ms" }}>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">10,000+ Active Sellers</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm">Verified Listings</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="text-sm">Instant WhatsApp Connect</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
