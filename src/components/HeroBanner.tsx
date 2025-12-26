import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const banners = [
  {
    link: "https://amzn.to/49aPte4",
    image:
      "https://images-eu.ssl-images-amazon.com/images/G/31/img21/MA2025/GW/BAU/Unrec/PC/934044814._CB551384116_.jpg",
    alt: "Best Amazon Deals – Electronics & Offers",
  },
  {
    link: "https://amzn.to/49aPte4",
    image:
      "https://images-eu.ssl-images-amazon.com/images/G/31/INSLGW/af_pc_2x._CB792409181_.jpg",
    alt: "Amazon Sale – Big Discounts Today",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ✅ SEO META TAGS */}
      <Helmet>
        <title>LootDukan – Best Online Deals & Offers</title>
        <meta
          name="description"
          content="Find the best deals, discounts and offers on Amazon, electronics, fashion and more at LootDukan."
        />

        {/* Open Graph */}
        <meta property="og:title" content="LootDukan – Best Online Deals" />
        <meta
          property="og:description"
          content="Grab best deals & offers from Amazon at LootDukan."
        />
        <meta
          property="og:image"
          content="https://lootdukan.in/twitter-image.jpg"
        />
        <meta property="og:url" content="https://lootdukan.in" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LootDukan – Best Deals" />
        <meta
          name="twitter:description"
          content="Best offers and deals online. Save money with LootDukan."
        />
        <meta
          name="twitter:image"
          content="https://lootdukan.in/twitter-image.jpg"
        />

        {/* SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://lootdukan.in" />
      </Helmet>

      {/* 🔥 HERO BANNER */}
      <section className="w-full bg-background py-6">
        <div className="container mx-auto px-3">
          <div className="relative overflow-hidden rounded-xl shadow-md">

            {/* SLIDER */}
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <a
                  key={index}
                  href={banner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-full block"
                >
                  <div className="h-[220px] sm:h-[260px] lg:h-[300px] w-full overflow-hidden">
                    <img
                      src={banner.image}
                      alt={banner.alt}
                      loading="lazy"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </a>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
