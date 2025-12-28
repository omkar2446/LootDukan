import { ShoppingBag, Heart, Link } from "lucide-react";
import {  Mail, Phone, MapPin } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <img src="afavicon.ico" alt="" />
              </div>
              <span className="font-display text-xl font-bold">Lootdukan</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Find the best deals across Amazon, Flipkart, and more. Compare prices and save money on every purchase.
            </p>
          </div>

          {/* Quick Links */}
          

          {/* Stores */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Partner Stores</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-xl">🛒</span> Amazon
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🛍️</span> Flipkart
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">📦</span> Myntra
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                otambe016@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +91 9405909432
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                maharashtra, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Lootdukan. All rights reserved.</p>
          <p className="mt-1">
            We may earn affiliate commissions from links on this site.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
