import { useEffect, useState } from "react";

const banners = [
  {
    link: "https://amzn.to/49aPte4",
    image:
      "https://images-eu.ssl-images-amazon.com/images/G/31/img21/MA2025/GW/BAU/Unrec/PC/934044814._CB551384116_.jpg",
    alt: "Amazon Banner",
  },
  {
    link: "https://amzn.to/49aPte4",
    image:
      "https://images-eu.ssl-images-amazon.com/images/G/31/INSLGW/af_pc_2x._CB792409181_.jpg",
    alt: "Amazon Banner",
  },
 
 


];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  // 🔄 Auto scroll every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-background py-6">
      <div className="container">
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
                {/* 🔥 FIXED HEIGHT + TOP ALIGN */}
                <div className="h-[220px] sm:h-[260px] lg:h-[300px] w-full overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
