import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { login, isAuthenticated } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ShoppingBag,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

interface AdminLoginProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const AdminLogin = ({ isDark, onToggleTheme }: AdminLoginProps) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 500));

    const result = login(email, password);

    if (result.success) {
      navigate("/admin", { replace: true });
    } else {
      setError(result.error || "Invalid credentials");
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* ✅ SEO (ADMIN SAFE) */}
      <Helmet>
        <title>Admin Login – LootDukan</title>
        <meta
          name="description"
          content="Secure admin login panel for LootDukan."
        />

        {/* ❌ Do NOT index admin pages */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />

        {/* Block social previews */}
        <meta property="og:title" content="Admin Login" />
        <meta property="og:description" content="Restricted access" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="none" />

        {/* Canonical */}
        <link rel="canonical" href="https://lootdukan.in/admin-login" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* LOGO */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <ShoppingBag className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">
              Loot<span className="text-primary">Dukan</span>
            </h1>
            <p className="text-sm text-muted-foreground">Admin Portal</p>
          </div>

          {/* LOGIN CARD */}
          <div className="rounded-2xl border bg-card p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Admin Login</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials
                </p>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div>
                <Label>Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <Label>Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ← Back to Shop
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
