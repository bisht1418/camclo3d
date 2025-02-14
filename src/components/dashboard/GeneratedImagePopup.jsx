import React from "react";
import { IoMdClose } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";

const GeneratedImagePopup = ({
  handelShowMore,
  dashboard,
  handleDownload,
  title,
  handleFabric,
  handelShowMoreFabric,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg max-w-[80%]">
        <div className="flex justify-between p-[30px] border-b">
          <h2 className="font-[700] text-[1.625rem] leading-[1.95rem] text-secondary Barlow">
            {title}
          </h2>
          <button className="" onClick={handelShowMore || handelShowMoreFabric}>
            <IoCloseOutline
              size={20}
              className="text-[white] !bg-primary rounded-[100%]"
            />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto h-[75vh] p-[30px]">
          <div className="grid grid-cols-5 gap-4">
            {title === "Generated Image"
              ? dashboard?.generated_images?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center p-4 border border-gray-200 transition-transform duration-300 transform hover:scale-105"
                  >
                    <button
                      className="w-full h-full flex items-center justify-center"
                      onClick={() => {
                        handleDownload(item?.image);
                        handelShowMore();
                      }}
                    >
                      <img
                        src={item?.image}
                        width="120px"
                        height="120px"
                        className="object-cover object-center rounded-lg bg-[#f9fafc]"
                      />
                    </button>
                  </div>
                ))
              : dashboard?.fabrics?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center p-4 border border-gray-200 transition-transform duration-300 transform hover:scale-105"
                  >
                    <button
                      className="w-full h-full flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFabric(item?.image);
                      }}
                    >
                      <img
                        src={item?.image}
                        width="120px"
                        height="120px"
                        className="object-cover object-center rounded-lg bg-[#f9fafc] h-[120px]"
                      />
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedImagePopup;
