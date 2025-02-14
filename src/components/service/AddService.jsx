import React from "react";

const AddService = () => {
  return (
    <div className="relative z-[2] bg-[#F9FAFE]">
      <img
        className="absolute h-full top-0 left-0 w-full opacity-[0.2] z-[0]"
        src="/bg.png"
        alt=""
      />
      <div className="relative max-w-[80rem] px-[1.25rem] w-full flex flex-col lg:flex-row gap-[1.238rem] md:gap-[2.238rem] items-center m-auto py-[3rem] lg:py-[6.188rem] ">
        <div className="w-full md:w-[calc(100%-0.75rem)]">
          <img
            className="w-full h-[25rem] object-cover rounded-[1.4rem]"
            src={"/addService.png"}
          />
        </div>
        <div className="w-full md:w-[calc(100%-0.75rem)]">
          <div className="flex flex-col">
            <h2 className="text-secondary  leading-[3.375rem] font-[700] text-[2.813rem]  pb-[1.4rem]">
              Add on <span className="text-primary font-[700]">Services</span>
            </h2>
            <h4 className="text-secondary leading-[1rem] font-[700] text-[1.25rem]  pb-[0.5rem]">
              Men custom face
            </h4>
            <p className="text-primaryLight text-[1rem] font-[400] leading-[1.5rem] pb-[1rem]">
              You can get a unique (male) model for your brand, which will not
              be used by any other clients. Please do keep in mind that only the
              face of the model changes, the pose remains the same.
            </p>
            <h4 className="text-secondary leading-[1rem] font-[700] text-[1.25rem] pb-[0.5rem]">
              Women custom face
            </h4>
            <p className="text-primaryLight text-[1rem] font-[400] leading-[1.5rem]">
              You can get a unique (female) model for your brand, which will not
              be used by any other clients. Please do keep in mind that only the
              face of the model changes, the pose remains the same.
            </p>
            {/* <p className="leading-[1.5rem] font-[700] text-primaryMediumLight text-[1rem] bg-[#EFE8F5] border-l-4 border-primary mt-[1.4rem] px-[1rem] italic">
              Note:{" "}
              <span className="text-primaryLight font-[400] text-[0.875rem] leading-[1.2rem]">
                All purchases made are final.
              </span>
            </p> */}
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default AddService;
