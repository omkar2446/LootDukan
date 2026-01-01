import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Moon,
  Sun,
  Store,
  MessageCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export default function Header({
  searchQuery = "",
  onSearchChange = (query: string) => {},
  isDark = false,
  onToggleTheme = () => {},
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path
      ? "text-primary font-semibold"
      : "text-muted-foreground hover:text-primary";

  const isSeller = (p: any) => p?.role === "seller" || p?.is_seller;
  const isBuyer = (p: any) => p?.role === "buyer" || p?.is_buyer;

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b">
      <div className="container flex items-center justify-between h-16">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
  <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white">
    <img
      src="/afavicon.ico"
      alt="LootDukan Logo"
      className="w-full h-full object-contain"
    />
  </div>
  <span className="font-bold text-lg">
    Loot<span className="text-primary">Dukan</span>
  </span>
</Link>


        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>

          <Link to="/seller" className={isActive("/seller")}>
            Direct with Seller
          </Link>
        </div>

        {/* SEARCH BAR */}
        {(location.pathname === "/" || location.pathname === "/seller")&& (
          <div className="hidden md:flex relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onToggleTheme}>
            {isDark ? <Sun /> : <Moon />}
          </Button>

          {user && isSeller(profile) && (
            <Button
              variant="outline"
              onClick={() => navigate("/seller/dashboard")}
            >
              <Store className="w-4 h-4 mr-2" />
              Seller Panel
            </Button>
          )}

          {user && (
            <Button
              variant="outline"
              onClick={() => navigate("/chats")}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chats
            </Button>
          )}

          {!user ? (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                Login
              </Button>
              <Button onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </>
          ) : (
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-3">
          <Link
            to="/"
            className={isActive("/")}
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/seller"
            className={isActive("/seller")}
            onClick={() => setMobileOpen(false)}
          >
            Direct with Seller
          </Link>

          {isSeller(profile) && (
            <Link
              to="/seller/dashboard"
              className="block text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Seller Dashboard
            </Link>
          )}

          {!user ? (
            <Button className="w-full" onClick={() => navigate("/auth")}>
              Login
            </Button>
          ) : (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
