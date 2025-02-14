import React, { useState } from "react";
import NavbarPages from "./NavbarPages";
import TopSection from "./Topsection";
import TermCondition from "../termAndCondition/TermCondition";
import Footer from "../homePage/Footer";

const TermConditionPage = () => {
  const [open, setopen] = useState(false);
  const handleLogin = () => {
    setopen(!open);
  };
  return (
    <>
      <NavbarPages modalOpen={open} handleLogin={handleLogin} />
      <TopSection
        keys={"unique"}
        title={"Terms and Condition"}
        breadcrumData={["Home", "Terms and Condition"]}
        image={"/privacyPolicy.png"}
      />
      <TermCondition />
      <Footer footer={true} handleLogin={handleLogin} />
    </>
  );
};

export default TermConditionPage;
