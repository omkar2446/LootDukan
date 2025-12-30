import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 lg:p-14">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-foreground/10 blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center text-center lg:flex-row lg:text-left lg:justify-between">
            <div className="mb-8 lg:mb-0 lg:max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Limited Time Offer</span>
              </div>
              <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
                Ready to Grow Your Business?
              </h2>
              <p className="text-lg text-primary-foreground/80">
                Join thousands of successful sellers. List your first product today for just ₹300 and reach buyers across India.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col xl:flex-row">
              <Link to="/seller/add-product">
                <Button variant="accent" size="xl" className="gap-2 w-full">
                  Start Selling
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  size="xl" 
                  className="w-full border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
