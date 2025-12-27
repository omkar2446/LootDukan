import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | LootDukan</title>
        <meta name="description" content="Read LootDukan privacy policy to understand how we handle your data." />
        <link rel="canonical" href="https://www.lootdukan.in/privacy-policy" />
      </Helmet>

      <h1>Privacy Policy</h1>
      <p>We respect your privacy. We do not sell user data.</p>
    </>
  );
};

export default PrivacyPolicy;
