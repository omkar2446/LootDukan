import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      {/* ✅ SEO FOR 404 PAGE */}
      <Helmet>
        <title>404 – Page Not Found | LootDukan</title>
        <meta
          name="description"
          content="The page you are looking for does not exist or has been moved."
        />

        {/* IMPORTANT: Do NOT index 404 pages */}
        <meta name="robots" content="noindex, follow" />
        <meta name="googlebot" content="noindex, follow" />

        {/* Block social preview */}
        <meta property="og:title" content="404 - Page Not Found" />
        <meta property="og:description" content="This page does not exist." />
        <meta name="twitter:card" content="none" />

        {/* Canonical */}
        <link rel="canonical" href="https://lootdukan.in/404" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
          <p className="mb-2 text-2xl font-semibold">
            Page Not Found
          </p>
          <p className="mb-6 text-muted-foreground">
            Sorry, the page you are looking for doesn’t exist.
          </p>

          <a
            href="/"
            className="inline-block rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary/90"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
