import React, { useState } from "react";
import Footer from "../homePage/Footer";
import TopSection from "./Topsection";
import Story from "../aboutUs/Story";
import NavbarPages from "./NavbarPages";
// import successImage from "../../../public/"
const AboutUs = () => {
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
    <div>
      <NavbarPages modalOpen={open} handleLogin={handleLogin} />
      <TopSection
        keys={"unique"}
        title={"About Us"}
        breadcrumData={["Home", "About us"]}
        image={"/aboutus.png"}
      />
      <Story />
      <Footer footer={true} handleLogin={handleLogin} />
    </div>
  );
};

export default AboutUs;
