import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HeroSection = ({ handleLogin }) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

  const isAuthenticated = useSelector(store=>store?.auth?.token)

  const handleClick = () => {
    window.scrollTo(0, 0);
  };
  return (
    <section className="w-full overflow-hidden relative bg-[#F9FAFE]  py-[3rem] lg:py-[6rem]">
      <img
        className="absolute top-0 left-0 w-full rotate-[180deg] opacity-[0.2] z-[0]"
        src="/bg.png"
        alt=""
      />
      <div className="relative z-[2] max-w-[80rem] px-[1.25rem] w-full flex flex-col md:flex-row gap-[2rem] justify-between items-center m-auto">
        <div className="w-full md:w-1/2 flex flex-col gap-[2rem]">
          <div className="flex flex-col gap-[1rem]">
            <h1 className="text-secondary leading-[4.625rem] font-[600] text-[4rem]">
              Experience Fabric Magic
              <span className="text-primary">&nbsp;in Seconds</span>
            </h1>
            <p className="text-primaryLight text-[1rem] font-[400] leading-[1.5rem]">
              Transform fabrics instantly with our mesmerizing techniques!
            </p>
          </div>
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
        <div className="w-full md:w-1/2">
          <Slider {...settings}>
            <div>
              <img
                className="h-[30rem] w-full object-cover"
                src={"/hero.jpeg"}
              />
            </div>
            <div>
              <img
                className="h-[30rem] w-full object-cover"
                src={"/bannerImage2.png"}
              />
            </div>
            <div>
              <img
                className="h-[30rem] w-full object-cover"
                src={"/bannerImage3.png"}
              />
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
