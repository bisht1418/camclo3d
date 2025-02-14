import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { GoPencil } from "react-icons/go";
import { FaRegUser, FaRegUserCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "../../schema/profileSchema";
import {
  editProfile,
  mobileVerify,
  myProfile,
  userPhoto,
} from "../../services/authService";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa6";
import { useSelector } from "react-redux";
import PopupTemplete from "../popup/Index";
import VerifyOTP from "../popup/VerifyOTP";
import DashboardNavbar from "./DashboardNavbar";

const MyProfile = ({ profile, title }) => {
  const [callprofile, setCallProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const user_id = useSelector((store) => store.auth.user)._id;
  const image = useSelector((store) => store.auth.user)?.image;
  const [open, setOpen] = useState({
    openOTP: false,
  });

  const onClose = () => {
    setOpen({ ...open, openOTP: !open.openOTP });
  };
  const myProfileData = async () => {
    let res = await myProfile();
  };
  useEffect(() => {
    myProfileData();
  }, [callprofile, open?.openOTP, !open?.openOTP]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
  });
  const onSubmit = async (data) => {
    setCallProfile(true);
    const formData = new FormData();
    formData.append("first_name", data?.first_name);
    formData.append("last_name", data?.last_name);
    formData.append("email", data?.email);
    formData.append("mobile_no", data?.mobile_no);
    setLoading(true);
    try {
      if (data?.mobile_no === profile?.mobile_no) {
        const response = await editProfile(formData);

        if (response?.status === 1) {
          toast.success("Edit Successful");
          setEdit(!edit);
        } else {
          toast.error("Edit Unsuccessful");
        }
      } else {
        const formData = new FormData();
        formData.append("phone_number", data?.mobile_no);
        formData.append("user_id", user_id);
        localStorage.setItem("mobile_number", data?.mobile_no);
        const response = await mobileVerify(formData);
        if (response?.status === 1) {
          toast.success("Otp Send To Mobile Number Successfully");
          onClose();
          setEdit(!edit);
        } else {
          toast.error(response?.response?.data?.message);
        }
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
  useEffect(() => {
    reset({ ...profile });
  }, [callprofile, profile, open?.openOTP, !open?.openOTP]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file is an image
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image file.");
        return; // Stop the function if the file type is not allowed
      }

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await userPhoto(formData);
        if (response?.status === 1) {
          toast.success("Profile Upload Successful");
        } else {
          toast.error("Failed to Upload Profile");
        }
      } catch (error) {
        toast.error("An error occurred while uploading the profile.");
        console.error(error); // Log the error for debugging
      }
    }
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <>
      {open?.openOTP && (
        <PopupTemplete
          title={"Verify OTP"}
          bodyComponent={
            <VerifyOTP onClose={(view) => onClose(view)} edit={true} />
          }
          onClose={onClose}
        />
      )}
      <DashboardNavbar />
      <div className="container-custom">
        <h1 className="text-secondary text-[2rem] font-semibold my-[3.125rem]">
          {title}
        </h1>

        <div className=" bg-[#fff] rounded-md pb-[3.125rem]">
          <div className=" h-[7.5rem] bg-gradient-to-r from-primaryLight to-primary rounded-t-md"></div>

          <div className="flex justify-between items-center px-[1.563rem] mb-[2.5rem] gap-6 md:flex-nowrap flex-wrap">
            <div className="flex justify-center items-center gap-[1.563rem]">
              {/* <div className=" bg-white rounded-full shadow-[2px_2px_12px_0px_#CAC2D1] mt-[-1.875rem] relative">
                {" "}
                <img
                  src={image}
                  alt="User"
                  className="h-[9.375rem] w-[9.375rem] rounded-full border-white border-2 object-cover"
                />
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center m-auto absolute bottom-[.15rem] right-[.5rem] cursor-pointer">
                  <img src="/icn-edit.svg" alt="Edit" className="w-6 h-6" />
                </div>
              </div> */}
              <div className="bg-white rounded-full shadow-[2px_2px_12px_0px_#CAC2D1] mt-[-1.875rem] relative">
                <img
                  src={image || "/universalUser.jpg"}
                  alt="User"
                  className="h-[9.375rem] w-[9.375rem] rounded-full border-white border-2 object-cover"
                />
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <div
                  className="w-9 h-9 bg-primary rounded-full flex items-center justify-center m-auto absolute bottom-[.15rem] right-[.5rem] cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick();
                  }}
                >
                  <img src="/icn-edit.svg" alt="Edit" className="w-6 h-6" />
                </div>
              </div>
              <div className="flex flex-col gap-[.5rem]">
                <p className="text-[#381952] text-[1.5rem] font-[700]">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-[#7E6E8C]">{profile?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setEdit(!edit)}
              className="flex justify-center items-center border border-[#8C2A8D] rounded-xl p-2 gap-3"
            >
              <div>
                <GoPencil className="w-[1.375rem] h-[1.375rem] text-[#8C2A8D]" />
              </div>
              <p className="text-[#8C2A8D] font-[700] text-[1.125rem]">
                Edit Profile
              </p>
            </button>
          </div>
          {/* <form/> */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 md:gap-8 gap-4 items-center px-[1.563rem]">
              <div className="w-full">
                <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
                  First Name
                </label>
                <div className="relative pt-[.5rem]">
                  <div className=" absolute left-[0.5rem] top-[50%] translate-y-[-34%] flex items-center gap-[0.25rem]">
                    <img src="/userNameIcon.png" className="text-primary" />
                    <p className="text-[1rem] text-gray-400">|</p>
                  </div>
                  <input
                    disabled={!edit}
                    className={`border border-primaryInputBorder rounded-lg  h-[3rem] pl-[2.75rem] w-full transition duration-300 ease-in-out hover:${edit ?'border-primary' : ''} placeholder:text-[0.85rem] md:placeholder:text-[1rem]`}
                    id="last_name"
                    type="text"
                    placeholder="First Name"
                    {...register("first_name")}
                    maxLength={20}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <p className="text-[red]">{errors.first_name?.message}</p>
              </div>
              <div className="w-full">
                <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
                  Last Name
                </label>
                <div className="relative pt-[.5rem]">
                  <div className=" absolute left-[0.5rem] top-[50%] translate-y-[-34%] flex items-center gap-[0.25rem]">
                    <img src="/userNameIcon.png" className="text-primary" />
                    <p className="text-[1rem] text-gray-400">|</p>
                  </div>
                  <input
                    disabled={!edit}
                    className={`border border-primaryInputBorder rounded-lg  h-[3rem] pl-[2.75rem] w-full transition duration-300 ease-in-out hover:${edit ?'border-primary' : ''} placeholder:text-[0.85rem] md:placeholder:text-[1rem]`}
                    id="last_name"
                    type="text"
                    placeholder="Last Name"
                    {...register("last_name")}
                    maxLength={20}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <p className="text-[red]">{errors.last_name?.message}</p>
              </div>
              <div className="w-full">
                <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
                  Email
                </label>
                <div className="relative pt-[.5rem]">
                  <div className=" absolute left-[0.5rem] top-[50%] translate-y-[-34%] flex items-center gap-[0.25rem]">
                    <img src="/emailIcon.png" className="text-primary" />
                    <p className="text-[1rem] text-gray-400">|</p>
                  </div>
                  <input
                    disabled={!edit || !profile?.social_login}
                    className={`border border-primaryInputBorder ${profile?.social_login || edit  ? "cursor-not-allowed" :""} rounded-lg  h-[3rem] pl-[2.75rem] w-full transition duration-300 ease-in-out placeholder:text-[0.85rem] md:placeholder:text-[1rem]`}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                  />
                </div>
                <p className="text-[red]">{errors.email?.message}</p>
              </div>
              <div className="w-full">
                <label className="text-secondary font-[400] text-[1rem] leading-[1rem]">
                  Mobile Number
                </label>
                <div className="relative pt-[.5rem]">
                  <div className=" absolute left-[0.5rem] top-[50%] translate-y-[-34%] flex items-center gap-[0.25rem]">
                    <img src="/phoneIcon.png" className="text-primary" />
                    <p className="text-[1rem] text-gray-400">|</p>
                  </div>
                  <input
                    disabled={!edit}
                    className={`border border-primaryInputBorder rounded-lg  h-[3rem] pl-[2.75rem] w-full transition duration-300 ease-in-out hover:${edit ?'border-primary' : ''} placeholder:text-[0.85rem] md:placeholder:text-[1rem]`}
                    id="last_name"
                    type="text"
                    placeholder="Enter your Mobile Number"
                    {...register("mobile_no")}
                    onKeyPress={handleKeyPressNumber}
                    maxLength={10}
                  />
                </div>
                <p className="text-[red]">{errors.mobile_no?.message}</p>
              </div>
            </div>
            {edit && (
              <div className="flex mx-auto justify-center">
                <button className="btn-primary mt-[1.5rem] mx-auto">
                  Update
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
