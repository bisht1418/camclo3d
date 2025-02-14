import React, { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { touchSchema } from "../../schema/touchSchema";
import { inquiryService } from "../../services/ourServiceService";
import { toast } from "react-toastify";

const Touch = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(touchSchema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data?.name);
    formData.append("email", data?.email);
    formData.append("message", data.message);
    setLoading(true);
    try {
      const response = await inquiryService(formData);
      if (response?.status === 1) {
        toast.success("Inquiry Added Successfully");
      } else {
        toast.error("Inquiry Added Unsuccessful");
      }
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
      close();
    }
    close();
  };

  const close = () => {
    reset({
      name: "",
      email: "",
      message: "",
    });
  };

  const handleKeyPress = (event) => {
    const charCode = event.charCode;
    const char = String.fromCharCode(charCode);
    if (!/[a-zA-Z\s]/.test(char)) {
      event.preventDefault();
    }
  };

  return (
    <div className="flex-col py-[3rem] lg:py-[6rem] ">
      <div className=" max-w-[80rem] px-[1.25rem] mx-auto">
        <h2 className="leading-[3.375rem] font-[700] text-[2.813rem] text-center text-secondary ">
          Get in <span className="text-primary">touch </span>
        </h2>
        <p className="text-center py-[.5rem] text-[#7E6E8C] leading-[1.5rem] text-[1rem] font-[400]  ">
          Get in touch for your special requirements and we can customize a plan
          for you.
        </p>
      </div>
      <div className="flex flex-col-reverse lg:flex-row max-w-[80rem]  mx-auto pt-[3rem] px-[1.25rem] items-center gap-[2.5rem] lg:gap-[4.5rem]">
        <div className="w-full max-w-xl">
          <form className="  m-auto" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full mb-[1rem]">
              <label className="text-secondary font-[400] text-[1rem] leading-[1rem] mb-[0.5rem] block">
                Full Name:
              </label>
              <div className="relative w-full">
                <div className=" absolute left-[0.5rem] top-[50%] translate-y-[-50%] flex items-center gap-[0.25rem]">
                  <img src="/userNameIcon.png" className="text-primary" />
                  <p className="text-[1rem] text-gray-400">|</p>
                </div>
                <input
                  className="border w-full border-primaryInputBorder rounded-lg h-[3rem] pl-[2.75rem] pr-[0.8rem] transition duration-300 ease-in-out hover:border-primary"
                  id=""
                  type="text"
                  placeholder="Enter Your Name"
                  {...register("name")}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <p className="text-[red]">{errors.name?.message}</p>
            </div>
            <div className="w-full mb-[1rem]">
              <label className="text-secondary font-[400] text-[1rem] leading-[1rem]  mb-[0.5rem] block">
                Email Address:
              </label>
              <div className="relative w-full">
                <div className=" absolute left-[0.5rem] top-[50%] translate-y-[-50%] flex items-center gap-[0.25rem]">
                  <img src="/emailIcon.png" className="text-primary" />
                  <p className="text-[1rem] text-gray-400">|</p>
                </div>
                <input
                  className="border w-full  border-primaryInputBorder rounded-lg pr-[0.8rem] h-[3rem] pl-[2.75rem] transition duration-300 ease-in-out hover:border-primary"
                  id=""
                  type="text"
                  placeholder="Enter Your Email Address"
                  {...register("email")}
                />
              </div>
              <p className="text-[red]">{errors.email?.message}</p>
            </div>
            <div className="w-full mb-[1rem]">
              <label className="text-secondary font-[400] text-[1rem] leading-[1rem]  mb-[0.5rem] block">
                Message:
              </label>
              <div className="relative w-full">
                <textarea
                  className="border w-full h-[9.5rem] pl-[1rem] pt-[1rem]  border-primaryInputBorder rounded-lg   transition duration-300 ease-in-out hover:border-primary"
                  id=""
                  type="text"
                  placeholder="Enter Your Message"
                  {...register("message")}
                />
              </div>
              <p className="text-[red]">{errors.message?.message}</p>
            </div>
            <button
              type="submit"
              className="btn-primary text-[1rem] font-[500] mt-[0.75rem] w-full leading-[1.5rem] "
            >
              Submit
            </button>
          </form>
        </div>
        <div className="">
          <img src="/touch.png" />
        </div>
      </div>
    </div>
  );
};

export default Touch;
