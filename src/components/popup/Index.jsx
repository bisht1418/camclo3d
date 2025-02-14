import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

const PopupTemplete = ({
  title,
  bodyComponent,
  onClose,
  removeTokenFromURL,
}) => {
  return (
    <div className="absolute top-0 flex justify-center items-center left-0 h-screen w-full bg-[#00000050] z-[100] ">
      <div className="relative  w-full md:w-[46.875rem] m-auto bg-[white] md:rounded-[1.25rem] min-h-screen md:min-h-fit">
        <div className="absolute mx-[auto] top-[7%] md:top-[0%] translate-y-[-50%] translate-x-[-50%] left-[50%] rounded-[0.75rem] w-[90%] md:w-[41.875rem] h-[3.5rem] bg-gradient-to-r from-primaryDark to-primaryMediumLight">
          <div className="flex px-[1.625rem] items-center justify-between h-full">
            <p className="text-[1.25rem] font-[700] text-[white] leading-[1.813rem]">
              {title}
            </p>
            <IoCloseCircleOutline
              style={{ cursor: "pointer" }}
              color="white"
              size={20}
              onClick={() => {
                switch (title) {
                  case "Sign up":
                    onClose("openSignup");
                    break;
                  case "Log In":
                    onClose("openLogin");
                    break;
                  case "Verify OTP":
                    onClose("openOTP");
                    break;
                  case "Forget Password":
                    onClose("openForgetPassword");
                    break;
                  case "Verify Mobile Number":
                    onClose("openMobile");
                    break;
                  case "Reset Password":
                    onClose("openResetPassword");
                    removeTokenFromURL();
                    break;
                  default:
                    break;
                }
              }}
            />
          </div>
        </div>
        <div className="w-full mt-[10rem] md:mt-[3rem] flex flex-col gap-[1rem]">
          <img className="h-[5rem]  object-contain" src={"/logo_new.png"} />
          <div className="max-w-[95%] px-[1.25rem] w-full m-auto">
            {bodyComponent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupTemplete;
