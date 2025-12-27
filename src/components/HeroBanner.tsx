import { Helmet } from "react-helmet-async";

const HeroBanner = () => {
  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>LootDukan – Best Deals</title>
        <meta
          name="description"
          content="Grab best deals and offers on LootDukan."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* HERO BANNER */}
      <section className="w-full bg-white py-4">
        <div className="max-w-7xl mx-auto px-3">
          <div className="overflow-hidden rounded-2xl shadow-md bg-white">

            <a
              href="https://amzn.to/4qrm1qX"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://m.media-amazon.com/images/G/31/img22/WLA/2025/Unrec/PocketFriendlyStore/1500.gif"
                alt="Amazon Pocket Friendly Store"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </a>

          </div>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
