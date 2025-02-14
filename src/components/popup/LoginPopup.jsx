import React, { useEffect, useState } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { LuEye } from "react-icons/lu";
import { loginSchema } from "../../schema/loginSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { login, socialAuth } from "../../services/authService";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import FacebookLogin from "react-facebook-login";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const naviagte = useNavigate();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
    },
    onError: () => {
      toast.error("Google login failed. Please try again.");
    },
  });

  const getAuthTokn = async (token) => {
    const socialLogin = await socialAuth({
      access_token: token,
      provider: "google",
    });
    try {
      if (socialLogin?.status === 1) {
        toast.success("Login Successful");
        onClose("openLogin");
        if (socialLogin?.data?.is_active === "1") {
          if(localStorage.getItem("visualizer"))
            {  
              naviagte("/visualizer");
  
            }
            else if(localStorage.getItem("credit"))
            {
              naviagte("/credit");
            }
            else
            {
              naviagte("/dashboard");
  
            }
        } else {
          onClose("openMobile");
        }
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (Object.keys(user)?.length) {
      getAuthTokn(user.access_token);
    }
  }, [user]);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("email", data?.email);
    formData.append("password", data.password);
    setLoading(true);
    try {
      const response = await login(formData);
      if (response?.status === 1) {
        toast.success("Login Successful");
        onClose("openLogin");
        if (response?.data?.is_active === "1") {
          if(localStorage.getItem("visualizer"))
            {  
              naviagte("/visualizer");
  
            }
            else if(localStorage.getItem("credit"))
            {
              naviagte("/credit");
            }
            else
            {
              naviagte("/dashboard");
  
            }
        } else {
          onClose("openMobile");
        }

        close();
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      return error;
      // toast.error("Error login");
    } finally {
      setLoading(false);
    }
  };
  const close = () => {
    reset({
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <form
        className="max-w-[38.625rem] px-[1.25rem] w-full m-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full mb-[1.1rem]">
          <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
            Email Address
          </label>
          <div className="relative pt-[.5rem]  w-full">
            <div className=" absolute left-[0.5rem] top-[60%] translate-y-[-60%] flex items-center gap-[0.25rem]">
              <img src="/emailIcon.png" className="text-primary" />
              <p className="text-[1rem] text-gray-400">|</p>
            </div>
            <input
              className="border w-full border-primaryInputBorder rounded-lg h-[3rem] pl-[2.75rem] transition duration-300 ease-in-out hover:border-primary"
              id=""
              type="text"
              placeholder="Enter Email Address"
              {...register("email")}
            />
          </div>
          <p className="text-[red]">{errors.email?.message}</p>
        </div>
        <div className="w-full">
          <label className="text-secondary font-[400] text-[1rem] mt-[1.1rem] leading-[1rem]">
            Password
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
              placeholder="Enter Password"
              {...register("password")}
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
          <p className="text-[red]">{errors.password?.message}</p>
        </div>
        <button
          type="submit"
          className="btn-primary text-[1rem] font-[500] mt-[1.5rem] leading-[1.5rem] w-full"
        >
          Log in
        </button>
      </form>
      <div className="max-w-[38.625rem] px-[1.25rem] w-full m-auto">
        <div className="w-full flex justify-end">
          <a
            onClick={(e) => {
              e.preventDefault();
              onClose("openForgetPassword");
            }}
            className="w-full font-[700] text-[1rem] leading-[1.55rem] text-end text-primary underline cursor-pointer"
          >
            Forget Password
          </a>
        </div>
        <div className="flex flex-col items-center gap-[0.75rem] py-[1rem]">
          <p className="font-[400] text-[1rem] text-secondary">
            Or continue with
          </p>
          <div className="flex gap-[1rem] w-full justify-center">
            <button
              className="flex items-center justify-center p-2 rounded-full cursor-pointer border border-[#CAC2D1] overflow-hidden"
              onClick={() => loginWithGoogle()}
            >
              <FcGoogle size={18} />
            </button>
          </div>
          <p className="font-[400] text-[1rem] leading-[1.563rem] text-secondary">
            Didn’t have an account?{" "}
            <span
              className="text-primary underline cursor-pointer font-[700] text-[1rem] leading-[1.563rem] "
              onClick={(e) => {
                e.preventDefault();
                onClose("openSignup");
              }}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
