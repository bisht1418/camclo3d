import React, { useEffect } from "react";
import { aboutUSService } from "../../services/aboutUsService";
import { useSelector } from "react-redux";

const Story = () => {
  const { about } = useSelector((state) => state.about);
  const fetchAboutUS = async () => {
    const aboutUSData = await aboutUSService();
  };
  useEffect(() => {
    fetchAboutUS();
  }, []);


  return (
    <div className="flex flex-col items-center justify-center bg-white ">
      <div className="py-[3rem] lg:py-[6rem] max-w-[80rem] px-[1.25rem] w-full m-auto flex flex-col gap-[1.4rem] items-center">
        <h2 className="leading-[3.375rem] font-[700] text-[2.813rem] text-center pb-[0.5rem] lg:pb-[1rem]">
          The story behind <br />
          <span className="text-primary">CamClo3D</span>
        </h2>
        <div
          className="text-primaryLight text-[1rem] leading-[1.5rem] font-[400] text-center"
          dangerouslySetInnerHTML={{ __html: about.content }}
        >
        </div>
      </div>
    </div>
  );
};

export default Story;
