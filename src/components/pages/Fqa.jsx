import React, { useState } from "react";
import Footer from "../homePage/Footer";
import TopSection from "./Topsection";
import Faq from "../faq/Faq";
import NavbarPages from "./NavbarPages";

const Fqa = () => {
  const [open, setopen] = useState(false);
  const handleLogin = () => {
    setopen(!open);
    {
      !open
        ? document.body.classList.add("overflow-hidden")
        : document.body.classList.remove("overflow-hidden");
    }
  };
  return (
    <>
      <NavbarPages modalOpen={open} handleLogin={handleLogin} />
      <TopSection
        keys={"unique"}
        title={"FAQ"}
        breadcrumData={["Home", "FAQ"]}
        image={"/faqBanner.png"}
      />
      <Faq />
      <Footer footer={true} handleLogin={handleLogin} />
    </>
  );
};

export default Fqa;
