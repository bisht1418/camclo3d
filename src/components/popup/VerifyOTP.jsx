import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../../redux/store";
import { resendOtp, verifyOtp } from "../../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyOTP = ({ onClose, edit }) => {
  const [values, setValues] = useState(["", "", "", ""]);
  const mobile_number=localStorage.getItem("mobile_number")
  const token = store.getState().auth.token;
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const user_id = useSelector((store) => store.auth?.user);
  const navigate = useNavigate();
  const otpVerify = async () => {
    const result = values.join("");
    const formData = new FormData();
    formData.append("user_id", user_id[0]?._id || user_id?._id);
    formData.append("otp", result);
    formData.append("mobile_no", mobile_number);

    try {
      let response = await verifyOtp(formData, edit);
      if (response?.status === 1) {
        toast.success(response?.message);
        localStorage.removeItem("mobile_number")
        onClose("openLogin");
        if (edit) {
          navigate("/profile");
        } else if (Object.keys(token)?.length > 0) {
          navigate("/dashboard");
        }
      } else {
        toast.error('Enter valid OTP');
      }
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < values.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      const newValues = [...values];
      newValues[index - 1] = "";
      setValues(newValues);
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text");
    if (pasteData.length === 6) {
      const newValues = pasteData.split("").slice(0, 4);
      setValues(newValues);
      inputRefs.current[newValues.length - 1].focus();
    }
  };
  const resend = async () => {
    const formData = new FormData();
    formData.append("user_id", user_id[0]?._id || user_id?._id);
    formData.append("mobile_no", mobile_number);
    try {
      let response = await resendOtp(formData);
      if (response?.status === 1) {
        toast.success(response?.message);
      } else {
        toast.error("response?.message");
      }
    } catch (error) {
      toast.error("Error sending Otp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-center w-[25rem] h-[2rem] mt-[1.563rem] text-[#7E6E8C] text-[0.875rem] font-[400]">
        To complete the process please enter the verification code we sent you
        on your mobile number
      </p>
      <div className="mt-[2.5rem] flex flex-col justify-center items-center">
        <p className="text-[0.875rem] font-[700] text-[#391952]">
          Verification Code
        </p>
        <div className="flex justify-center items-center gap-[1.125rem] mt-[0.75rem]">
          {values.map((item, index) => (
            <div key={index}>
              <input
                maxLength="1"
                className="w-[3rem] text-center h-[3rem] border rounded-md flex justify-center items-center border-[#E1D9E9] outline-[#E1D9E9] cursor-pointer"
                value={values[index]}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onPaste={(e) => handlePaste(e, index)}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        className="mt-[2.5rem] bg-[#8C2A8D] w-[38.62rem] h-[3.25rem] rounded-lg text-[#ffffff] font-[500] text-[1rem]"
        onClick={(event) => {
          event.preventDefault();
          otpVerify();
        }}
      >
        Verify OTP
      </button>
      <p className="my-[2.813rem] text-[1rem] text-[#391952]">
        Didn't receive the code?
        <span
          onClick={resend}
          className="text-[#92278F] font-[400] cursor-pointer"
        >
          {" "}
          Resend
        </span>{" "}
      </p>
    </div>
  );
};

export default VerifyOTP;
