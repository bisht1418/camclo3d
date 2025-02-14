import { useSelect } from "@react-three/drei";
import React, { useEffect } from "react";
import { FaInstagram, FaDribbble, FaYoutube, FaTwitter } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { contactUsService } from "../../services/contactUsService";

const Footer = ({ footer, handleLogin }) => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  const isAuthenticated = useSelector((store) => store?.auth?.token);
  const contactData = async () => {
    const res = await contactUsService();
    return res;
  };
  useEffect(() => {
    contactData();
  }, []);
  const contactUs = useSelector((store) => store.contact.contact);


  return (
    <div>
      {footer && (
        <div
          className="relative bg-cover bg-center"
          style={{ backgroundImage: "url(/footerimage.png)" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          {/* <div className="relative flex flex-col items-center gap-[2rem] justify-center max-w-[80rem] px-[1.25rem] mx-auto py-[3rem] lg:py-[6rem]">
            <h1 className="text-white leading-[3.8rem] text-[3rem] md:text-[4rem]  md:leading-[4.8rem]  font-[700]  text-center">
              Visualize Your Fabric Now
            </h1>
            <div>
              {isAuthenticated ? (
                <Link to="/visualizer">
                  <button className="btn-primary text-[1rem] font-[500] leading-[1.5rem]">
                    Visualize
                  </button>
                </Link>
              ) : (
                <button
                  onClick={(e) => {
                    handleLogin();
                    handleClick();
                  }}
                  className="btn-primary text-[1rem] font-[500] leading-[1.5rem]"
                >
                  Visualize
                </button>
              )}
            </div>
          </div> */}
        </div>
      )}

      <div className="bg-secondary">
        <div className="flex flex-col md:flex-row justify-between px-5 max-w-[80rem] m-auto w-full py-[2.5rem] lg:py-[3.5rem]">
          <div className="flex items-start flex-col gap-6 mb-8 md:mb-0">
            <img className="h-32 w-32" src="/footerIcon.png" />
            <div>
              <p className="text-white font-normal text-base leading-6">
                Copyright © 2024 CamClo3D. <br /> All rights reserved
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-[4rem] mb-[2rem] md:mb-0">
            <div className="flex flex-col gap-3">
              <Link
                to={"/about-us"}
                onClick={handleClick}
                className="text-base leading-5 font-normal hover:underline text-white hover:text-primaryMediumLight"
              >
                About us
              </Link>

              <Link
                to={"/contact-us"}
                onClick={handleClick}
                className="text-base leading-5 font-normal hover:underline text-white hover:text-primaryMediumLight"
              >
                Contact us
              </Link>
              <Link
                to={"/faq"}
                onClick={handleClick}
                className="text-base leading-5 font-normal hover:underline text-white hover:text-primaryMediumLight"
              >
                FAQ
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to={"/service"}
                onClick={handleClick}
                className="text-base leading-5 font-normal hover:underline text-white hover:text-primaryMediumLight"
              >
                Pricing
              </Link>
              <Link
                to={"/privacy-policy"}
                onClick={handleClick}
                className="text-base leading-5 font-normal hover:underline text-white hover:text-primaryMediumLight"
              >
                Privacy policy
              </Link>

              <Link
                to={"/term-condition"}
                onClick={handleClick}
                className="text-base leading-5 font-normal hover:underline text-white hover:text-primaryMediumLight"
              >
                Terms and Condition
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <h1 className="text-white font-bold text-xl leading-7">
                Contact Us
              </h1>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row text-white gap-2">
                  <img className="h-6 w-6" src="/phone.png" alt="Phone Icon" />
                  <a
                    href={`tel:${contactUs?.phone}`}
                    className="hover:underline"
                  >
                    {contactUs?.phone}
                  </a>
                </div>
                <div className="flex flex-row text-white gap-2">
                  <img className="h-6 w-6" src="/email.png" alt="Email Icon" />
                  <a
                    href={`mailto:${contactUs?.email}`}
                    className="hover:underline"
                  >
                    {contactUs?.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-white font-bold text-xl leading-7">
                Follow Us
              </h1>
              <div className="flex flex-row gap-[1rem]">
                <div className="group w-[2rem] h-[2rem] flex justify-center items-center rounded-full bg-iconFooterBg hover:bg-[white]">
                  <a href={contactUs?.instagram} target="_blank">
                    <FaInstagram
                      size={17}
                      className="text-white group-hover:text-primary cursor-pointer"
                    />
                  </a>
                </div>
                <div className="group w-[2rem] h-[2rem] flex justify-center items-center rounded-full bg-iconFooterBg p-[0.467rem] hover:bg-[white]">
                  <a href={contactUs?.dribble} target="_blank">
                    <FaDribbble
                      className="text-white group-hover:text-primary cursor-pointer"
                      size={17}
                    />
                  </a>
                </div>
                <div className="group w-[2rem] h-[2rem] flex justify-center items-center rounded-full bg-iconFooterBg p-[0.467rem] hover:bg-[white]">
                  <a href={contactUs?.twitter} target="_blank">
                    <FaTwitter
                      className="text-white group-hover:text-primary cursor-pointer"
                      size={17}
                    />
                  </a>
                </div>
                <div className="group w-[2rem] h-[2rem] flex justify-center items-center rounded-full bg-iconFooterBg p-[0.467rem] hover:bg-[white]">
                  <a href={contactUs?.youtube} target="_blank">
                    <FaYoutube
                      className="text-white group-hover:text-primary cursor-pointer"
                      size={17}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
