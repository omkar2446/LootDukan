import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Home,
  MessageCircle,
  Store,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export default function Header({
  searchQuery = "",
  onSearchChange = () => {},
  isDark = false,
  onToggleTheme = () => {},
}) {
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const isSeller = (p: any) => p?.role === "seller";

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="container flex items-center h-16 gap-3">

          {/* MENU ICON */}
          <button
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/afavicon.ico" className="w-9 h-9" />
            <span className="font-bold text-lg hidden sm:block">
              Loot<span className="text-primary">Dukan</span>
            </span>
          </Link>

          {/* SEARCH BAR (ALWAYS VISIBLE) */}
          <div className="flex-1 relative mx-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onToggleTheme}>
              {isDark ? <Sun /> : <Moon />}
            </Button>

            {!user ? (
              <Button onClick={() => navigate("/auth")}>
                Login
              </Button>
            ) : (
              <Button variant="destructive" onClick={signOut}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-background z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold">LootDukan</span>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <div className="p-4 space-y-2">
          <SidebarItem icon={<Home />} text="Home" link="/" />
          <SidebarItem icon={<MessageCircle />} text="Chats" link="/chats" />
          <SidebarItem icon={<Store />} text="Direct with Seller" link="/seller" />

          {isSeller(profile) && (
            <SidebarItem
              icon={<User />}
              text="Seller Dashboard"
              link="/seller/dashboard"
            />
          )}

          <div className="pt-4 border-t">
            {!user ? (
              <Button className="w-full" onClick={() => navigate("/auth")}>
                Login
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="destructive"
                onClick={signOut}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

/* SIDEBAR ITEM */
function SidebarItem({ icon, text, link }: any) {
  const location = useLocation();
  const isActive = location.pathname === link;

  return (
    <Link
      to={link}
      className={`flex items-center gap-3 p-2 rounded-md transition
        ${
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "hover:bg-muted text-muted-foreground"
        }
      `}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </Link>
  );
}
