import { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

const VisulaizerModel = ({ open, onClose, selectedItem }) => {
  useEffect(() => {
    if (open) {
      // Disable scrolling on the body
      document.body.style.overflow = "hidden";
    } else {
      // Enable scrolling on the body
      document.body.style.overflow = "";
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-full relative max-w-[1000px] max-h-[calc(100vh-80px)] mx-4">
          <div className="flex justify-between p-[1.87rem] border-b-2">
            <h2 className="font-[700] text-[1.625rem] leading-[1.95rem] text-secondary Barlow">
              Instruction
            </h2>
            <button className="" onClick={onClose}>
              <IoCloseOutline
                size={20}
                className="text-[white] !bg-primary rounded-[100%]"
              />
            </button>
          </div>

          <div className="p-[1.87rem] overflow-auto max-h-[calc(100vh-173px)] !scrollbar">
            <div className="pb-[1.87rem]">
              {selectedItem.description && (
                <div
                  className="font-[400] text-[1.15rem] leading-[1.95rem] text-primaryLight Barlow"
                  dangerouslySetInnerHTML={{ __html: selectedItem.description }}
                ></div>
              )}
              {selectedItem.videoUrl && (
                <video controls className="w-full rounded-lg h-[380px]">
                  <source src={selectedItem.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisulaizerModel;
