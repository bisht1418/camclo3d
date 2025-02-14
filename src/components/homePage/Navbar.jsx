import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { store } from "../../redux/store";
import { clearAuth } from "../../redux/slice/authSlice";
import { setIsAuthenticated } from "../../redux/slice/globalSlice";
import { toast } from "react-toastify";
import { RiMenu2Fill } from "react-icons/ri";
import { userLogout } from "../../services/authService";

const Navbar = ({ onClose, onCloseLogin }) => {
  const [activeLink, setActiveLink] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/service" },
    { name: "About us", path: "/about-us" },
    { name: "Contact us", path: "/contact-us" },
    { name: "FAQ", path: "/faq" },
  ];
  const isAuthenticated = useSelector(
    (store) => store.global?.is_authenticated
  );


  function updateBodyOverflowClass(isMobileOpen) {
    if (isMobileOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }

  const location = useLocation();

  useEffect(() => {
    const currentIndex = links.findIndex(
      (link) => link.path === location.pathname
    );
    if (currentIndex !== -1) {
      setActiveLink(currentIndex);
    }
  }, [location, links]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsMobileOpen(false);
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    toast.success("User Log Out Successfully");

    localStorage.removeItem("activeLink");
    localStorage.removeItem("profileOpen");
    localStorage.removeItem("visualizer");
    await userLogout();
  };
  return (
    <header className="shadow-lg py-[0.625rem] bg-[#fff]">
      <div className="max-w-[80rem] px-[1.25rem] mx-auto flex justify-between items-center relative">
        <Link to="/">
          <img className="h-[4rem]" src={"/logo_new.png"} />
        </Link>
        <div className="hidden md:flex items-center gap-[2rem] lg:gap-[3rem]">
          {links.map((item, i) => (
            <div
              key={i}
              onClick={(e) => {
                setActiveLink(i);
              }}
              className={`navbar-link ${activeLink == i ? "active" : ""}`}
            >
              <Link to={item?.path}>{item?.name}</Link>
            </div>
          ))}
        </div>

        <div className="hidden md:flex gap-[0.9rem]">
          {isAuthenticated ? (
            <Link to="/dashboard">
              {" "}
              <button className="btn-outline">Dashboard</button>
            </Link>
          ) : (
            <button
              className="btn-outline"
              onClick={() => {
                localStorage.removeItem("visualizer");
                localStorage.removeItem("credit");
                onCloseLogin();
              }}
            >
              Login
            </button>
          )}
          {isAuthenticated ? (
            <button
              className="btn-primary"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() => {
                localStorage.removeItem("visualizer");
                localStorage.removeItem("credit");
                onClose();
              }}
            >
              Sign up
            </button>
          )}
        </div>
        <button
          onClick={() => {
            updateBodyOverflowClass(!isMobileOpen);
            setIsMobileOpen(!isMobileOpen);
          }}
          className="block md:hidden"
        >
          <RiMenu2Fill size={30} fill="#8c2a8d" />
        </button>
        {isMobileOpen && (
          <div className="absolute md:hidden !z-[99] top-[4.6rem] left-[0px] w-full min-h-[calc(100vh-5rem)] h-full bg-white ">
            <div className="p-[1.25rem] h-full flex flex-col gap-[2rem]">
              <div className="flex flex-col items-start gap-[1.5rem]">
                {links.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveLink(i);
                      updateBodyOverflowClass(!isMobileOpen);
                    }}
                    className={`navbar-link ${
                      activeLink === i ? "active" : ""
                    }`}
                  >
                    <Link to={item?.path}>{item?.name}</Link>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-[0.9rem]">
                  {isAuthenticated ? (
                    <Link to="/dashboard">
                      {" "}
                      <button className="btn-outline">Dashboard</button>
                    </Link>
                  ) : (
                    <button
                      className="btn-outline"
                      onClick={() => {
                        localStorage.removeItem("visualizer");
                        localStorage.removeItem("credit");
                        onCloseLogin();
                      }}
                    >
                      Login
                    </button>
                  )}

                  {isAuthenticated ? (
                    <button className="btn-primary" onClick={onClose}>
                      Logout
                    </button>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => {
                        localStorage.removeItem("visualizer");
                        localStorage.removeItem("credit");
                        onClose();
                      }}
                    >
                      Sign up
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
