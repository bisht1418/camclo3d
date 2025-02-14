import React, { useState } from "react";
import NavbarPages from "./NavbarPages";
import Footer from "../homePage/Footer";
import PrivacyPolicy from "../privacy/PrivacyPolicy";
import TopSection from "./Topsection";

const PrivacyPage = () => {
  const [open, setopen] = useState(false);
  const handleLogin = () => {
    setopen(!open);
  };
  return (
    <>
      <NavbarPages modalOpen={open} handleLogin={handleLogin} />
      <TopSection
        keys={"unique"}
        title={"Privacy Policy"}
        breadcrumData={["Home", "Privacy Policy"]}
        image={"/privacyPolicy.png"}
      />
      <PrivacyPolicy />
      <Footer footer={false} handleLogin={handleLogin} />
    </>
  );
};

export default PrivacyPage;
