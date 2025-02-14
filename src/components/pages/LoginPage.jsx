import React, { useState } from "react";
import { t } from "../../utils/translate";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { current_language } = useSelector((state) => state.global);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = () => {
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f8f8f8] gap-[30px]">
      <img className="h-[100px] w-[auto]" src={"/logo_new.png"} alt="logo" />
      <div className="flex flex-col items-center justify-center w-full max-w-md shadow-lg p-[30px] rounded-[20px] bg-[#ffffff]">
        <h1 className="text-secondary text-3xl font-bold">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="mt-4 w-full p-3 rounded-md border border-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mt-4 w-full p-3 rounded-md border border-gray-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="mt-4 w-full p-3 rounded-md bg-primary text-white"
          onClick={handleSubmit}
        >
          {t("login")}
        </button>
        <div className="flex flex-col items-center gap-[10px] my-[20px]">
          <Link to={"/forgot-password"} className="text-secondary font-[500]">Forgot Password??</Link>
          <Link to={"/create-account"} className="text-secondary font-[500]">Create an Account</Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
