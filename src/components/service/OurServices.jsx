import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { packageService, purchasePackage } from "../../services/ourServiceService";
import { toast } from "react-toastify";
import Razorpay from "../payment/Razorpay";

const OurServices = ({ handleLogin }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const isAuthenticated = useSelector((store) => store?.auth?.token);
  const planData = useSelector((store) => store.service.package);
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  const serviceData = async () => {
    const response = await packageService();
    // Handle response if needed
  };

  useEffect(() => {
    serviceData();
  }, []);

  const stripHtmlTags = (htmlString) => {
    return htmlString.replace(/<[^>]*>/g, "");
  };

  const parseDescription = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
  
    // Get list items (li) if they exist
    const listItems = Array.from(doc.body.querySelectorAll("li")).map((li) =>
      stripHtmlTags(li.innerHTML).trim()
    );
  
    // If no list items, fallback to paragraph or any block elements (like div, p)
    if (listItems.length === 0) {
      return Array.from(doc.body.querySelectorAll("p, div")).map((el) =>
        stripHtmlTags(el.innerHTML).trim()
      );
    }
  
    return listItems;
  };

  const parseNote = (desc) => {
    if (!desc) return [];
    return desc
      .filter((line) => line.toLowerCase().startsWith("note -"))
      .map((line) => line.replace(/^note -\s*/i, "").trim());
  };

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handlePurchase = async (id) => {
    const formData = new FormData();
    formData.append("package_id", id);
    formData.append("start_date", formatDate(new Date()));
    setLoading(true);
    try {
      const response = await purchasePackage(formData);
      if (response?.status === 1) {
        toast.success("User Package Added Successfully.");
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      toast.error("Error during purchase");
    } finally {
      setLoading(false);
      setSelectedFeature(null);
    }
  };

  const handlePayment = (feature) => {
    setSelectedFeature(feature);
  };

  return (
    <div className="flex-col py-[3rem] lg:py-[5.938rem]">
      <div className="max-w-[80rem] px-[1.25rem] mx-auto">
        <h2 className="leading-[3.375rem] font-[700] text-[2.813rem] text-center text-secondary ">
          Take a Look Into <span className="text-primary">Our Services</span>
        </h2>
      </div>
      <div className="max-w-[80rem] grid sm:grid-cols-2 xl:grid-cols-4 px-[1rem] md:px-[1.25rem] w-full gap-x-[2rem] gap-y-[2rem] xl:gap-y-[2.5rem] pt-[2.788rem] lg:pt-[5.788rem] mx-auto">
        {planData &&
          planData[0]?.map((feature, index) => {
            const descriptionList = parseDescription(feature?.description);
            const notes = parseNote(descriptionList);
            return (
              <div
                key={index}
                className="w-full hover:translate-y-[-3%] ease-in-out duration-500 group h-[auto] py-[1.2rem] px-[1.5rem] rounded-2xl border border-[#E1D9E9] hover:bg-primary hover:border-primary flex flex-col relative"
              >
                <img
                  src="/cardVactor.png"
                  alt="#"
                  className="absolute w-full top-0 left-0"
                />
                <h3 className="leading-[2.25ren] font-[700] text-[1.5rem] text-center text-secondary group-hover:text-white mb-[0.5rem] ">
                  {feature.name}
                </h3>
                <p className="leading-[1.5rem] font-[400] text-primaryLight text-[1rem] text-center group-hover:text-white px-[1.40rem] pb-[1.4rem]">
                  {feature?.tagline}
                </p>
                <h2 className="text-[1.5rem] leading-[2rem] text-center font-bold text-primary group-hover:text-white">
                  Rs.{feature?.actual_price}
                  <span className="text-primary font-[400] text-[.75rem] leading-[1rem] group-hover:text-white ">
                    /{feature?.credits} Credits
                  </span>
                </h2>
                <p className="leading-[1.5rem] font-[400] text-primaryLight text-[1rem] text-center group-hover:text-white italic">
                  (pricePerImage - Rs. {feature?.price_per_image})
                </p>
                <ul className="mt-[2rem] mb-[1rem]">
                  {parseDescription(feature?.description)?.map(
                    (item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-[0.5rem] mb-[0.5rem]"
                      >
                        <span className="h-4 w-4 p-[0.188rem] block rounded-full bg-primary group-hover:bg-white">
                          <FaCheck className="text-white group-hover:text-primary text-[0.688rem]" />
                        </span>
                        <span className="group-hover:text-white font-[400] text-[1rem] leading-[1.25rem]">
                          {item}
                        </span>
                      </li>
                    )
                  )}
                </ul>

                {notes.length > 0 && (
                  <p className="leading-[1.5rem] font-[700] text-primary text-[1rem] text-center group-hover:text-white pt-[0.5rem] pb-[1rem]">
                    Note:{" "}
                    {notes.map((note, idx) => (
                      <span
                        key={idx}
                        className="text-primaryLight font-[400] text-[.85rem] leading-[1.2rem] group-hover:text-white italic"
                      >
                        {note}
                      </span>
                    ))}
                  </p>
                )}
                {isAuthenticated ? (
                  feature?.name && feature.name.toLowerCase() !== "free" ? (
                    <Razorpay
                      feature={feature}
                      user={user}
                      handlePurchase={handlePurchase}
                      onClick={() => handlePayment(feature)}
                    />
                  ) : (
                    <button
                      type="submit"
                      className="btn-primary mt-[auto] text-[1rem] font-[500] z-10 leading-[1.5rem] w-full group-hover:!bg-white group-hover:!text-primary"
                      onClick={() => {
                        handleClick();
                        // Handle free package selection
                      }}
                    >
                      Start for free
                    </button>
                  )
                ) : (
                  <button
                    type="submit"
                    className="btn-primary mt-[auto] text-[1rem] font-[500] z-10 leading-[1.5rem] w-full group-hover:!bg-white group-hover:!text-primary"
                    onClick={() => {
                      handleLogin();
                      handleClick();
                    }}
                  >
                    {feature?.name === "Free"
                      ? "Start for free"
                      : "Purchase Credits"}
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default OurServices;