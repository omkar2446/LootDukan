export interface BannerConfig {
  title: string;
  subtitle: string;
  badge: string;
  amazonLink: string;
  flipkartLink: string;
}

const DEFAULT_BANNER: BannerConfig = {
  title: "Up to 80% OFF",
  subtitle: "Compare prices & grab the best deals",
  badge: "LootDukan Exclusive Deals",
  amazonLink: "https://www.amazon.in",
  flipkartLink: "https://www.flipkart.com",
};

export const getBanner = (): BannerConfig => {
  const data = localStorage.getItem("lootdukan_banner");
  return data ? JSON.parse(data) : DEFAULT_BANNER;
};

export const saveBanner = (banner: BannerConfig) => {
  localStorage.setItem("lootdukan_banner", JSON.stringify(banner));
};
