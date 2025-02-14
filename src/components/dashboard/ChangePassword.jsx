import React, { useState } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { changePasswordSchema } from "../../schema/changePassword";
import { changePassword } from "../../services/authService";
import DashboardNavbar from "./DashboardNavbar";

const ChangePassword = ({ title }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleNewPasswordVisibility = () => {
    setNewPassword(!newPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPassword(!confirmPassword);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("current_password", data?.current_password);
    formData.append("password", data?.password);
    formData.append("password_confirmation", data?.password_confirmation);
    setLoading(true);
    try {
      const response = await changePassword(formData);
      if (response?.status === 1) {
        toast.success("Password Update Successfully");
        close();
      } else {
        const errors = response?.response?.data?.errors;
        if (errors) {
          setError("current_password", { message: errors.current_password });
        }
      }
    } catch (error) {
      toast.error(error);
      return error;
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    reset({
      current_password: "",
      password: "",
      password_confirmation: "",
    });
  };
  return (
    <>
      <DashboardNavbar />
      <div className="container-custom">
        <h1 className="text-secondary text-[2rem] font-semibold my-[3.125rem]">
          {title}
        </h1>
        <div className="flex flex-col bg-white py-[3.125rem] rounded-[1rem] ">
          <div className="text-center py-[2rem]  ">
            <div className="relative outline-dotted outline-[#E1D9E9] outline-[0.188rem] rounded-full w-[6.25rem] h-[6.25rem] flex justify-center items-center mx-auto before:absolute before:w-4 before:h-4 before:bg-white before:border before:border-[#E1D9E9] before:rounded-full before:left-0 before:bottom-3 after:absolute after:w-4 after:h-4 after:bg-white after:border after:border-[#E1D9E9] after:rounded-full after:right-0 after:top-3">
              <div className="bg-[#34C759] rounded-full w-[5rem] h-[5rem] flex justify-center items-center">
                <img
                  src="/password.png"
                  alt="passwordIcon"
                  className="w-12 h-12"
                />
              </div>
            </div>
          </div>
          <div className="text-center py-[.7rem] max-w-[42.5rem] px-[1.25rem] w-full m-auto">
            <h2 className="font-[700] text-[1.5rem] leading-[1.8rem] text-secondary Barlow">
              Create new password
            </h2>
            <p className="text-center font-[400] text-[1rem] leading-[1.2rem] text-primaryLight Barlow pt-[.6rem] ">
              To change your password, please fill in the fields below. Your
              password must contain at least 8 characters, it must also include
              at least one upper case letter, one lower case letter, one number
              and one special character.
            </p>
          </div>
          <div>
            <form
              className="max-w-[42.5rem] px-[1.25rem] w-full m-auto py-[2.6rem]"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="w-full pb-[1.25rem]">
                <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
                  Old Password
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
                    placeholder="Enter Old Password"
                    {...register("current_password")}
                  />
                  <div
                    className="absolute right-[0.5rem] top-[60%] translate-y-[-50%] cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <LuEye size={20} className="text-primaryLight" />
                    ) : (
                      <AiOutlineEyeInvisible
                        size={20}
                        className="text-primaryLight"
                      />
                    )}
                  </div>
                </div>
                <p className="text-[red]">{errors.current_password?.message}</p>
              </div>
              <div className="w-full pb-[1.25rem]">
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
                    type={newPassword ? "text" : "password"}
                    placeholder="Enter New Password"
                    {...register("password")}
                  />
                  <div
                    className="absolute right-[0.5rem] top-[60%] translate-y-[-50%] cursor-pointer"
                    onClick={toggleNewPasswordVisibility}
                  >
                    {newPassword ? (
                      <LuEye size={20} className="text-primaryLight" />
                    ) : (
                      <AiOutlineEyeInvisible
                        size={20}
                        className="text-primaryLight"
                      />
                    )}
                  </div>
                </div>
                <p className="text-[red]">{errors.password?.message}</p>
              </div>
              <div className="w-full">
                <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
                  Confirm New Password
                </label>
                <div className="relative pt-[.5rem] w-full">
                  <div className=" absolute left-[0.5rem] top-[55%] translate-y-[-50%] flex items-center gap-[0.25rem]">
                    <img src="/password.svg" alt="password icon" />
                    <p className="text-[1rem] text-gray-400">|</p>
                  </div>
                  <input
                    className="border w-full border-primaryInputBorder rounded-lg h-[3rem] pl-[2.75rem] pr-[2rem] transition duration-300 ease-in-out hover:border-primary"
                    id="password"
                    type={confirmPassword ? "text" : "password"}
                    placeholder="Re-Enter Password"
                    {...register("password_confirmation")}
                  />
                  <div
                    className="absolute right-[0.5rem] top-[60%] translate-y-[-50%] cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {confirmPassword ? (
                      <LuEye size={20} className="text-primaryLight" />
                    ) : (
                      <AiOutlineEyeInvisible
                        size={20}
                        className="text-primaryLight"
                      />
                    )}
                  </div>
                </div>
                <p className="text-[red]">
                  {errors.password_confirmation?.message}
                </p>
              </div>
              <button
                type="submit"
                className="btn-primary text-[1rem] font-[500] mt-[1.5rem] leading-[1.5rem] w-full"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
