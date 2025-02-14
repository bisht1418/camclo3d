import React, { useState } from "react";
import NavbarPages from "./NavbarPages";
import Footer from "../homePage/Footer";
import TopSection from "./Topsection";
import Touch from "../service/Touch";
import OurServices from "../service/OurServices";
import AddService from "../service/AddService";

const ServicePage = () => {
  const [open, setopen] = useState(false);
  const handleLogin = () => {
    setopen(!open);
    {
      !open
        ? document.body.classList.add("overflow-hidden")
        : document.body.classList.remove("overflow-hidden");
    }
    {
      open
        ? localStorage.setItem("credit", true)
        : localStorage.removeItem("credit");
    }
  };

  return (
    <>
      <NavbarPages modalOpen={open} handleLogin={handleLogin} />
      <TopSection
        keys={"unique"}
        title={"Our Services"}
        breadcrumData={["Home", "Our Services"]}
        image={"/serviceBanner.png"}
      />
      <OurServices handleLogin={handleLogin} />
      <AddService />
      <Touch />
      <Footer footer={true} handleLogin={handleLogin} />
    </>
  );
};

export default ServicePage;
