import React, { useEffect, useRef, useState } from "react";
import Notification from "./Notification";
import { FaRegUser } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import { MdOutlineChangeCircle } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import {
  myProfile,
  userLogout,
  userNotification,
} from "../../services/authService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { dashboardService } from "../../services/dashboardService";

const links = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Visualizer", path: "/visualizer" },
  { name: "Credit", path: "/credit" },
];

const DashboardNavbar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [openNotification, SetOpenNotification] = useState(false);
  const [mobileView, setMobileView] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const dashboard = useSelector((store) => store.dashboard.dashboard);
  const image = useSelector((store) => store.auth.user)?.image;
  const [activeLink, setActiveLink] = useState(0);
  const [profileOpen, setProfileOpen] = useState(0);

  useEffect(() => {
    const currentIndex = links.findIndex(
      (link) => link.path === location.pathname
    );
    if (currentIndex !== -1) {
      setActiveLink(currentIndex);
    }
  }, [location, links]);

  const profileTriggerRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const toggleTriggerRef = useRef(null);
  const notificationTriggerRef = useRef(null);

  const handleProfile = () => {
    setOpenProfile(!openProfile);
  };

  const myProfileData = async () => {
    let res = await myProfile();
  };
  const profile = useSelector((store) => store.auth.myProfile);

  const handleLogout = async () => {
    toast.success("User Log Out Successfully");
    document.body.classList.remove("overflow-hidden");
    setOpenProfile(false);
    localStorage.removeItem("credit");
    localStorage.removeItem("visualizer");
    await userLogout();
  };

  const handleClickOutside = (event) => {
    if (
      profileTriggerRef.current &&
      !profileTriggerRef.current.contains(event.target) &&
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      setOpenProfile(false);
    } else if (
      toggleTriggerRef.current &&
      !toggleTriggerRef.current.contains(event.target)
    ) {
      setToggle(false);
    } else if (
      notificationTriggerRef.current &&
      !notificationTriggerRef.current.contains(event.target)
    ) {
      SetOpenNotification(false);
    }
  };
  let creditData = localStorage.getItem("credit");
  let naviData = localStorage.getItem("visualizer");

  const navigate = useNavigate();

  useEffect(() => {
    if (creditData) {
      document.body.classList.add("overflow-hidden");
      localStorage.removeItem("credit");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Clean up the effect on unmount
  }, [naviData, creditData]);

  const onClose = () => {
    SetOpenNotification(!openNotification);
  };

  useEffect(() => {
    document?.addEventListener("mousedown", handleClickOutside);
    return () => {
      document?.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    myProfileData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      setIsMobile(newWidth <= 768);
      if (newWidth < 768) {
        setMobileView(true);
      } else {
        setMobileView(false);
      }
    };
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const notificationData = useSelector((store) => store.auth.notification);

  const fetchNotification = async () => {
    const res = await userNotification();
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchDashboardData = async () => {
    const response = await dashboardService();
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeLink === 0]);

  const handleLinkClick = (i, name, path) => {
    if (dashboard?.remaining_credit <= 0 && name === "Visualizer") {
      toast.error("Insufficient credits to access Visualizer.");
      return;
    }
    setActiveLink(i);
    navigate(path);
  };
  return (
    <div className="container-custom border-b-[0.063rem] border-primaryInputBorder py-4">
      <div className="flex justify-between items-center z-50 ">
        <Link to="/">
          <img className="h-[4rem]" src={"/logo_new.png"} alt="Visualizer" />
        </Link>

        <div className="hidden md:flex items-center gap-[2rem] lg:gap-[5.313rem]">
          {links?.map((item, i) => (
            <div
              key={i}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(i, item?.name, item?.path);
              }}
              className={`${
                activeLink === i
                  ? `${
                      profileOpen !== 0 ? "text-primaryLight" : "text-primary"
                    }`
                  : "text-primaryLight"
              } text-[1.15rem] leading-[1.35rem] menu-item cursor-pointer ${
                activeLink === i ? "font-[700]" : "font-[500]"
              }`}
            >
              <Link>{item?.name}</Link>
            </div>
          ))}
        </div>
        {/* <div }> */}
        {toggle && (
          <div
            ref={toggleTriggerRef}
            className="absolute md:hidden z-[10] top-[4.6rem] left-[0px] w-full min-h-[calc(100vh-5rem)] h-full bg-white "
          >
            <div className="p-[1.25rem] h-full flex flex-col gap-[2rem]">
              <div className="flex flex-col items-start gap-[1.5rem]">
                {links.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveLink(i);
                      setIsMobile(!isMobile);
                      setToggle(!toggle);
                      handleLinkClick(i, item?.name, item?.path);
                    }}
                    className={`navbar-link ${
                      activeLink === i ? "active" : ""
                    }`}
                  >
                    <Link to={item?.path}>{item?.name}</Link>
                  </div>
                ))}
              </div>
              <div className="flex gap-[0.9rem]">
                <button className="btn-outline" onClick={handleLogout}>
                  LogOut
                </button>
              </div>
            </div>
          </div>
        )}
        {/* </div> */}

        <div className="flex justify-center items-center">
          <div
            ref={notificationTriggerRef}
            className="relative w-12 h-12 bg-purpleLight rounded-[0.938rem] flex items-center justify-center"
            onClick={() => SetOpenNotification(!openNotification)}
          >
            <img src="/icn-bell.svg" alt="" className="w-7 h-7" />
            <div className="w-6 h-6 bg-primary text-white !text-xs rounded-full flex items-center justify-center m-auto absolute top-[-.5rem] right-[-.5rem] border-[0.125rem] border-white">
              {notificationData?.length || 0}
            </div>
            {openNotification && (
              <div className="absolute top-10 sm:right-[-40px] right-[-13rem]">
                <Notification
                  open={openNotification}
                  onClose={onClose}
                  notificationData={notificationData}
                />
              </div>
            )}
          </div>

          <span className="w-px h-14 bg-primaryInputBorder ms-4 me-2 lg:me-10 lg:ms-6"></span>
          <div className="flex justify-center items-center lg:gap-x-5 gap-x-2">
            {mobileView ? (
              ""
            ) : (
              <p className="text-secondary">
                Hello, <span className="font-bold">{profile?.first_name}</span>
              </p>
            )}

            <div className="relative z-50">
              <div
                onClick={() => handleProfile()}
                ref={profileTriggerRef}
                className="bg-white cursor-pointer rounded-full"
              >
                <img
                  src={image || "/universalUser.jpg"}
                  alt="User"
                  className="min-w-14 min-h-14 w-14 h-14 rounded-full border-white border-4 object-cover"
                />
              </div>
              {openProfile && (
                <div
                  ref={profileDropdownRef}
                  className="absolute top-[4.5rem] right-0 w-[13rem] bg-white rounded-lg shadow-lg border border-gray-200"
                >
                  {/* My Profile Option */}
                  <div
                    className={`flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                      profileOpen === 1 ? "bg-gray-200" : "bg-white"
                    }`}
                    onClick={() => {
                      navigate("/profile");
                      setToggle(null);
                      setOpenProfile(null);
                    }}
                  >
                    <img
                      src="/userNameIcon.png"
                      alt="Profile"
                      className="w-5 h-5"
                    />
                    <p className="text-gray-700 text-sm font-medium">
                      My Profile
                    </p>
                  </div>

                  {/* Change Password Option */}
                  {!profile?.social_login && (
                    <div
                      className={`flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                        profileOpen === 2 ? "bg-gray-200" : "bg-white"
                      }`}
                      onClick={() => {
                        navigate("/change-password");
                        setToggle(null);
                        setOpenProfile(null);
                      }}
                    >
                      <img
                        src="/changePasswordIcon.png"
                        alt="Change Password"
                        className="w-5 h-5"
                      />
                      <p className="text-gray-700 text-sm font-medium">
                        Change Password
                      </p>
                    </div>
                  )}

                  {/* Logout Option */}
                  <div
                    className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <TbLogout size={20} className="text-primary" />
                    <p className="text-gray-700 text-sm font-medium">Logout</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setIsMobile(!isMobile);
                setToggle(!toggle);
              }}
              className="block md:hidden ms-4"
            >
              <RiMenu2Fill size={30} fill="#8c2a8d" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
