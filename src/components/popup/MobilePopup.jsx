import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgetPassword, mobileVerify } from "../../services/authService";
import { forgetPasswordSchema } from "../../schema/forgetPasswordSchema";
import { toast } from "react-toastify";
import { LuPhone } from "react-icons/lu";
import { mobileSchema } from "../../schema/mobileSchema";
import { useSelector } from "react-redux";

const MobilePopup = ({ setOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const user_id = useSelector((store) => store.auth.user)._id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(mobileSchema),
  });
  const onSubmit = async (data) => {
    localStorage.setItem("mobile_number", data?.phone_number);
    const formData = new FormData();
    formData.append("phone_number", data?.phone_number);
    formData.append("user_id", user_id);
    setLoading(true);
    try {
      const response = await mobileVerify(formData);
      if (response?.status === 1) {
        toast.success(response?.message);
        onClose("openOTP");
        close();
      } else {
        const errors = response?.response?.data?.error;
        if (errors) {
          setError("phone_number", { message: errors.phone_number[0] });
        }
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      return error;
      // toast.error("Error Forget Password");
    } finally {
      setLoading(false);
    }
  };
  const close = () => {
    reset({
      phone_number: "",
    });
  };
  const handleKeyPressNumber = (event) => {
    const charCode = event.charCode;
    if (!/[0-9]/.test(String.fromCharCode(charCode))) {
      event.preventDefault();
    }
  };
  return (
    <div>
      <div className="flex flex-col py-[2.5rem] gap-[2.5rem]">
        <div className="text-center">
          <p className="text-primaryLight font-[400] text-[1rem] leading-[1rem]">
            Enter Your Mobile Number and we will send you a Otp for Mobile
            Number verfication
          </p>
        </div>
        {loading ? (
          <div className="px-[50%]">
            <svg
              aria-hidden="true"
              class="w-8 h-8 text-primary animate-spin dark:text-gray-600 text-secondary"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <form
            className="max-w-[38.625rem] px-[1.25rem] w-full m-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full">
              <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
                Mobile Number
              </label>
              <div className="relative pt-[.5rem] w-full">
                <div className=" absolute left-[0.5rem] top-[50%] translate-y-[-50%] flex items-center gap-[0.25rem]">
                  <img src="/phoneIcon.png" className="text-primary" />
                  <p className="text-[1rem] text-gray-400">|</p>
                </div>
                <input
                  className="border w-full border-primaryInputBorder rounded-lg h-[3rem] pl-[2.75rem] transition duration-300 ease-in-out hover:border-primary"
                  id=""
                  type="text"
                  placeholder="Enter Mobile Number"
                  {...register("phone_number")}
                  maxLength={10}
                  onKeyPress={handleKeyPressNumber}
                />
              </div>
              <p className="text-[red]">{errors.phone_number?.message}</p>
            </div>
            <div>
              <button className="btn-primary text-[1rem] font-[500] my-[1.5rem] leading-[1.5rem] w-full">
                Verify Mobile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MobilePopup;
