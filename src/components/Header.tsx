import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Store,
  LayoutDashboard,
  MessageCircle,
  Search,
  LogOut,
} from "lucide-react";
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

  const isSeller = (p: any) => p?.role === "seller";

  const navItem = (path: string) =>
    `flex items-center gap-1 px-2 py-1 text-sm rounded-md transition
     ${
       location.pathname === path
         ? "text-primary font-semibold"
         : "text-muted-foreground hover:text-primary"
     }`;

  return (
    <header className="w-full bg-background border-b">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center">

        {/* LEFT: LOGO + SEARCH */}
        <div className="flex items-center gap-4 flex-1">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/afavicon.ico" className="w-9 h-9" />
            <span className="hidden md:block font-bold text-lg">
              Loot<span className="text-primary">Dukan</span>
            </span>
          </Link>

          {/* SEARCH */}
          <div className="relative w-full max-w-[420px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* RIGHT: NAVIGATION */}
        <div className="flex items-center gap-3 shrink-0">

          <Link to="/" className={navItem("/")}>
            <Home size={18} />
            <span className="hidden md:inline">Home</span>
          </Link>

          <Link to="/seller" className={navItem("/seller")}>
            <Store size={18} />
            <span className="hidden md:inline">Seller</span>
          </Link>

          {isSeller(profile) && (
            <Link
              to="/seller/dashboard"
              className={navItem("/seller/dashboard")}
            >
              <LayoutDashboard size={18} />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
          )}

          <Link to="/chats" className={navItem("/chats")}>
            <MessageCircle size={18} />
            <span className="hidden md:inline">Chat</span>
          </Link>

          {!user ? (
            <Button size="sm" onClick={() => navigate("/auth")}>
              Login
            </Button>
          ) : (
            <Button size="sm" variant="destructive" onClick={signOut}>
              <LogOut size={16} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
