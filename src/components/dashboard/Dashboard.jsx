import React, { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import ImageDownloadPopup from "./ImageDownloadPopup";
import GeneratedImagePopup from "./GeneratedImagePopup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


// Status color mappings for easy reference
const statusColors = {
  Completed: {
    bg: "bg-green-100",
    text: "text-green-800"
  },
  Processing: {
    bg: "bg-blue-100",
    text: "text-blue-800"
  },
  Failed: {
    bg: "bg-red-100",
    text: "text-red-800"
  }
};

// Template size categories for filtering
const templateSizeCategories = {
  small: { min: 1, max: 10 },
  medium: { min: 11, max: 20 },
  large: { min: 21, max: Number.POSITIVE_INFINITY }
};

export { statusColors, templateSizeCategories };

const DashboardComponent = ({ profileOpen, dashboard }) => {
  const [imageDownload, setImageDownload] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [showGeneratedImage, setShowGeneratedImage] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [showMoreFabric, setShowMoreFabric] = useState(false);
  const [openDisclaimer, setOpenDisclaimer] = useState(false);
  const navigate = useNavigate();

  const navigateToVisualizer = () => {
    if (dashboard?.remaining_credit <= 0) {
      toast.error("Insufficient credits to access Visualizer.");
      return;
    }

    window.scrollTo(0, 0);
    navigate("/visualizer");
  };

  // Replace the old handlers
  const handleNavigation = (name) => {
    if (name === "Visualizer") {
      navigateToVisualizer(false);
    }
  };

  const dashboardData = [
    {
      title: "Uploaded Fabrics",
      icon: "/dashboard_upload.png",
      value: 20,
    },
    {
      title: "Generated Images",
      icon: "/dashboard_images.png",
      value: 15,
    },
    {
      title: "Used credits",
      icon: "/dashboard_purchase.png",
      value: 10,
    },
    {
      title: "Remaining credits",
      icon: "/dashboard_time.png",
      value: 10,
    },
  ];

  const updatedDashboardData = dashboardData?.map((item) => {
    switch (item?.title) {
      case "Uploaded Fabrics":
        return { ...item, value: dashboard?.upload_fabric };
      case "Generated Images":
        return { ...item, value: dashboard?.generated_images?.length };
      case "Remaining credits":
        return { ...item, value: dashboard?.remaining_credit };
      case "Used credits":
        return { ...item, value: dashboard?.used_credit };
      default:
        return item;
    }
  });
  useEffect(() => {
    if (dashboard?.remaining_credit !== undefined && dashboard?.used_credit !== undefined) {
      const totalCredit = dashboard.remaining_credit + dashboard.used_credit;
      localStorage.setItem("totalCredit", totalCredit);
    }
  }, [dashboard?.remaining_credit, dashboard?.used_credit]);

  const handleDownload = (item) => {
    setImageDownload(item);
    setOpenImage(!openImage);
  };

  const handelShowMore = () => {
    setShowGeneratedImage(!showGeneratedImage);
  };

  const handelShowMoreFabric = () => {
    setShowMoreFabric(!showMoreFabric);
  };

  useEffect(() => {
    if (openImage || showGeneratedImage || showMoreFabric || openDownload) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [openImage, showGeneratedImage, openDownload, showMoreFabric]);

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  const handleVisualizerClick = () => {
    handleNavigation("Visualizer");
    handleClick();
  };

  return (
    <div className="">
      {openImage && (
        <ImageDownloadPopup
          imageDownload={imageDownload}
          handleDownload={handleDownload}
        />
      )}
      {showGeneratedImage && (
        <GeneratedImagePopup
          dashboard={dashboard}
          handelShowMore={handelShowMore}
          handleDownload={handleDownload}
          title={"Generated Image"}
        />
      )}
      {showMoreFabric && (
        <GeneratedImagePopup
          dashboard={dashboard}
          title={"Uploaded Fabric"}
          handelShowMoreFabric={handelShowMoreFabric}
        />
      )}

      {profileOpen === 1 || profileOpen === 2 ? null : (
        <div className="px-[1rem] md:px-[3.125rem] pt-[2rem] md:pt-[3.125rem] flex flex-col gap-[2rem] md:gap-[3.125rem]">
          <h1 className="text-secondary text-[2rem] font-[600]">Dashboard</h1>
          <div className="flex flex-wrap gap-[1.5rem] w-full">
            {updatedDashboardData?.map((item, i) => (
              item?.title !== "Uploaded Fabrics" && (
                <div
                  key={i}
                  className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33%-1.15rem)] bg-[white] rounded-[0.5rem] p-[1rem_1.875rem] border border-[#E1D9E9] shadow-md gap-2"
                >
                  <div className="flex flex-col  gap-[0.625rem] ">
                    <p className="text-[1.5rem] text-primary font-[500] leading-[1.2rem]">
                      {item?.title}
                    </p>
                  </div>
                  <div className="flex justify-between gap-[1.125rem] items-end">
                    <p className="text-[3rem] text-secondary font-[700] leading-[3.45rem]">
                      {item?.value}
                    </p>
                    <div className="h-[4.5rem] w-[4.5rem] rounded-full bg-[#92278F4D] flex justify-center items-center">
                      <img
                        className={i === 0 || i === 2 ? "h-[3rem] w-[3rem]" : "h-[2.5rem] w-[2.5rem]"}
                        src={item?.icon}
                      />
                    </div>
                  </div>
                </div>
              )
            ))}

            <div className="w-full bg-[white] rounded-[0.5rem] p-[1.563rem_1.875rem] shadow-md">
              <div className="flex flex-col gap-[1.5rem]">
                <h1 className="text-secondary text-[2rem] leading-[2.4rem] font-[600]">
                  Generated Image
                </h1>
                {dashboard?.generated_images && dashboard?.generated_images?.length > 0 ? (
                  <div className="w-full flex gap-[1rem] flex-wrap">
                    {dashboard?.generated_images.slice(0, 15).map((item) => (
                      <div
                        key={item?.id}
                        className="w-[calc(50%-0.8rem)] sm:w-[calc((100%/3)-0.8rem)] md:w-[calc(25%-0.8rem)] lg:w-[calc(12%-0.8rem)] relative border border-[#E1D9E9]"
                        onClick={(e) => {
                          e.preventDefault(), handleDownload(item?.image);
                        }}
                      >
                        <img
                          className="h-[10rem] sm:h-[10rem] md:h-[6rem] lg:h-[7rem] w-full object-contain"
                          src={item?.image}
                          alt={item?.name}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <p className="text-gray-500">No generated images available.</p>
                  </div>
                )}
                {dashboard?.generated_images?.length > 15 && (
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handelShowMore();
                        setOpenDownload(false);
                      }}
                      className="btn-outline font-[500] border-[0.063rem] rounded-[0.5rem]"
                    >
                      Show More
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full border-[0.125rem] border-[white] rounded-[1.25rem] bg-[url('/dashboard_last_section_bg.png')] h-full bg-cover shadow-[0rem_0rem_0.313rem_0rem_#8C2A8D80]">
              <div className="flex justify-between">
                <div className="flex flex-col items-center md:items-start gap-[2.25rem] p-[3.125rem] pb-[3.625rem] w-full">
                  <p className="text-center md:text-start text-white text-[2.5rem] leading-[2.75rem] font-[700]">
                    Visualize Your Fabric Now
                  </p>
                  <button
                    onClick={handleVisualizerClick}
                    className="p-[0.75rem_1.375rem] bg-primary border border-[white] w-fit rounded-[0.5rem] text-[white] text-[1rem] font-[700] leading-[1.2rem]"
                  >
                    Visualize Now
                  </button>
                </div>
                <div className="hidden md:flex mr-[3.125rem]">
                  <img
                    className="h-full w-full object-cover"
                    src="/dashboard_last_section_right.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardComponent;