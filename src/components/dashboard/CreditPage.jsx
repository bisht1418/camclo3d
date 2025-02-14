import React, { useEffect, useState } from "react";
import plans from "../../utils/service/ourService";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  packageService,
  purchasePackage,
} from "../../services/ourServiceService";
import { toast } from "react-toastify";
import Razorpay from "../payment/Razorpay";
import { Link, Navigate, useNavigate } from "react-router-dom";

const CreditPage = () => {
  const [loading, setLoading] = useState(false);
  const [feature, setFeature] = useState({});
  const planData = useSelector((store) => store.service.package);
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  const serviceData = async () => {
    const response = await packageService();
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
  

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    return `${year}-${month}-${day}`;
  };
  const parseNote = (desc) => {
    if (!desc) return [];
    return desc
      .filter((line) => line.toLowerCase().startsWith("note -"))
      .map((line) => line.replace(/^note -\s*/i, "").trim());
  };

  const today = new Date();
  const formattedDate = formatDate(today);

  const handlePurchase = async (id) => {
    const formData = new FormData();
    formData.append("package_id", id);
    formData.append("start_date", formattedDate);
    setLoading(true);
    try {
      const response = await purchasePackage(formData);
      if (response?.status === 1) {
        toast.success("User Package Added Successful.");
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      toast.error("Error login");
    } finally {
      setLoading(false);
      close();
    }
  };

  const handlePayment = (feature) => {
    setFeature(feature);
  };

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  const navigateContact = () => {
    navigate("/contact-us");
  };

  return (
    <>
      <div className=" max-w-[80rem] grid sm:grid-cols-2 xl:grid-cols-4 px-[1rem] md:px-[1.25rem] w-full gap-[2.5rem] xl:gap-[1.5rem] pt-[2.788rem] lg:pt-[5.788rem] mx-auto">
        {planData[0]?.map((feature, index) => {
          const descriptionList = parseDescription(feature?.description);
          const notes = parseNote(descriptionList);
          return (
            <div
              key={index}
              className="w-full group h-[auto] py-[1.2rem] px-[1.5rem] rounded-2xl border border-primary  hover:bg-gradient-to-b from-[#92278F] to-[#AC83CF] hover:border-primary  flex flex-col relative"
            >
              <h3 className="leading-[1.5ren]  font-[800] text-[1.25rem] text-start text-secondary group-hover:text-white mb-[0.5rem] Barlow ">
                {feature?.name}
              </h3>
              <p className="leading-[1.375rem] pr-[0.5rem] font-[400] text-secondary text-[1rem] text-start group-hover:text-white Roboto ">
                {feature?.tagline}
              </p>

              <ul className="mt-[2rem] mb-[1rem]">
                {parseDescription(feature.description)?.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-[0.5rem] mb-[0.5rem]"
                  >
                    <span className=" h-4 w-4 p-[0.188rem] block ">
                      <FaCheck className="text-secondary group-hover:text-white text-[0.688rem]" />
                    </span>
                    <span className="group-hover:text-white font-[400] text-[1rem] leading-[1.25rem] Barlow">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <h2 className="text-[1.5rem] leading-[1.65rem] text-start font-[700] text-primary group-hover:text-white">
                Rs.{feature?.actual_price}
                <span className="text-primary font-[400] text-[.75rem] leading-[1.21rem] group-hover:text-white ">
                  /{feature?.credits}Credits
                </span>
              </h2>
              <p className="leading-[1.5rem] font-[400] text-primaryLight text-[1rem] text-start group-hover:text-white italic">
                ( pricePerImage {feature?.price_per_image})
              </p>
              {feature?.name &&
                feature.name.toLowerCase() !== "free" &&
                feature.name.toLowerCase() !== "gold" && (
                  <p className="leading-[1.5rem] font-[700] text-primary text-[1rem] text-start group-hover:text-white pt-[0.5rem] pb-[1rem]">
                    Note:{" "}
                    <span className="text-primaryLight font-[400] text-[.85rem] leading-[1.2rem] group-hover:text-white italic">
                      All purchases made are final.
                    </span>
                  </p>
                )}
              {feature?.name && feature.name.toLowerCase() !== "free" && (
                <Razorpay
                  feature={feature}
                  user={user}
                  handlePurchase={handlePurchase}
                  onClick={() => handlePayment(feature)}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="max-w-[80rem] m-auto">
        <div className="border border-[#E1D9E9] bg-[#F3F2F7] p-[1.5rem] m-auto  md:mt-[4.125rem] mt-[2.5rem] rounded-[1rem] shadow-[2px_2px_12px_0px_#CAC2D1] ">
          <div className="flex justify-between items-start flex-wrap">
            <div className="mb-2">
              <h3 className="font-[600] text-[2rem] leading-[1.875rem] text-secondary Barlow">
                Add on{" "}
                <span className="font-[700] text-[2rem] leading-[1.875rem] text-secondary  Barlow">
                  {" "}
                  Services
                </span>
              </h3>

              <p className="font-[700] text-[2.5rem] leading-[3rem] text-start  text-primary">
                {/* Rs.5000 */}
              </p>
            </div>
            {/* <Link to="/contact-us"> */}
            <button
              onClick={(e) => {
                e.preventDefault();
                navigateContact();
                handleClick();
              }}
              className="btn-purchase font-[700] text-[1rem] bg-white mb-2 hover:!bg-primary hover:!text-white"
            >
              Contact Us
            </button>
            {/* </Link> */}
          </div>
          <div className="flex flex-row flex-wrap gap-[1rem] py-[1.25rem]">
            <div className="md:w-[calc(50%-0.5rem)] w-full">
              <h4 className="text-secondary leading-[1rem] font-[700] text-[1.25rem]  pb-[0.5rem]">
                Men custom face
              </h4>
              <p className="text-primaryLight text-[1rem] font-[400] leading-[1.5rem] pb-[1rem]">
                You can get a unique (male) model for your brand, which will not
                be used by any other clients. Please do keep in mind that only
                the face of the model changes, the pose remains the same.
              </p>
            </div>

            <div className="md:w-[calc(50%-0.5rem)] w-full">
              <h4 className="text-secondary leading-[1rem] font-[700] text-[1.25rem] pb-[0.5rem]">
                Women custom face
              </h4>
              <p className="text-primaryLight text-[1rem] font-[400] leading-[1.5rem]">
                You can get a unique (female) model for your brand, which will
                not be used by any other clients. Please do keep in mind that
                only the face of the model changes, the pose remains the same.
              </p>
            </div>
          </div>
          {/* <p className="leading-[1.5rem] font-[700] text-primary text-[.9rem] w-[16rem] px-[.5rem] mx-auto bg-[white] border-l-[0.188rem] border-primary   italic ">
            Note:{" "}
            <span className="text-primaryLight font-[400] text-[0.9rem] leading-[1.2rem] italic">
              All purchases made are final.
            </span>
          </p> */}
        </div>
      </div>
    </>
  );
};

export default CreditPage;
