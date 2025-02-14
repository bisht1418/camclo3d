import React, { useState } from "react";
import CreditPage from "./CreditPage";
import Myplan from "./Myplan";
import DashboardNavbar from "./DashboardNavbar";

const Credit = ({ title }) => {
  const [active, setActive] = useState(0);
  return (
    <>
      <DashboardNavbar />
      <div className="container-custom">
        <h1 className="text-secondary text-[2rem] font-semibold my-[3.125rem]">
          {title}
        </h1>
        <div className="flex flex-col bg-white lg:px-[3.125rem] px-10 pt-[4.375rem] pb-[1.875rem] rounded-[1rem]">
          <div className="text-center ">
            <h2 className="font-[700] text-[1.5rem] leading-[1.8rem] text-secondary Barlow">
              {active ? "Purchase History" : "Purchase a plan"}
            </h2>
            <p className="text-[1rem] leading-[1.2rem] font-[400] Barlow text-primaryLight my-[1rem]">
              {active
                ? "See your plans and History"
                : " Choose the plan that work for you."}
            </p>
            <div className="mx-auto w-[200px] md:w-[300px] flex flex-row bg-primaryInputBorder rounded-full gap-[.25rem]  ">
              <button
                className={`${active === 0 ? "btn-primary" : ""} ${
                  active === 0 ? "rounded-full" : ""
                } w-[9.375rem] m-[0.25rem]   p-[0.625rem]`}
                onClick={() => setActive(0)}
              >
                Credits
              </button>
              <button
                className={`${active === 1 ? "btn-primary" : ""} ${
                  active === 1 ? "rounded-full" : ""
                } w-[9.375rem] m-[0.25rem]   p-[0.625rem]`}
                onClick={() => setActive(1)}
              >
                My Plan
              </button>
            </div>
          </div>
          {active ? <Myplan /> : <CreditPage />}
        </div>
      </div>
    </>
  );
};

export default Credit;
