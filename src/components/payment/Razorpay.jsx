import React, { useEffect, useState } from "react";
import baseService from "../../services/baseService";
import { ROUTES } from "../../utils/apiRoutes";
import { toast } from "react-toastify";
import { store } from "../../redux/store";

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Razorpay = ({ feature, user, handlePurchase }) => {
  const [loading, setLoading] = useState(false);
  const token = store.getState().auth.token;
  const BASE_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const createOrder = async (price) => {
    const formData = new FormData();
    formData.append("amount", price);

    const response = await baseService.post(
      ROUTES.PAYMENT.CREATEORDER,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data?.data[0]?.order_id;
  };

  const verifyPayment = async (paymentResponse) => {
    const verificationData = new FormData();
    verificationData.append(
      "razorpay_order_id",
      paymentResponse?.razorpay_order_id
    );
    verificationData.append(
      "razorpay_payment_id",
      paymentResponse?.razorpay_payment_id
    );
    verificationData.append(
      "razorpay_signature",
      paymentResponse?.razorpay_signature
    );

    const response = await baseService.post(
      ROUTES.PAYMENT.VERIFYPAYMENT,
      verificationData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data?.status === 1;
  };

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);

    const price = feature?.actual_price;
    if (!price) {
      toast.error("Invalid price");
      setLoading(false);
      return;
    }

    const priceInPaisa = price * 100;

    try {
      const orderId = await createOrder(price);
      if (!orderId) {
        toast.error("Failed to create order");
        setLoading(false);
        return;
      }

      const options = {
        key: BASE_KEY,
        amount: priceInPaisa,
        currency: "INR",
        name: "Visualizer",
        description: feature?.tagline,
        image: "/logo.png",
        order_id: orderId,
        handler: async function (response) {
          const isVerified = await verifyPayment(response);
          if (isVerified) {
            // toast.success("Payment Successful");
            handlePurchase(feature?._id);
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: `${user?.first_name} ${user?.last_name}`,
          email: user?.email,
          contact: user?.mobile_no,
        },
        notes: { address: null },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: () => {
            toast.warn("Payment was cancelled.");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error("Error creating order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn-primary mt-[auto] text-[1rem] font-[700] z-10 leading-[1.5rem] w-full group-hover:!bg-white group-hover:!text-primary"
      onClick={handlePayment}
      disabled={loading}
    >
      Purchase Credits
    </button>
  );
};

export default Razorpay;
