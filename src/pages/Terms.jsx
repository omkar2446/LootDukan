import { Helmet } from "react-helmet-async";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | LootDukan</title>
        <meta name="description" content="Read terms and conditions of using LootDukan website." />
        <link rel="canonical" href="https://www.lootdukan.in/terms" />
      </Helmet>

      <h1>Terms & Conditions</h1>
      <p>By using LootDukan, you agree to our terms.</p>
    </>
  );
};

export default Terms;
