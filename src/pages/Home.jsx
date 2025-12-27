import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>LootDukan – Best Online Deals & Price Comparison in India</title>
        <meta name="description" content="LootDukan helps you compare prices from Amazon, Flipkart, Myntra & more. Find best deals, discounts and offers in one place." />
        <meta name="keywords" content="lootdukan, best deals, price comparison, amazon offers, flipkart deals, online shopping india" />
        <link rel="canonical" href="https://www.lootdukan.in/" />
      </Helmet>

      <section>
        <h1>Compare Best Deals Online</h1>
        <p>Find cheapest prices from Amazon, Flipkart, Myntra & more.</p>
      </section>
    </>
  );
};

export default Home;
