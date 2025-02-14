import React from "react";
import love from "../../utils/contact/love";
import { useSelector } from "react-redux";

const Love = () => {
  const contactUs = useSelector((store) => store.contact.contact);
  
  return (
    <div className="flex-col">
      <div className="max-w-[80rem] px-[1.25rem] mx-auto">
        <p className="text-center py-[.5rem] text-primaryLight leading-[1.5rem] text-[1.13rem] font-[700] pb-[1rem]">
          Contact Details
        </p>
        <h2 className="leading-[3.375rem] font-[700] text-[2.813rem] text-center">
          We Would Love To <span className="text-primary">Help You</span>
        </h2>
      </div>
      <div className="max-w-[80rem] grid sm:grid-cols-2 lg:grid-cols-3 px-[1.25rem] md:flex-row w-full gap-[1.875rem] pt-[4.5rem] mx-auto">
        {love?.map((feature, index) => (
          <div key={index} className="w-full h-[auto]">
            <div className="h-full relative p-[1.563rem] pt-[3.4rem] border border-[#E1D9E9] hover:border-primary transition duration-300 bg-white">
              <div className="bg-primary p-[0.875rem] w-[4.688rem] h-[4.688rem] shadow-[2px_2px_12px_0px_#CAC2D1] absolute top-[-1.263rem] left-[1.563rem]">
                <div className="arrow-up"></div>
                <img className="" src={feature?.icon} />
              </div>

              <img
                className="w-[4.5rem] absolute top-[1.563rem] right-[1.563rem]"
                src={feature?.img}
              />
              <div className="pt-[1.5rem] lg:pt-[2rem]">
                <h3 className="leading-[2.25rem] font-[700] text-[1.375rem] text-secondary pb-[0.625rem]">
                  {feature?.title}
                </h3>
                <p className="leading-[1.25rem] font-[400] text-primaryLight text-[1rem]">
                  {feature?.title === "Visit A Office" && contactUs?.address ? (
                    <a href={`https://www.google.com/maps?q=${contactUs.address}`} target="_blank" rel="noopener noreferrer">
                      {contactUs?.address}
                    </a>
                  ) : feature?.title === "Send Email" && contactUs?.email ? (
                    <a href={`mailto:${contactUs.email}`} className="text-primary">
                      {contactUs?.email}
                    </a>
                  ) : feature?.title === "Make A Call" && contactUs?.phone ? (
                    <a  href={`tel:${contactUs?.phone}`} className="text-primary">
                      {contactUs?.phone}
                    </a>
                  ) : (
                    feature.title
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Love;
