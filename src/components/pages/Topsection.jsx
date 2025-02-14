import React, { useEffect } from "react";
import { HiHome } from "react-icons/hi";

const TopSection = ({ title, breadcrumData, keys, image, bg }) => {
  useEffect(() => {
    if (image) {
      document.documentElement.style.setProperty(
        "--background-image",
        `url(${image})`
      );
    }
  }, [image]);
  return (
    <div
      className={`flex flex-col justify-center items-center form-bg relative`}
    >
      <div
        className={`absolute h-full w-full top-0 left-0 ${
          bg ? "bg-black" : ""
        } opacity-[0.4]`}
      ></div>
      <div className="flex justify-center items-center z-10 px-[1rem] py-[3.25rem] sm:py-[5.25rem] lg:py-[8.25rem] ">
        <h1 className="text-white text-[3.5rem] lg:text-[4rem] font-[700] text-center leading-[4.75rem]">
          {title}
        </h1>
      </div>
      <div className="relative w-full flex items-center pb-[1rem] sm:pb-[2.25rem] pt-[1rem] sm:pt-[2.25rem]  justify-center border-t-[0.031rem] border-[#E1D9E9]  gap-[.6rem]">
        {breadcrumData?.length === 1 ? (
          <div key={keys} className="page-subtitle text-white text-center">
            {breadcrumData[0]}
          </div>
        ) : (
          <>
            {breadcrumData.map((item, index) => (
              <React.Fragment key={index}>
                <p className="font-medium  text-white flex">
                  {index === 0 && (
                    <HiHome
                      className={
                        "bg-primaryMediumLight mr-[0.5rem] p-[0.18rem] rounded-full flex items-center justify-center"
                      }
                      color="white"
                      size={22}
                    />
                  )}
                  <span
                    className={`text-[1rem] font-[500] leading-[1.5rem] ${
                      index === breadcrumData?.length - 1
                        ? "text-primaryMediumLight"
                        : "text-white"
                    }`}
                  >
                    {item}
                  </span>
                </p>
                {index !== breadcrumData?.length - 1 && (
                  <>
                    <img className=" w-[.5rem]" src="/arrow.png" alt="" />
                  </>
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TopSection;
