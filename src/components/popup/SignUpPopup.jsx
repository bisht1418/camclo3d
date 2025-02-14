import React, { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineMail, AiOutlineEyeInvisible } from "react-icons/ai";
import { LuPhone } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { socialAuth, userRegister } from "../../services/authService";
import { signupSchema } from "../../schema/signupSchema";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const SignUpPopup = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState([]);

  const navigate = useNavigate();

  const signupWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
    },
    onError: (error) => {
      return error;
    },
  });

  const getAuthTokn = async (token) => {
    const socialLogin = await socialAuth({
      access_token: token,
      provider: "google",
    });
    try {
      if (socialLogin?.status === 1) {
        toast.success(socialLogin?.message);
        onClose("openSignup");
        if (socialLogin?.data?.is_active === "1") {
          if (localStorage.getItem("visualizer")) {
            navigate("/visualizer");
          } else if (localStorage.getItem("credit")) {
            navigate("/credit");
          } else {
            navigate("/dashboard");
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
      close();
    }
  };
  useEffect(() => {
    if (Object.keys(user).length) {
      getAuthTokn(user.access_token);
    }
  }, [user]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(signupSchema),
  });
  const onSubmit = async (data) => {
    localStorage.setItem("mobile_number", data?.phone_number);
    const formData = new FormData();
    formData.append("first_name", data?.first_name);
    formData.append("last_name", data?.last_name);
    formData.append("email", data?.email);
    formData.append("password", data.password);
    formData.append("phone_number", data?.phone_number);
    setLoading(true);
    try {
      const response = await userRegister(formData);
      if (response?.status === 1) {
        toast.success("SignUp successfully. Need to verify the mobile number");
        toast.success(response?.message);
        onClose("openOTP");
        close();
      } else {
        const errors = response?.response?.data?.error;
        if (errors) {
          if (errors.email) {
            setError("email", { message: errors.email[0] });
          }
          if (errors.phone_number) {
            setError("phone_number", { message: errors.phone_number[0] });
          }
        }
        toast.error(response?.message);
      }
    } catch (error) {
      return error;
      // toast.error("Error adding Register");
    } finally {
      setLoading(false);
    }
  };
  const close = () => {
    reset({
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      password: "",
      confirm_password: "",
    });
  };

  const responseFacebook = async (response) => {
    const socialLogin = await socialAuth({
      access_token: response.accessToken,
      provider: "facebook",
    });
    try {
      if (socialLogin?.status === 1) {
        toast.success("Login Successful");
        onClose("openSignup");
        if (socialLogin?.data?.is_active === "1") {
          if (localStorage.getItem("visualizer")) {
            navigate("/visualizer");
          } else if (localStorage.getItem("credit")) {
            navigate("/credit");
          } else {
            navigate("/dashboard");
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
      close();
    }
  };

  const handleKeyPress = (event) => {
    const charCode = event.charCode;
    if (!/[a-zA-Z]/.test(String.fromCharCode(charCode))) {
      event.preventDefault();
    }
  };

  const handleKeyPressNumber = (event) => {
    const charCode = event.charCode;
    if (!/[0-9]/.test(String.fromCharCode(charCode))) {
      event.preventDefault();
    }
  };
  return (
    <div>
      <form
        className="max-w-[38.625rem] px-[0.5rem] md:px-[1.25rem] w-full m-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-wrap flex-row gap-[0.5rem] md:gap-[1.125rem] w-full">
          <div className="w-[calc(50%-0.25rem)] md:w-[calc(50%-0.563rem)]">
            <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
              First Name
            </label>
            <div className="relative pt-[.5rem]">
              <div className=" absolute left-[0.5rem] top-[50%] translate-y-[-34%] flex items-center gap-[0.25rem]">
                {/* <FaRegUser size={20} className="text-primary" /> */}
                <img src="/userNameIcon.png" className="text-primary" />
                <p className="text-[1rem] text-gray-400">|</p>
              </div>
              <input
                className="border border-primaryInputBorder rounded-lg w-full h-[3rem] pl-[2.75rem] transition duration-300 ease-in-out hover:border-primary placeholder:text-[0.85rem] md:placeholder:text-[1rem]"
                id="first_name"
                type="text"
                placeholder="First Name"
                {...register("first_name")}
                onKeyPress={handleKeyPress}
              />
            </div>
            <p className="text-[red]">{errors.first_name?.message}</p>
          </div>
          <div className="w-[calc(50%-0.25rem)] md:w-[calc(50%-0.563rem)]">
            <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
              Last Name
            </label>
            <div className="relative pt-[.5rem]">
              <div className=" absolute left-[0.5rem] top-[50%] translate-y-[-34%] flex items-center gap-[0.25rem]">
                {/* <FaRegUser size={20} className="text-primary" /> */}
                <img src="/userNameIcon.png" className="text-primary" />
                <p className="text-[1rem] text-gray-400">|</p>
              </div>
              <input
                className="border border-primaryInputBorder rounded-lg  h-[3rem] pl-[2.75rem] w-full transition duration-300 ease-in-out hover:border-primary placeholder:text-[0.85rem] md:placeholder:text-[1rem]"
                id="last_name"
                type="text"
                placeholder="Last Name"
                {...register("last_name")}
                onKeyPress={handleKeyPress}
              />
            </div>
            <p className="text-[red]">{errors.last_name?.message}</p>
          </div>
          <div className="w-[calc(50%-0.25rem)] md:w-[calc(50%-0.563rem)]">
            <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
              Email Address
            </label>
            <div className="relative pt-[.5rem]">
              <div className=" absolute left-[0.5rem] top-[50%] translate-y-[-34%] flex items-center gap-[0.25rem]">
                {/* <AiOutlineMail size={20} className="text-primary" /> */}
                <img src="/emailIcon.png" className="text-primary" />
                <p className="text-[1rem] text-gray-400">|</p>
              </div>
              <input
                className="border border-primaryInputBorder rounded-lg  h-[3rem] pl-[2.75rem] w-full transition duration-300 ease-in-out hover:border-primary placeholder:text-[0.85rem] md:placeholder:text-[1rem]"
                id="email"
                type="text"
                placeholder="Email Address"
                {...register("email")}
              />
            </div>
            <p className="text-[red]">{errors.email?.message}</p>
          </div>
          <div className="w-[calc(50%-0.25rem)] md:w-[calc(50%-0.563rem)]">
            <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
              Mobile Number
            </label>
            <div className="relative pt-[.5rem]">
              <div className=" absolute left-[0.5rem] top-[50%] translate-y-[-34%] flex items-center gap-[0.25rem]">
                <img src="/phoneIcon.png" className="text-primary" />
                <p className="text-[1rem] text-gray-400">|</p>
              </div>
              <input
                className="border border-primaryInputBorder rounded-lg h-[3rem] pl-[2.75rem] w-full transition duration-300 ease-in-out hover:border-primary placeholder:text-[0.85rem] md:placeholder:text-[1rem]"
                id="phone_number"
                type="text"
                placeholder="Mobile Number"
                {...register("phone_number")}
                maxLength={10}
                onKeyPress={handleKeyPressNumber}
              />
            </div>
            <p className="text-[red]">{errors.phone_number?.message}</p>
          </div>
          <div className="w-[calc(50%-0.25rem)] md:w-[calc(50%-0.563rem)]">
            <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
              Password
            </label>
            <div className="relative pt-[.5rem]">
              <div className=" absolute left-[0.5rem] top-[55%] translate-y-[-44%] flex items-center gap-[0.25rem]">
                <img
                  className="h-[1.25rem] w-[1.25rem]"
                  src="/password.svg"
                  alt="password icon"
                />
                <p className="text-[1rem] text-gray-400">|</p>
              </div>
              <input
                className="border border-primaryInputBorder rounded-lg w-full h-[3rem] pl-[2.75rem] pr-[2rem] transition duration-300 ease-in-out hover:border-primary placeholder:text-[0.85rem] md:placeholder:text-[1rem]"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
              />
              <div
                className="absolute right-[0.5rem] top-[60%] translate-y-[-44%] cursor-pointer"
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
          <div className="w-[calc(50%-0.25rem)] md:w-[calc(50%-0.563rem)]">
            <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
              Confirm Password
            </label>
            <div className="relative pt-[.5rem]">
              <div className=" absolute left-[0.5rem] top-[60%] translate-y-[-44%] flex items-center gap-[0.25rem]">
                <img
                  className="h-[1.25rem] w-[1.25rem]"
                  src="/password.svg"
                  alt="password icon"
                />
                <p className="text-[1rem] text-gray-400">|</p>
              </div>
              <input
                className="border border-primaryInputBorder rounded-lg w-full h-[3rem] pl-[2.75rem] pr-[2rem] transition duration-300 ease-in-out hover:border-primary placeholder:text-[0.85rem] md:placeholder:text-[1rem] "
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirm_password")}
              />
              <div
                className="absolute right-[0.5rem] top-[60%] translate-y-[-44%] cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <LuEye size={20} className="text-primaryLight" />
                ) : (
                  <AiOutlineEyeInvisible
                    size={20}
                    className="text-primaryLight"
                  />
                )}
              </div>
            </div>
            <p className="text-[red]">{errors.confirm_password?.message}</p>
          </div>
        </div>
        <button className="btn-primary text-[1rem] font-[500] w-full mt-[1.5rem] leading-[1.5rem]">
          Sign up
        </button>
      </form>
      <div className="flex flex-col items-center gap-[0.75rem] py-[1rem]">
        <p className="font-[400] text-[1rem] text-secondary">
          Or continue with
        </p>
        <div className="flex gap-[1rem]">
          <button
            className="flex items-center justify-center p-2 rounded-full cursor-pointer border border-[#CAC2D1] overflow-hidden"
            onClick={() => signupWithGoogle()}
          >
            <FcGoogle size={18} />
          </button>
          {/* <FacebookLogin
            appId="1260486952064586"
            autoLoad={false}
            cssClass="flex items-center justify-center rounded-full  hover:bg-[#CAC2D1] cursor-pointer border border-[#CAC2D1] overflow-hidden"
            fields="name,email,picture"
            callback={responseFacebook}
            icon={
              <img
                className="bg-[white] h-[38px] w-[38px] p-[9px] "
                src="/googleSignup.png"
              />
            }
            textButton=""
          /> */}
        </div>
        <p className="font-[400] text-[1rem] leading-[1.563rem] text-secondary">
          Already have an account?{" "}
          <span
            onClick={(e) => {
              e.preventDefault();
              onClose("openLogin");
            }}
            className="text-primary underline cursor-pointer font-[700] text-[1rem] leading-[1.563rem] "
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPopup;
