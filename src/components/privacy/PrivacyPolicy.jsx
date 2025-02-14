import React, { useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import { privacyPolicyService } from "../../services/privacyPolicyService";

const PrivacyPolicy = () => {
  const { privacy } = useSelector((state) => state.privacy);
  const fetchPrivacyPolicy = async () => {
    const aboutUSData = await privacyPolicyService();
  };
  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  return (
    <>
      <div className="max-w-[80rem] px-6 m-auto py-[6rem] flex flex-col">
        <div className="flex flex-col py-[1.875rem]">
          <p
            className="font-[400] text-[1rem] leading-[1.51rem] text-primaryLight Roboto pt-[.75rem]"
            dangerouslySetInnerHTML={{ __html: privacy.content }}
          ></p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
