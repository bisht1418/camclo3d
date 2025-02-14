import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const InstantFebric = ({ handleLogin }) => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  const isAuthenticated = useSelector(store => store?.auth?.token)

  return (
    <div className="py-[3rem] md:py-[6rem]">
      <div className="relative z-[2] max-w-[80rem] px-[1.25rem] w-full flex flex-col md:flex-row gap-[2.25rem] md:gap-[3.25rem] items-center m-auto ">
        <div className="w-full md:w-[45%]">
          <img
            className="h-auto w-full max-h-[30rem] object-cover"
            src={"/instantFebric.png"}
          />
        </div>
        <div className="flex flex-col gap-[2rem] w-full md:w-[55%]">
          <div className="flex flex-col gap-[1rem]">
            <h1 className="text-secondary leading-[3.375rem] font-[600] text-[2.813rem]">
              Instant Fabric Transformation at &nbsp;
              <span className="text-primary">Your Fingertips</span>
            </h1>
            <p className="text-primaryLight text-[1rem] font-[400] leading-[1.5rem] pt-[1rem]">
              Revolutionize garment design with our advanced digital draping
              capabilities. Our innovative software allows you to effortlessly
              create, refine, and visualize fabric designs with precision.
              Whether you're designing sarees, kurtas, shirts, or other
              garments, our intuitive tools provide unparalleled flexibility and
              accuracy. Transform your fabric concepts into stunning, realistic
              representations in just a few clicks, empowering you to bring your
              vision to life with ease.
            </p>
          </div>
          <div>
          <div>
            {
              isAuthenticated ? (
                <Link to="/visualizer">
                  <button
           
                className="btn-primary text-[1rem] font-[500] leading-[1.5rem]"
              >
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
              )
            }
       
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantFebric;
