import { ShoppingBag, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container py-8">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ShoppingBag className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">
              Loot<span className="text-primary">Dukan</span>
            </span>
          </div>

          {/* Affiliate Disclaimer */}
          <p className="max-w-lg text-sm text-muted-foreground leading-relaxed">
            Prices may change
          </p>

          {/* Copyright */}
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with <Heart className="h-3 w-3 text-primary fill-primary" /> in India<span className="mx-2">•</span>© {new Date().getFullYear()} Lootdukan. All rights reserved.    
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
