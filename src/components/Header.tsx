import { Link, useLocation } from "react-router-dom";
import { Search, Moon, Sun, ShoppingBag, Settings, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isAuthenticated } from "@/lib/auth";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const Header = ({ searchQuery, onSearchChange, isDark, onToggleTheme }: HeaderProps) => {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";
  const isLoggedIn = isAuthenticated();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden font-bold text-xl sm:inline-block">
            Loot<span className="text-primary">Dukan</span>
          </span>
        </Link>

        {/* Search Bar - Only on home page */}
        {!isAdmin && location.pathname === "/" && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-secondary/50 border-0 focus-visible:ring-primary"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {isAdmin ? (
            <Link to="/">
              <Button variant="default" size="sm" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">View Shop</span>
              </Button>
            </Link>
          ) : (
            <Link to={isLoggedIn ? "/admin" : "/admin-login"}>
              <Button variant="outline" size="sm" className="gap-2">
                {isLoggedIn ? (
                  <>
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin Login</span>
                  </>
                )}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
