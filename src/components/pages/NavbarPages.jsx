import React, { useEffect, useState } from "react";
import Navbar from "../homePage/Navbar";
import PopupTemplete from "../popup/Index";
import SignUpPopup from "../popup/SignUpPopup";
import ForgetPassword from "../popup/ForgetPassword";
import LoginPopup from "../popup/LoginPopup";
import VerifyOTP from "../popup/VerifyOTP";
import ResetPassword from "../popup/ResetPassword";
import MobilePopup from "../popup/MobilePopup";

const NavbarPages = (props) => {
  const { modalOpen, handleLogin } = props;
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const [open, setOpen] = useState({
    openSignup: false,
    openLogin: false,
    openOTP: false,
    openForgetPassword: false,
    openResetPassword: false,
    openMobile: false,
  });

  const onClose = (modalType) => {
    setOpen((prevState) => {
      const newState = {
        openSignup: false,
        openLogin: false,
        openOTP: false,
        openForgetPassword: false,
        openResetPassword: false,
        openMobile: false,
      };
      newState[modalType] = !prevState[modalType];
      updateBodyOverflowClass(newState);
      if (modalOpen) {
        handleLogin();
        updateBodyOverflowClass(newState);
      }
      return newState;
    });
  };

  function updateBodyOverflowClass(modalStates) {
    const hasOpenModal = Object.values(modalStates).some(
      (state) => state === true
    );
    if (hasOpenModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }

  const removeTokenFromURL = () => {
    const baseUrl = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, baseUrl);
  };

  return (
    <>
      <Navbar
        onClose={() => onClose("openSignup")}
        onCloseLogin={() => onClose("openLogin")}
      />
      {open?.openSignup && (
        <PopupTemplete
          title={"Sign up"}
          bodyComponent={
            <SignUpPopup setOpen={setOpen} onClose={(view) => onClose(view)} />
          }
          onClose={() => onClose("openSignup")}
        />
      )}
      {open?.openForgetPassword && (
        <PopupTemplete
          title={"Forget Password"}
          bodyComponent={
            <ForgetPassword
              setOpen={setOpen}
              onClose={(view) => onClose(view)}
            />
          }
          onClose={onClose}
        />
      )}

      {(open?.openLogin || modalOpen) && (
        <PopupTemplete
          title={"Log In"}
          bodyComponent={
            <LoginPopup setOpen={setOpen} onClose={(view) => onClose(view)} />
          }
          onClose={modalOpen ? () => handleLogin() : onClose}
        />
      )}

      {open?.openOTP ? (
        <PopupTemplete
          title={"Verify OTP"}
          bodyComponent={<VerifyOTP onClose={(view) => onClose(view)} />}
          onClose={onClose}
        />
      ) : null}
      {token && (
        <PopupTemplete
          title={"Reset Password"}
          bodyComponent={
            <ResetPassword token={token} onClose={(view) => onClose(view)} />
          }
          onClose={onClose}
          removeTokenFromURL={removeTokenFromURL}
        />
      )}
      {open?.openMobile && (
        <PopupTemplete
          title={"Verify Mobile Number"}
          bodyComponent={
            <MobilePopup token={token} onClose={(view) => onClose(view)} />
          }
          onClose={onClose}
        />
      )}
    </>
  );
};

export default NavbarPages;
