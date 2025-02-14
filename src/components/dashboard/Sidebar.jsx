import React, { useEffect, useState } from "react";
import { GoHome } from "react-icons/go";
import { CiImageOn } from "react-icons/ci";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 400);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 400);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const navItems = [
  { href: "#", icon: <GoHome size={20} />, text: "Dashboard" },
  { href: "#", icon: <CiImageOn size={20} />, text: "Visualizer" },
  { href: "#", icon: <HiOutlineCurrencyRupee size={20} />, text: "Credits" },
];

const Sidebar = ({ active, setActive, setToggleSideBar, toggleSideBar }) => {

  const isMobile = useIsMobile();

  return (
    <div className="bg-white h-full">
      {isMobile && (
        <div className="py-[.5rem] flex justify-end">
          <IoMdClose
            onClick={() => setToggleSideBar(!toggleSideBar)}
            size={20}
          />
        </div>
      )}

      <div className="flex items-center justify-center md:py-[2.4rem] py-8 mx-auto">
        <img className="h-[4rem]" src="/logo_new.png" alt="Logo" />
      </div>
      <nav className="md:mt-[3.5rem] mt-0">
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`border-l-4 ${
              active === index ? "border-primary" : "border-transparent"
            }`}
          >
            <a
              href={item.href}
              className={`max-w-[15.625rem] w-[96%] md:w-[90%] lg:[80%] mx-auto rounded-lg flex flex-row gap-[1rem] items-center  px-8   ${
                active === index ? "bg-[#EFE8F5]" : "bg-[white]"
              }  ${active === index ? "text-[#92278F]" : "text-primaryLight"} `}
              onClick={() => setActive(index)}
            >
              {item.icon}
              <p
                className={`text-[1.1rem] leading-[1.35rem] font-[500] Barlow py-[1rem] ${
                  active === index ? "text-[#92278F]" : "text-primaryLight"
                }`}
              >
                {item.text}
              </p>
            </a>
          </div>
        ))}
      </nav>
      <footer className="absolute bottom-0 left-0 w-full py-4 px-8 bg-white ">
        <p className="font-[700] leading-[1.1rem] text-[.8rem] text-primaryLight Barlow">
          CamClo3D User Dashboard
        </p>
        <span className="text-[.75rem] font-[400] leading-[1.1rem] text-primaryLight Barlow">
          © 2024 All Rights Reserved
        </span>
      </footer>
    </div>
  );
};

export default Sidebar;
