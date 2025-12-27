import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About LootDukan | Smart Online Price Comparison</title>
        <meta name="description" content="LootDukan is India’s smart price comparison platform helping users find best online deals and offers." />
        <link rel="canonical" href="https://www.lootdukan.in/about" />
      </Helmet>

      <h1>About LootDukan</h1>
      <p>
        LootDukan is a smart price comparison website that helps users find
        the best deals across Amazon, Flipkart, Meesho and more.
      </p>
    </>
  );
};

export default About;
