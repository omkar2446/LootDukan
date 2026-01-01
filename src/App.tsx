import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";  
import Blog from "./pages/Blog";
import { AuthProvider } from "@/hooks/useAuth";
import Index2 from "./pages/Index2";
import Auth from "./pages/Auth";
import SellerDashboard from "./pages/SellerDashboard";
import Chats from "./pages/Chats";
import Chat from "./pages/Chat";

const queryClient = new QueryClient();

const App = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={<Index isDark={isDark} onToggleTheme={toggleTheme} />}
                />
                <Route
                  path="/admin-login"
                  element={<AdminLogin isDark={isDark} onToggleTheme={toggleTheme} />}
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin isDark={isDark} onToggleTheme={toggleTheme} />
                    </ProtectedRoute>
                  }
                  
                />
                <Route path="*" element={<NotFound />} />
                 <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/seller" element={<Index2 />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/chat/:requestId" element={<Chat />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
