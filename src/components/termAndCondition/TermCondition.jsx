import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { termService } from "../../services/termConditionService";

const TermCondition = () => {
  const { term } = useSelector((state) => state.term);
  const fetchTermCondition = async () => {
    const aboutUSData = await termService();
  };
  useEffect(() => {
    fetchTermCondition();
  }, []);
 

  return (
    <>
      <div className="max-w-[80rem] px-6 m-auto py-[6rem] flex flex-col">
        <div className="flex flex-col py-[1.875rem]">
          <p
            className="font-[400] text-[1rem] leading-[1.51rem] text-primaryLight Roboto pt-[.75rem]"
            dangerouslySetInnerHTML={{ __html: term.content }}
          ></p>
        </div>
      </div>
    </>
  );
};

export default TermCondition;
