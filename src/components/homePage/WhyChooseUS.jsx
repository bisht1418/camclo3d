import React from "react";
import choose from "../../utils/homePage/whyChooseUs";

const WhyChooseUs = () => {
  return (
    <div className="flex-col bg-[#FDFBFF] py-[3rem] md:py-[6rem]">
      <div className=" max-w-[80rem] px-[1.25rem] mx-auto">
        <h2 className="text-[2.813rem] text-center font-bold text-secondary ">
          Why <span className="text-primary">Choose Us</span>
        </h2>
        <p className="text-center py-[.5rem] text-[#7E6E8C] leading-[1.5rem] text-[1rem] font-[400]  ">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
      </div>
      <div className=" grid sm:grid-cols-2 lg:grid-cols-3 max-w-[80rem] px-[1.25rem]  flex-col md:flex-row w-full gap-[1.5rem] pt-[2.188rem] mx-auto">
        {choose.map((feature, index) => (
          <div
            key={index}
            className="h-[auto] p-[2rem] rounded-2xl border hover:shadow-[2px_2px_12px_0px_#CAC2D1] bg-[#fff] border-[#E1D9E9] hover:border-primary transition duration-300 flex flex-col gap-[1rem]"
          >
            <div className="bg-primary p-[0.875rem] w-[4.688rem] h-[4.688rem] rounded-2xl border border-white shadow-[2px_2px_12px_0px_#CAC2D1]">
              <img className="" src={feature?.icon} />
            </div>

            <h1 className="leading-[2.25ren] font-[700] text-[1.375rem] ">
              {feature.title}
            </h1>
            <p className="leading-[1.25rem] font-[400] text-primaryLight text-[1rem]">
              {feature.description}
            </p>
            <a
              href={feature.link}
              className="text-primary text-[1rem] leading-[1.25rem] font-semibold inline-flex items-center underline"
            >
              View More
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14m-7-7l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
