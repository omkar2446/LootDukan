import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Store,
  LayoutDashboard,
  MessageCircle,
  Search,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Header({
  searchQuery = "",
  onSearchChange = () => {},
}) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isSeller = profile?.role === "seller";

  // ✅ Show search only on these pages
  const showSearch =
    location.pathname === "/" || location.pathname === "/seller";

  const navItem = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
      location.pathname === path
        ? "text-primary font-semibold"
        : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <header className="w-full bg-background border-b sticky top-0 z-50">

      {/* ================= HEADER ROW ================= */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/afavicon.ico" className="w-8 h-8" />
          <span className="font-bold text-lg hidden sm:block">
         Loot<span className="text-primary">Dukan</span>
          </span>
        </Link>

        {/* 🔍 SEARCH (DESKTOP – LIKE LINKEDIN) */}
        {showSearch && (
          <div className="hidden md:block w-[380px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="🔍 Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        )}

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/" className={navItem("/")}>🏠 Home</Link>
          <Link to="/seller" className={navItem("/seller")}>🏪 Seller</Link>

          {isSeller && (
            <Link to="/seller/requests" className={navItem("/seller/requests")}>
              📥 Requests
            </Link>
          )}

          {isSeller && (
            <Link to="/seller/dashboard" className={navItem("/seller/dashboard")}>
              📊 Dashboard
            </Link>
          )}

          <Link to="/chats" className={navItem("/chats")}>
            💬 Chat
          </Link>

          {!user ? (
            <Button size="sm" onClick={() => navigate("/auth")}>
              🔐 Login
            </Button>
          ) : (
            <Button size="sm" variant="destructive" onClick={signOut}>
              🚪 Logout
            </Button>
          )}
        </div>

        {/* MOBILE MENU ICON */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 🔍 MOBILE SEARCH (LinkedIn Style) */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="🔍 Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}

      {/* 📱 MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-2">
          <Link to="/" onClick={() => setOpen(false)} className={navItem("/")}>
            🏠 Home
          </Link>
          <Link to="/seller" onClick={() => setOpen(false)} className={navItem("/seller")}>
            🏪 Seller
          </Link>

          {isSeller && (
            <Link to="/seller/requests" onClick={() => setOpen(false)} className={navItem("/seller/requests")}>
              📥 Requests
            </Link>
          )}

          {isSeller && (
            <Link to="/seller/dashboard" onClick={() => setOpen(false)} className={navItem("/seller/dashboard")}>
              📊 Dashboard
            </Link>
          )}

          <Link to="/chats" onClick={() => setOpen(false)} className={navItem("/chats")}>
            💬 Chat
          </Link>

          {!user ? (
            <Button className="w-full" onClick={() => navigate("/auth")}>
              🔐 Login
            </Button>
          ) : (
            <Button className="w-full" variant="destructive" onClick={signOut}>
              🚪 Logout
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
