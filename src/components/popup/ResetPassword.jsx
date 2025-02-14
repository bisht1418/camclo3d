import React, { useState } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPassword } from "../../services/authService";
import { toast } from "react-toastify";
import { resetPasswordSchema } from "../../schema/resetPasswordSchema";
const ResetPassword = ({ onClose, token }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("token", token);
    formData.append("new_password", data?.new_password);
    formData.append("new_password_confirm", data?.new_password_confirm);
    setLoading(true);
    try {
      const response = await resetPassword(formData);
      if (response?.status === 1) {
        toast.success("Password Reset Successfully");
        onClose("openLogin");
        removeTokenFromURL();
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
  const close = () => {
    reset({
      new_password: "",
      new_password_confirm: "",
    });
  };

  const removeTokenFromURL = () => {
    const baseUrl = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, baseUrl);
  };
  return (
    <div className="flex flex-col py-[.5rem] gap-[2.5rem]">
      <div className="text-center">
        <p className="text-primaryLight font-[400] text-[1rem] leading-[1rem]">
          Enter Your Email address and we will send you a link to reset your
          password
        </p>
      </div>
      <form
        className="max-w-[38.625rem] px-[1.25rem]  w-full m-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full">
          <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
            New Password
          </label>
          <div className="relative pt-[.5rem] w-full">
            <div className=" absolute left-[0.5rem] top-[55%] translate-y-[-50%] flex items-center gap-[0.25rem]">
              <img src="/password.svg" alt="password icon" />
              <p className="text-[1rem] text-gray-400">|</p>
            </div>
            <input
              className="border w-full border-primaryInputBorder rounded-lg h-[3rem] pl-[2.75rem] pr-[2rem] transition duration-300 ease-in-out hover:border-primary"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              {...register("new_password")}
            />
            <div
              className="absolute right-[0.5rem] top-[60%] translate-y-[-50%] cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <LuEye size={20} className="text-primary" />
              ) : (
                <AiOutlineEyeInvisible size={20} className="text-primary" />
              )}
            </div>
          </div>
          <p className="text-[red]">{errors.new_password?.message}</p>
        </div>
        <div className="w-full pt-[.5rem]">
          <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
            New Password Confirm
          </label>
          <div className="relative pt-[.5rem] w-full">
            <div className=" absolute left-[0.5rem] top-[55%] translate-y-[-50%] flex items-center gap-[0.25rem]">
              <img src="/password.svg" alt="password icon" />
              <p className="text-[1rem] text-gray-400">|</p>
            </div>
            <input
              className="border w-full border-primaryInputBorder rounded-lg h-[3rem] pl-[2.75rem] pr-[2rem] transition duration-300 ease-in-out hover:border-primary"
              id=""
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter New Password Confirm"
              {...register("new_password_confirm")}
            />
            <div
              className="absolute right-[0.5rem] top-[60%] translate-y-[-50%] cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <LuEye size={20} className="text-primary" />
              ) : (
                <AiOutlineEyeInvisible size={20} className="text-primary" />
              )}
            </div>
          </div>
          <p className="text-[red]">{errors.new_password_confirm?.message}</p>
        </div>
        <button className="btn-primary text-[1rem] font-[500] my-[1.5rem] leading-[1.5rem] w-full">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
