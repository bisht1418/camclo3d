import React, { useRef, useEffect } from 'react';
import { IoClose, IoCloseOutline, IoInformationCircle } from "react-icons/io5";

const Tooltip = ({ setTooltipVisible, tooltipVisible, description, videoUrl }) => {

  const tooltipRef = useRef(null);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setTooltipVisible(false);
      }
    };

    if (tooltipVisible) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [tooltipVisible, setTooltipVisible]);

  const handleTooltipClick = () => {
    setTooltipVisible(!tooltipVisible);
  };

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      <button
        type="button"
        onClick={handleTooltipClick}
        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full"
        aria-expanded={tooltipVisible}
        aria-haspopup="dialog"
      >
        <IoInformationCircle size={24} className="text-primaryLight hover:text-primary transition-colors" />
      </button>

      {tooltipVisible && (
        <>
          {/* Modal */}
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full relative max-w-[1000px] max-h-[calc(100vh-80px)] mx-4">
              <div className="flex justify-between p-[1.87rem] border-b-2">
                <h2 className="font-[700] text-[1.625rem] leading-[1.95rem] text-secondary Barlow">
                  Instruction
                </h2>
                <button
                  onClick={() => setTooltipVisible(false)}
                  aria-label="Close modal"
                >
                  <IoCloseOutline
                    size={20}
                    className="text-[white] !bg-primary rounded-[100%]"
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-[1.87rem] overflow-auto max-h-[calc(100vh-173px)] !scrollbar">
                <div className="pb-[1.87rem]">
                  <div
                    className="font-[400] text-[1.15rem] leading-[1.95rem] text-primaryLight Barlow pb-2"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                  {videoUrl && (
                    <div className="mt-8">
                      <video controls className="w-full rounded-lg h-[380px]">
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tooltip;
