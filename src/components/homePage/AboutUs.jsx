import React from "react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const naviagte = useNavigate();
  return (
    <div className="relative z-[2] bg-[#F9FAFE]">
      <img
        className="absolute h-full top-0 left-0 w-full opacity-[0.2] z-[0]"
        src="/bg.png"
        alt=""
      />
      <div className="relative max-w-[80rem] px-[1.25rem] w-full flex flex-col md:flex-row gap-[1.438rem] items-center m-auto py-[3rem] md:py-[6.188rem] ">
        <div className="w-full md:w-[calc(100%-0.75rem)]">
          <img
            className="w-full max-h-[25rem] h-auto object-cover"
            src={"/nationalAssociations.png"}
          />
        </div>
        <div className="w-full md:w-[calc(100%-0.75rem)]">
          <div className="flex flex-col gap-[1.375rem]">
            <h2 className="text-secondary leading-[3.375rem] font-[600] text-[2.813rem]">
              About &nbsp;
              <span className="text-primary">Us</span>
            </h2>
            <p className="text-primaryLight text-[1rem] font-[400] leading-[1.5rem]">
              We are a team of enthusiastic and passionate professionals from a
              textile background. Camclo3D has been built on a foundation of
              years of working in the textile-com industry. Running an
              e-commerce business has become excessively competitive in the past
              few years with the influx of new usinesses everyday. Photoshoots
              are one of the most expensive features in running an online
              business, making it inaccessible for MSMEs, in turn reducing their
              rate of success.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                naviagte("/about-us");
              }}
              className="btn-primary text-[1rem] font-[500] leading-[1.5rem] mt-4"
            >
              About Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
